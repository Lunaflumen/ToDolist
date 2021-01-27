using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using TODO.Data.Models;

namespace TODO.Data
{
    public class TaskCache : ITaskCache
    {
        private MemoryCache _cache { get; set; }
        public TaskCache()
        {
            _cache = new MemoryCache(new MemoryCacheOptions
            {
                SizeLimit = 100
            });
        }

        private string GetCacheKey(int taskId) =>
            $"Task-{taskId}";

        public TaskGetResponse Get(int taskId)
        {
            TaskGetResponse task;
            _cache.TryGetValue(GetCacheKey(taskId), out task);
            return task;
        }

        public void Set(TaskGetResponse task)
        {
            var cacheEntryOptions =
                new MemoryCacheEntryOptions()
                .SetSize(1);
            _cache.Set
            (
                GetCacheKey(task.TaskId),
                task,
                cacheEntryOptions
            );
        }

        public void Remove(int taskId)
        {
            _cache.Remove(GetCacheKey(taskId));
        }
    }
}
