using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TODO.Hubs
{
    public class TasksHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Caller.SendAsync("Message", "Successfully connected");
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        { 
            await Clients.Caller.SendAsync("Messsage", "Successfully disconnected");
            await base.OnDisconnectedAsync(exception);
        }
        public async Task SubscribeTask(int taskId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Task-{taskId}");
            await Clients.Caller.SendAsync("Message", "Successfully subscribed");
        }
        public async Task UnsubscribeTask(int taskId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Task-{taskId}");
            await Clients.Caller.SendAsync("Message", "Successfully unsubscribed");
        }

    }
}
