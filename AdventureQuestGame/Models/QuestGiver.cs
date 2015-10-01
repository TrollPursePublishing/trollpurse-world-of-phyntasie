using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    public class QuestGiver
    {
        protected QuestGiver() { }

        public QuestGiver(string name, string description, Quest quest, List<Quest> questsCompletedToUnlock = null)
        {
            Id = Guid.NewGuid();
            Quest = quest;
            Name = name;
            Description = description;
            QuestsToUnlockThisQuestGiver = questsCompletedToUnlock;
        }

        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public virtual Quest Quest { get; private set; }
        public virtual ICollection<Quest> QuestsToUnlockThisQuestGiver{ get; private set;}

        public void Update(string Name, string Description, Quest quest, Quest[] unlocks = null)
        {
            this.Name = Name;
            this.Description = Description;
            this.Quest = quest;

            if (unlocks != null)
            {
                QuestsToUnlockThisQuestGiver.Clear();
                foreach (var q in unlocks)
                {
                    QuestsToUnlockThisQuestGiver.Add(q);
                }
            }
        }

        public bool CanDoQuest(Player p)
        {
            if (QuestsToUnlockThisQuestGiver == null)
                return true;

            bool canunlock = true;
            var completed = p.quests.Quests.Where(pqq => pqq.Complete);
            if (completed == null)
                return false;

            foreach (var q in QuestsToUnlockThisQuestGiver)
                canunlock &= completed.Select(pq => pq.Quest).Contains(q);

            return canunlock;
        }
    }
}
