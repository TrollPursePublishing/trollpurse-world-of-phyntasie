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
    public class LocationAdministration : AbstractService
    {
        public LocationAdministration()
        {
            GameCtx.Configuration.LazyLoadingEnabled = false;
        }

        public List<Location> GetLocations()
        {
            return GameCtx.locations
                .Include(l => l.QuestGiver)
                .Include(l => l.rooms)
                .ToList();
        }

        public Location CreateLocation(string name, string description, MonsterType monsterType, bool hasMarket, bool isExit, Guid questGiverId, List<Guid> roomIds)
        {
            var questGiver = GameCtx.questGivers.SingleOrDefault(q => q.Id == questGiverId);
            var rooms = GameCtx.rooms.Where(r => roomIds.Contains(r.Id.Value));

            var result = new Location(name, description)
            {
                hasMarket = hasMarket,
                isExit = isExit,
                monsterTypeHere = monsterType,
            };

            if(questGiver != null)
            {
                result.QuestGiver = questGiver;
            }

            foreach(var room in rooms)
            {
                result.rooms.Add(room);
            }

            GameCtx.locations.Add(result);
            GameCtx.SaveChanges();
            return result;
        }

        public Location UpdateLocation(Guid Id, Location location)
        {
            var updated = GameCtx.locations
                .Include(l => l.rooms)
                .SingleOrDefault(l => l.Id == Id);

            if(updated != null)
            {
                updated.description = location.description;
                updated.hasMarket = location.hasMarket;
                updated.isExit = location.isExit;
                updated.monsterTypeHere = location.monsterTypeHere;
                updated.name = location.name;
                updated.QuestGiver = location.QuestGiver;

                updated.rooms.Clear();

                foreach(var room in location.rooms)
                {
                    var add = GameCtx.rooms.Single(r => r.Id == room.Id);
                    updated.rooms.Add(add);
                }

                GameCtx.SaveChanges();
            }
            return updated ?? location;
        }

        public void DeleteLocation(Guid Id)
        {
            var result = GameCtx.locations
                .Include(l => l.rooms)
                .FirstOrDefault(l => l.Id == Id);

            if(result != null)
            {
                result.rooms.Clear();
                GameCtx.SaveChanges();

                GameCtx.locations.Remove(result);
                GameCtx.SaveChanges();
            }
        }
    }
}
