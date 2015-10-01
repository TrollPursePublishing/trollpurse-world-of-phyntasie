using AdventureQuestGame.Models;
using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Admin
{
    public class EventAdministration : AbstractService
    {
        public List<Event> GetEvents()
        {
            return GameCtx.events.ToList(); 
        }

        public Event CreateEvent(string title, string description)
        {
            var evt = new Event(title, description);
            GameCtx.events.Add(evt);
            GameCtx.SaveChanges();
            return evt;
        }
    }
}
