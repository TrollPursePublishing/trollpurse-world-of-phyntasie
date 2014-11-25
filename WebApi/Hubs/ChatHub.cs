using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace WebApi.Hubs
{
    public class ChatHub : Hub
    {
        public void JoinLocation(string locationId)
        {
            Groups.Add(Context.ConnectionId, locationId);
        }

        public void LeaveLocation(string locationId)
        {
            Groups.Remove(Context.ConnectionId, locationId);
        }

        public void Send(string playerName, string message, string locationId)
        {
            Clients.Group(locationId).broadcastMessage(playerName, message);
        }
    }
}