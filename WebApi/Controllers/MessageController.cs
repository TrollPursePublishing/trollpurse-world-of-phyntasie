using AdventureQuestGame.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace WebApi.Controllers
{
    class Event
    {
        public string name {get; private set;}
        public string description {get; private set;}
        public string whenString { get; private set; }
        public Event (string name, string description, string whenString)
        {
            this.name = name;
            this.description = description;
            this.whenString = whenString;
        }
    }

    class EventViewModel
    {
        public List<Event> events = new List<Event>();
    }

    public class MessageController : ApiController
    {
        private MessageService service = new MessageService();

        [HttpGet]
        [AllowAnonymous]
        [Route("api/message/{playerId}")]
        public async Task<string> Get(string playerId)
        {
            return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject("This feature is not implemented into the API just yet"));
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/message/events")]
        public async Task<string> GetEvents()
        {
            EventViewModel vm = new EventViewModel();
            service.GetAllEvents().ToList().ForEach(e => vm.events.Add(new Event(e.title, e.description, e.when.ToString("MM.dd.yy"))));
            return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(vm));
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/message/{playerId}/{otherPlayerName}/{message}")]
        public void MessagePlayer(string playerId, string otherPlayerName, string message)
        {
            throw new NotImplementedException("In a later API I will be");
        }
    }
}
