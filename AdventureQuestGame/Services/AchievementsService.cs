using AdventureQuestGame.Models;
using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace AdventureQuestGame.Services
{
    public class AchievementsService : AbstractService
    {
        public IList<Acheivement> GetPlayerAcheivements(string playerId)
        {
            Guid id = Guid.Parse(playerId);
            return GameCtx.achievements.Where(ach => ach.player.Id == id).OrderByDescending(ach => ach.time).ToList();
        }

        public IList<Acheivement> GetPlayerAcheivementsOrdered()
        {
            return GameCtx.achievements.OrderByDescending(ach => ach.time).Take(35).ToList();
        }
    }
}
