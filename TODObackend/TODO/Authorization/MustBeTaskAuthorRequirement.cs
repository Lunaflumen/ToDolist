using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TODO.Authorization
{
    public class MustBeTaskAuthorRequirement : IAuthorizationRequirement
    {
        public MustBeTaskAuthorRequirement()
        {
        }
    }
}
