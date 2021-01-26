using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Xunit;
using Moq;
using TODO.Controllers;
using TODO.Data;
using TODO.Data.Models;
using System;
using Microsoft.AspNetCore.SignalR;
using TODO.Hubs;
using System.Threading;

namespace BackendTests
{
    public class TasksControllerTests
    {
        [Fact]
        public async void GetTasks_WhenNoParameters_ReturnsAllTasks()
        {
            var mockTasks = new List<TaskGetResponse>();
            for (int i = 1; i <= 10; i++)
            {
                mockTasks.Add(new TaskGetResponse
                {
                    TaskId = 1,
                    Title = $"Test title {i}",
                    Content = $"Test content {i}",
                });
            }

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetTasks())
                .Returns(() => Task.FromResult(mockTasks.AsEnumerable()));

            var tasksController = new TasksController(
                mockDataRepository.Object, null, null, null);

            var result = await tasksController.GetTasks(null);

            Assert.Equal(10, result.Count());
            mockDataRepository.Verify(
                mock => mock.GetTasks(), Times.Once());
        }

        [Fact]
        public async void GetTasks_WhenHaveSearchParameter_ReturnsCorrectTasks()
        {
            var mockTasks = new List<TaskGetResponse>();
            mockTasks.Add(new TaskGetResponse
            {
                TaskId = 1,
                Title = "Test",
                Content="Test content"
            });

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetTasksBySearchWithPaging("Test", 1, 20))
                .Returns(() => Task.FromResult(mockTasks.AsEnumerable()));
            var tasksController = new TasksController(
                mockDataRepository.Object, null, null, null);

            var result = await tasksController.GetTasks("Test");

            Assert.Single(result);
            mockDataRepository.Verify(mock =>
                mock.GetTasksBySearchWithPaging("Test", 1, 20),
                Times.Once());
        }

        [Fact]
        public async void GetTask_WhenTaskNoFound_Returns404()
        {
            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetTask(1))
                .Returns(() => Task.FromResult(default(TaskGetResponse)));

            var mockDataCache = new Mock<ITaskCache>();
            mockDataCache
                .Setup(cache => cache.Get(1))
                .Returns(() => null);

            var tasksController = new TasksController(
                mockDataRepository.Object, null, mockDataCache.Object, null);

            var result = await tasksController.GetTask(1);
            var actionResult =
                Assert.IsType<
                    ActionResult<TaskGetResponse>
                    >(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async void GetTask_WhenTaskIsFound_ReturnsTask()
        {
            var mockTask = new TaskGetResponse
            {
                TaskId = 1,
                Title = "test"
            };

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetTask(1))
                .Returns(() => Task.FromResult(mockTask));

            var mockTaskCache = new Mock<ITaskCache>();
            mockTaskCache
                .Setup(cashe => cashe.Get(1))
                .Returns(() => mockTask);

            var tasksController = new TasksController(
                mockDataRepository.Object, null, mockTaskCache.Object, null);

            var result = await tasksController.GetTask(1);
            var actionResult =
                Assert.IsType<
                    ActionResult<TaskGetResponse>
                    >(result);
            var taskResult =
                Assert.IsType<TaskGetResponse>(actionResult.Value);
            Assert.Equal(1, taskResult.TaskId);
        }

        //public class StaticWrapper : IStaticWrapper
        //{
        //    public Task SendAsync(IClientProxy iClientProxy, string method, object arg1, CancellationToken cancellationToken = default)
        //    {
        //        return ClientProxyExtensions.SendAsync(iClientProxy, method, arg1, cancellationToken);
        //    }
        //}

        //public interface IStaticWrapper
        //{
        //    Task SendAsync(IClientProxy iClientProxy, string method, object arg1, CancellationToken cancellationToken = default);
        //}

        //public class WrapperMethod
        //{
        //    readonly IStaticWrapper _wrapper;
        //    public WrapperMethod(IStaticWrapper wrapper)
        //    {
        //        _wrapper = wrapper;
        //    }
        //    public Task SendAsync(IClientProxy iClientProxy, string method, object arg1, CancellationToken cancellationToken = default)
        //    {
        //        var value = _wrapper.SendAsync(iClientProxy, method, arg1, cancellationToken);
        //        return value;
        //    }
        //}

        //private class TestWrapper : IStaticWrapper
        //{
        //    public Task SendAsync(IClientProxy iClientProxy, string method, object arg1, CancellationToken cancellationToken = default)
        //    {
        //        realisation???;
        //    }
        //}

        //[Fact]
        public async void AddTask_WhenTaskWithTwoParameters_ReturnsCorrectTasks()
        {
            var createdAt = DateTime.UtcNow;
            var mockTaskRequest = new AddTaskRequest
            {
                Title = "Test",
                Content =  "Test task",
            };

            var mockTaskFullRequest = new AddTaskFullRequest
            {
                Title = "Test",
                Content = "Test task",
                CreatedAt = createdAt
            };

            var mockTaskResponse = new TaskGetResponse
            {
                TaskId = 1,
                Title = "Test",
                Content = "Test task",
                CreatedAt = createdAt,
                IsDone = false
            };

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.AddTask(It.IsAny<AddTaskFullRequest>()))
                .Returns(() => Task.FromResult(It.IsAny<TaskGetResponse>()));

            var mockClientProxy = new Mock<IClientProxy>();

            var mockHubContext = new Mock<IHubContext<TasksHub>>();
            mockHubContext
                .Setup(hub => hub.Clients.Group(It.IsAny<string>()).SendAsync(It.IsAny<string>(), It.IsAny<Task<TaskGetResponse>>(), It.IsAny<CancellationToken>()))
                .Returns(It.IsAny<Task>());

            var tasksController = new TasksController(
                mockDataRepository.Object, mockHubContext.Object, null, null);

            var result = await tasksController.AddTask(mockTaskRequest);
            var actionResult =
                Assert.IsType<
                    ActionResult<TaskGetResponse>
                    >(result);
            var taskResult =
                Assert.IsType<TaskGetResponse>(actionResult.Value);
            Assert.Equal(mockTaskResponse, taskResult);
        }

        [Fact]
        public async void DeleteTask_WhenTaskIsNoFound_Returns404()
        {
            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetTask(1))
                .Returns(() => Task.FromResult(default(TaskGetResponse)));

            var mockTaskCache = new Mock<ITaskCache>();
            mockTaskCache
                .Setup(cashe => cashe.Remove(1));

            var tasksController = new TasksController(
                mockDataRepository.Object, null, mockTaskCache.Object, null);

            var result = await tasksController.DeleteTask(1);
            var actionResult =
                Assert.IsType<
                    NotFoundResult
                    >(result);
        }

        [Fact]
        public async void DeleteTask_WhenTaskIsFound_ReturnsNoContent()
        {
            var mockTask = new TaskGetResponse
            {
                TaskId = 1,
                Title = "test"
            };

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetTask(1))
                .Returns(() => Task.FromResult(mockTask));

            var mockTaskCache = new Mock<ITaskCache>();
            mockTaskCache
                .Setup(cashe => cashe.Remove(1));

            var tasksController = new TasksController(
                mockDataRepository.Object, null, mockTaskCache.Object, null);

            var result = await tasksController.DeleteTask(1);
            var actionResult =
                Assert.IsType<
                    NoContentResult
                    >(result);
        }

        [Fact]
        public async void GetScheduledTasks_ReturnsAllScheduledTasks()
        {
            var mockTasks = new List<TaskGetResponse>();
            for (int i = 1; i <= 10; i++)
            {
                mockTasks.Add(new TaskGetResponse
                {
                    TaskId = 1,
                    Title = $"Test title {i}",
                    Content = $"Test content {i}",
                    IsDone = false
                });
            }

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetScheduledTasks())
                .Returns(() => Task.FromResult(mockTasks.AsEnumerable()));

            var tasksController = new TasksController(
                mockDataRepository.Object, null, null, null);

            var result = await tasksController.GetScheduledTasks();

            Assert.Equal(10, result.Count());
            mockDataRepository.Verify(
                mock => mock.GetScheduledTasks(), Times.Once());
        }

        [Fact]
        public async void GetReadyTasks_ReturnsAllReadyTasks()
        {
            var mockTasks = new List<TaskGetResponse>();
            for (int i = 1; i <= 10; i++)
            {
                mockTasks.Add(new TaskGetResponse
                {
                    TaskId = 1,
                    Title = $"Test title {i}",
                    Content = $"Test content {i}",
                    IsDone = true
                });
            }

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetReadyTasks())
                .Returns(() => Task.FromResult(mockTasks.AsEnumerable()));

            var tasksController = new TasksController(
                mockDataRepository.Object, null, null, null);

            var result = await tasksController.GetReadyTasks();

            Assert.Equal(10, result.Count());
            mockDataRepository.Verify(
                mock => mock.GetReadyTasks(), Times.Once());
        }
    }
}



