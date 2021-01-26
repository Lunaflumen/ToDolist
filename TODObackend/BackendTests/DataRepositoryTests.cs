using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using Xunit;
using Moq;
using TODO.Data.Models;
using TODO.Data;

namespace BackendTests
{
    public class DataRepositoryTests
    {
        private readonly Mock<IConfiguration> configuration = new Mock<IConfiguration>();
        public DataRepositoryTests()
        {
            configuration
                .Setup(c => c.GetConnectionString(It.IsAny<string>()))
                .Returns(It.IsAny<string>());
        }

        //[Fact]
        //public async void GetTasksBySearch_ReturnsCorrectTasks()
        //{
        //    var mockTasks = new List<TaskGetResponse>();
        //    mockTasks.Add(new TaskGetResponse
        //    {
        //        TaskId = 1,
        //        Title = "Test",
        //        Content = "Test content"
        //    });

        //    var dataRepository = new DataRepository(configuration.Object);

        //    var result = await dataRepository.GetTasksBySearch("Test");

        //    Assert.Single(result);
        //    configuration.Verify(mock =>
        //        mock.GetConnectionString("ConnectionStrings: DefaultConnection"),
        //        Times.Once());
        //}
    }
}
