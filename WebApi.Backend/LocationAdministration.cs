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

        public Location UpdateLocation(Guid Id, string name, string description, MonsterType monsterType, bool hasMarket, bool isExit, Guid questGiverId, List<Guid> roomIds)
        {
            var updated = GameCtx.locations
                .Include(l => l.rooms)
                .Include(l => l.QuestGiver)
                .SingleOrDefault(l => l.Id == Id);

            if(updated != null)
            {
                updated.description = description;
                updated.hasMarket = hasMarket;
                updated.isExit = isExit;
                updated.monsterTypeHere = monsterType;
                updated.name = name;

                updated.QuestGiver = GameCtx.questGivers
                    .Include(q => q.Quest)
                    .Include(q => q.QuestsToUnlockThisQuestGiver)
                    .SingleOrDefault(q => q.Id == questGiverId);


                if (roomIds != null)
                {
                    updated.rooms.Clear();

                    foreach (var room in roomIds)
                    {
                        var add = GameCtx.rooms.Single(r => r.Id == room);
                        updated.rooms.Add(add);
                    }
                }

                GameCtx.SaveChanges();
            }
            return updated;
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
