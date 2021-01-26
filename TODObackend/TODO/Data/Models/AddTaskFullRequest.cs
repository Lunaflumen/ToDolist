using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TODO.Data.Models
{
    public class AddTaskFullRequest
    {
        public string Title { get; set; }
        public string Content { get; set; }
        //public string UserId { get; set; }
        //public string UserName { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
