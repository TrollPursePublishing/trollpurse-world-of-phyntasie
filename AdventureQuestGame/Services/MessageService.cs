using AdventureQuestGame.Models;
using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services
{
    public class MessageService : AbstractService
    {
        public IList<Event> GetAllEvents()
        {
            using (var ctx = GameCtx)
            {
                return ctx.events.ToList();
            }
        }
    }
}
