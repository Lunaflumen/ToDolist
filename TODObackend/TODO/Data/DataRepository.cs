using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using TODO.Data.Models;

namespace TODO.Data
{
    public class DataRepository : IDataRepository
    {
        private readonly string _connectionString;
        public DataRepository(IConfiguration configuration)
        {
            _connectionString =
            configuration["ConnectionStrings:DefaultConnection"];
        }

        public async Task<IEnumerable<TaskGetResponse>> GetScheduledTasks()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await
                connection.QueryAsync<TaskGetResponse>
                (
                    "EXEC dbo.Task_GetScheduled"
                );
            }
        }

        public async Task<TaskGetResponse> GetTask(int taskId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var task = await
                connection.QueryFirstOrDefaultAsync<TaskGetResponse>(
                @"EXEC dbo.Task_GetSingle @TaskId = @TaskId",
                new { TaskId = taskId }
                );
                return task;
            }

        }

        public async Task<IEnumerable<TaskGetResponse>> GetTasks()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QueryAsync<TaskGetResponse>
                (
                    @"EXEC dbo.Task_GetMany"
                );
            };
        }

        public async Task<IEnumerable<TaskGetResponse>> GetTasksBySearch(string search)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QueryAsync<TaskGetResponse>
                (
                    @"EXEC dbo.Task_GetMany_BySearch @Search = @Search",
                    new { Search = search }
                );
            }
        }

        public async Task<IEnumerable<TaskGetResponse>> GetTasksBySearchWithPaging(string search, int pageNumber, int pageSize)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var parameters = new
                {
                    Search = search,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
                return await connection.QueryAsync<TaskGetResponse>
                (
                    @"EXEC dbo.Task_GetMany_BySearch_WithPaging
                    @Search = @Search,
                    @PageNumber = @PageNumber,
                    @PageSize = @PageSize", parameters
                );
            }
        }

        public async Task<IEnumerable<TaskGetResponse>> GetReadyTasks()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QueryAsync<TaskGetResponse>
                (
                    "EXEC dbo.Task_GetReady"
                );
            }
        }

        public async Task<bool> TaskExists(int taskId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QueryFirstAsync<bool>
                (
                    @"EXEC dbo.Task_Exists @TaskId = @TaskId",
                    new { TaskId = taskId }
                );
            }
        }

        public async Task<TaskGetResponse> AddTask(AddTaskFullRequest task)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var taskId = await connection.QueryFirstAsync<int>
                (
                    @"EXEC dbo.Add_Task
                    @Title = @Title, @Content = @Content,
                    @CreatedAt = @CreatedAt",
                    task
                );
                return await GetTask(taskId);
            }
        }

        public async Task<TaskGetResponse> PutTask(int taskId, PutTaskRequest task)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                await connection.ExecuteAsync
                (
                    @"EXEC dbo.Put_Task
                    @TaskId = @TaskId, @Title = @Title, @Content = @Content",
                    new { TaskId = taskId, task.Title, task.Content }
                );
                return await GetTask(taskId);
            }
        }

        public async Task<TaskGetResponse> FinishTask(int taskId, FinishTaskRequest task)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                await connection.ExecuteAsync
                (
                    @"EXEC dbo.Finish_Task
                    @TaskId = @TaskId, @IsDone = @IsDone",
                    new { TaskId = taskId, task.IsDone }
                );
                return await GetTask(taskId);
            }
        }

        public async Task DeleteTask(int taskId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                await connection.ExecuteAsync
                (
                    @"EXEC dbo.Task_Delete
                    @TaskId = @TaskId",
                    new { TaskId = taskId }
                );
            }
        }
    }
}
