using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TODO.Data;
using TODO.Data.Models;
using TODO.Hubs;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text.Json;



namespace TODO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;
        private readonly IHubContext<TasksHub> _hubContext;
        private readonly ITaskCache _cache;
        private readonly IHttpClientFactory _clientFactory;
        //private readonly string _auth0UserInfo;
        public TasksController(
            IDataRepository dataRepository, 
            IHubContext<TasksHub> hubContext, 
            ITaskCache taskCache, 
            IHttpClientFactory clientFactory 
            /*IConfiguration configuration*/)
        {
            _dataRepository = dataRepository;
            _hubContext = hubContext;
            _cache = taskCache;
            _clientFactory = clientFactory;
            //_auth0UserInfo = $"{configuration["Auth0:Authority"]}userinfo";
        }

        [HttpGet]
        public async Task<IEnumerable<TaskGetResponse>> GetTasks(string search, int page = 1, int pageSize = 20)
        {
            if (string.IsNullOrEmpty(search))
            {
                return await _dataRepository.GetTasks();
            }
            else
            {
                return await _dataRepository.GetTasksBySearchWithPaging(search, page, pageSize);
            }
        }

        [HttpGet("scheduled")]
        public async Task<IEnumerable<TaskGetResponse>> GetScheduledTasks()
        {
            return await _dataRepository.GetScheduledTasks();
        }
        
        [HttpGet("ready")]
        public async Task<IEnumerable<TaskGetResponse>> GetReadyTasks()
        {
            return await _dataRepository.GetReadyTasks();
        }

        [HttpGet("{taskId}")]
        public async Task<ActionResult<TaskGetResponse>> GetTask(int taskId)
        {
            var task = _cache.Get(taskId);
            if (task == null)
            {
                task = await _dataRepository.GetTask(taskId);
                if (task == null)
                {
                    return NotFound();
                }
                _cache.Set(task);
            }
            return task;
        }

        //[Authorize(Policy = "MustBeTaskAuthor")]
        [HttpPost]
        public async Task<ActionResult<TaskGetResponse>> AddTask (AddTaskRequest addTaskRequest)
        {
            var savedTask = await _dataRepository.AddTask(new AddTaskFullRequest 
            { 
                Title = addTaskRequest.Title,
                Content = addTaskRequest.Content,
                //UserId = User.FindFirst(ClaimTypes.NameIdentifier).Value,
                //UserName = await GetUserName(),
                CreatedAt = DateTime.UtcNow
            });

            await _hubContext.Clients.Group($"Task-{savedTask}")
                .SendAsync("ReceiveTask", _dataRepository.GetTask(savedTask.TaskId));

            return CreatedAtAction(nameof(GetTask),
                new { taskId = savedTask.TaskId },
                savedTask);
        }

        //[Authorize(Policy = "MustBeTaskAuthor")]
        //[HttpPut("{taskId}")]
        //public async Task<ActionResult<TaskGetResponse>> PutTask(int taskId, PutTaskRequest putTaskRequest)
        //{
        //    var task = await _dataRepository.GetTask(taskId);
        //    if (task == null)
        //    {
        //        return NotFound();
        //    }
        //    putTaskRequest.Title =
        //        string.IsNullOrEmpty(putTaskRequest.Title) ?
        //            task.Title : putTaskRequest.Title;
        //    putTaskRequest.Content =
        //        string.IsNullOrEmpty(putTaskRequest.Content) ?
        //        task.Content : putTaskRequest.Content;
        //    var savedTask = await _dataRepository.PutTask(taskId, putTaskRequest);

        //    await _hubContext.Clients.Group($"Task-{savedTask.TaskId}")
        //        .SendAsync("ReceiveTask", _dataRepository.GetTask(savedTask.TaskId));

        //    return savedTask;
        //}

        [HttpPut("{taskId}")]
        public async Task<ActionResult<TaskGetResponse>> FinishTask(int taskId, FinishTaskRequest finishTaskRequest)
        {
            var task = await _dataRepository.GetTask(taskId);
            if (task == null)
            {
                return NotFound();
            }
            var savedTask = await _dataRepository.FinishTask(taskId, finishTaskRequest);

            await _hubContext.Clients.Group($"Task-{savedTask.TaskId}")
                .SendAsync("ReceiveTask", _dataRepository.GetTask(savedTask.TaskId));

            _cache.Remove(savedTask.TaskId);

            return savedTask;
        }

        //[Authorize(Policy = "MustBeTaskAuthor")]
        [HttpDelete("{taskId}")]
        public async Task<ActionResult> DeleteTask(int taskId)
        {
            var task = await _dataRepository.GetTask(taskId);
            if (task == null)
            {
                return NotFound();
            }
            await _dataRepository.DeleteTask(taskId);
            _cache.Remove(taskId);
            return NoContent();
        }

        //private async Task<string> GetUserName()
        //{
        //    var request = new HttpRequestMessage(HttpMethod.Get, _auth0UserInfo);
        //    request.Headers.Add("Authorization", Request.Headers["Authorization"].First());
        //    var client = _clientFactory.CreateClient();
        //    var response = await client.SendAsync(request);
        //    if (response.IsSuccessStatusCode)
        //    {
        //        var jsonContent = await response.Content.ReadAsStringAsync();
        //        var user = JsonSerializer.Deserialize<User>(
        //            jsonContent,
        //            new JsonSerializerOptions
        //            {
        //                PropertyNameCaseInsensitive = true
        //            });
        //        return user.Name;
        //    }
        //    else
        //    {
        //        return "";
        //    }
        //}

    }
}
