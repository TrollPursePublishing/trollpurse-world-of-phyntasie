using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace WebApi.Hubs
{
    public class ChatHub : Hub
    {
        public void JoinLocation(string locationId, string playerName)
        {
            Groups.Add(Context.ConnectionId, locationId);
            Clients.Group(locationId).broadcastJoin(playerName);
        }

        public void LeaveLocation(string locationId, string playerName)
        {
            Groups.Remove(Context.ConnectionId, locationId);
            Clients.Group(locationId).broadcastLeave(playerName);
        }

        public void Send(string playerName, string message, string locationId)
        {
            Clients.Group(locationId).broadcastMessage(playerName, message);
        }
    }
}