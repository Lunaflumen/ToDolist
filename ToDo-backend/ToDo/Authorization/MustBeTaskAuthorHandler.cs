using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using TODO.Data;

namespace TODO.Authorization
{
    //public class MustBeTaskAuthorHandler : AuthorizationHandler<MustBeTaskAuthorRequirement>
    //{
    //    private readonly IDataRepository _dataRepository;
    //    private readonly IHttpContextAccessor _httpContextAccessor;
    //    public MustBeTaskAuthorHandler(IDataRepository dataRepository, IHttpContextAccessor httpContextAccessor)
    //    {
    //        _dataRepository = dataRepository;
    //        _httpContextAccessor = httpContextAccessor;
    //    }
        //protected async override Task HandleRequirementAsync(
        //    AuthorizationHandlerContext context,
        //    MustBeTaskAuthorRequirement requirement)
        //{
        //    if (!context.User.Identity.IsAuthenticated)
        //    {
        //        context.Fail();
        //        return;
        //    }

        //    var taskId = _httpContextAccessor.HttpContext.Request.RouteValues["taskId"];
        //    int taskIdAsInt = Convert.ToInt32(taskId);

        //    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier).Value;

        //    var task = await _dataRepository.GetTask(taskIdAsInt);
        //    if (task == null)
        //    {
        //        context.Succeed(requirement);
        //        return;
        //    }

        //    if(task.UserId != userId)
        //    {
        //        context.Fail();
        //        return;
        //    }
        //    context.Succeed(requirement);
        //}
    //}
}