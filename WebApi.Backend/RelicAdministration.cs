using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AdventureQuestGame.Models;
using System.Data.Entity;

namespace AdventureQuestGame.Admin
{
    public class RelicAdministration : AbstractService
    {
        public List<Relic> GetRelics()
        {
            var players = GameCtx.players
                    .Include(p => p.inventory)
                    .Include(p => p.inventory.relics);

            return GameCtx.relics
                .Where(r => players.FirstOrDefault(p => p.inventory.relics.Contains(r)) == null)
                .ToArray()
                .Distinct(new NameDistinct())
                .ToList();
        }

        public Relic CreateRelic(string name, string description, int value)
        {
            var relic = new Relic(name, description, value);
            GameCtx.relics.Add(relic);
            GameCtx.SaveChanges();
            return relic;
        }

        public Relic UpdateRelic(Guid Id, string name, string description, int value)
        {
            var relic = GameCtx.relics.Single(r => r.Id == Id);
            relic.name = name;
            relic.description = description;
            relic.value = value;
            return relic;
        }

        public void DeleteRelic(Guid Id)
        {
            GameCtx.relics.Remove(GameCtx.relics.First(r => r.Id == Id));
            GameCtx.SaveChanges();
        }
    }
}
