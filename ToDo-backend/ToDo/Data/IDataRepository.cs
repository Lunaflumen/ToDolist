using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TODO.Data.Models;


namespace TODO.Data
{
    public interface IDataRepository
    {
        Task<IEnumerable<TaskGetResponse>> GetTasks();
        Task<IEnumerable<TaskGetResponse>> GetTasksBySearch(string search);
        Task<IEnumerable<TaskGetResponse>> GetTasksBySearchWithPaging(string search, int pageNumber, int pageSize);
        Task<IEnumerable<TaskGetResponse>> GetScheduledTasks();
        Task<IEnumerable<TaskGetResponse>> GetReadyTasks();

        Task<TaskGetResponse> GetTask(int taskId);
        Task<bool> TaskExists(int taskId);

        Task<TaskGetResponse> AddTask(AddTaskFullRequest task);
        Task<TaskGetResponse> PutTask(int taskId, PutTaskRequest task);
        Task<TaskGetResponse> FinishTask(int taskId, FinishTaskRequest task);
        Task DeleteTask(int taskId);

    }

}
