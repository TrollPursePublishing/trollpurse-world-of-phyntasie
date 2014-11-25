using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services
{




    //public class ChatMessage
    //{
    //    public DateTime TimeSent { get; private set; }
    //    public string Message { get; private set; }
    //    public string PlayerName{get; private set;}

    //    public ChatMessage(string playerName, string message)
    //    {
    //        PlayerName = playerName;
    //        Message = message;
    //        TimeSent = DateTime.UtcNow;
    //    }
    //}

    //public class ChatMessagePollRequest
    //{
    //    public Guid LocationId { get; private set; }
    //    public DateTime RequestTime { get; private set; }
    //    public ChatMessagePollRequest(Guid LocationId)
    //    {
    //        this.LocationId = LocationId;
    //        RequestTime = DateTime.UtcNow;
    //    }
    //}

    //public class ChatMessagePollResponse
    //{
        
    //}

    //public class ChatService : AbstractService
    //{
    //    private static ConcurrentDictionary<Guid, IList<ChatMessage>> messages = new ConcurrentDictionary<Guid, IList<ChatMessage>>();

    //    public void SendMessage(Guid LocationId, ChatMessage message)
    //    {
    //        if(messages.ContainsKey(LocationId))
    //        {
    //            messages[LocationId].Add(message);
    //        }
    //        else
    //        {
    //            if (messages.TryAdd(LocationId, new List<ChatMessage>()))
    //            {
    //                messages[LocationId].Add(message);
    //            }
    //            else
    //            {
    //                //retry
    //                messages[LocationId].Add(message);
    //            }
    //        }
    //    }

    //    public IList<ChatMessage> GetMessages(Guid LocationId)
    //    {
    //        List<ChatMessage> results = new List<ChatMessage>();
    //        if(messages.ContainsKey(LocationId))
    //        {
    //            results.AddRange(messages[LocationId].Where(cm => cm.TimeSent >= DateTime.UtcNow.Subtract(TimeSpan.FromSeconds(5.0))));
    //        }
    //        return results;
    //    }
    //}
}
