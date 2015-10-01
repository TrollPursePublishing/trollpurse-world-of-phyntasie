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
    public class QuestAdministration : AbstractService
    {
        private class NameDistinct : IEqualityComparer<Relic>,
            IEqualityComparer<Monster>
        {
            public bool Equals(Relic x, Relic y)
            {
                return x.name == y.name;
            }

            public int GetHashCode(Relic obj)
            {
                return obj.GetHashCode();
            }

            public bool Equals(Monster x, Monster y)
            {
                return x.name == y.name;
            }

            public int GetHashCode(Monster obj)
            {
                return obj.GetHashCode();
            }
        }

        public QuestAdministration()
        {
            GameCtx.Configuration.LazyLoadingEnabled = false;
        }

        public List<Monster> GetMonsters()
        {
            return GameCtx.monsters
                .Include(m => m.attribute)
                .Where(m =>
                    GameCtx.players
                    .FirstOrDefault(p => p.engaging.Id == m.Id) == null 
                    &&
                    m.attribute.health == m.attribute.currentHealth
                )
                .ToArray()
                .Distinct(new NameDistinct())
                .ToList();
        }

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

        public List<Area> GetAreas()
        {
            return GameCtx.areas
                .Include(a => a.locations)
                .ToList();
        }

        public List<Room> GetRooms()
        {
            var res = GameCtx.rooms
                .Include(r => r.linkedRoom)
                .ToList();

            res.ForEach(r => {
                if (r.linkedRoom != null)
                {
                    foreach (var l in r.linkedRoom)
                    {
                        l.linkedRoom = null;
                    }
                }
            });

            return res;
        }

        public List<QuestGiver> GetQuestGivers()
        {
            return GameCtx.questGivers
                .Include(q => q.Quest)
                .Include(q => q.QuestsToUnlockThisQuestGiver)
                .ToList();
        }

        public List<Quest> GetQuests()
        {
            return GameCtx.quests
                .Include(q => q.NextQuest)
                .ToList();
        }

        public Quest CreateQuest(string title, string description, string instructions, int goldReward, int scoreReward, int experienceReward, QuestType type, string nameOfObject, int countNeeded, Guid nextQuestId)
        {
            var nextQuest = GameCtx.quests.FirstOrDefault(q => q.Id == nextQuestId);
            var quest = new Quest(title, description, instructions, goldReward, scoreReward, experienceReward, type, nameOfObject, countNeeded, nextQuest);
            GameCtx.quests.Add(quest);
            GameCtx.SaveChanges();
            return quest;
        }

        public void DeleteQuest(Guid Id)
        {
            var players = GameCtx.players
                .Include(p => p.quests.Quests);

            foreach(var p in players.Where(p => p.quests.Quests.Any(qq => qq.Id == Id)))
            {
                var pqq = p.quests.Quests.Single(qq => qq.Id == Id);
                p.quests.Quests.Remove(pqq);
            }
            GameCtx.SaveChanges();

            GameCtx.quests.Remove(GameCtx.quests.First(q => q.Id == Id));
            GameCtx.SaveChanges();
        }

        public QuestGiver CreateQuestGiver(string name, string description, Guid questId, List<Guid> questIdsCompletedToUnlock = null)
        {
            var quest = GameCtx.quests.First(q => q.Id == questId);
            var quests = GameCtx.quests.Where(q => questIdsCompletedToUnlock.Contains(q.Id));
            QuestGiver giver = null;
            if (quests != null && quests.Count() <= 0)
                giver = new QuestGiver(name, description, quest);
            else
                giver = new QuestGiver(name, description, quest, quests.ToList());
            GameCtx.questGivers.Add(giver);
            GameCtx.SaveChanges();
            return giver;            
        }

        public QuestGiver UpdateQuestGiver(Guid Id, string name, string description, Guid questId, List<Guid> questIdsCompletedToUnlock)
        {
            var giver = GameCtx.questGivers
                .Include(q => q.Quest)
                .Include(q => q.QuestsToUnlockThisQuestGiver)
                .FirstOrDefault(q => q.Id == Id);

            if(giver != null)
            {
                Quest[] toUnlock = questIdsCompletedToUnlock == null ? null : GameCtx.quests.Where(q => questIdsCompletedToUnlock.Contains(q.Id)).ToArray();

                giver.Update(name,
                    description,
                    GameCtx.quests.SingleOrDefault(q => q.Id == questId),
                    (toUnlock == null || toUnlock.Count() == 0) ? null : toUnlock);

                GameCtx.SaveChanges();
            }
            return giver;
        }

        public void DeleteQuestGiver(Guid Id)
        {
            GameCtx.questGivers.Remove(GameCtx.questGivers.First(q => q.Id == Id));
            GameCtx.SaveChanges();
        }
    }
}
