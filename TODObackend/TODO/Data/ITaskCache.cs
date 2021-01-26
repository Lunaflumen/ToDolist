using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TODO.Data.Models;

namespace TODO.Data
{
    public interface ITaskCache
    {
        TaskGetResponse Get(int taskId);
        void Remove(int taskId);
        void Set(TaskGetResponse task);
    }
}
