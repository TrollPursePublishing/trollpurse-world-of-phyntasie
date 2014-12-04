using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    public class PlayerQuestQuest
    {
        protected PlayerQuestQuest() { }

        public PlayerQuestQuest (Quest quest)
        {
            Id = Guid.NewGuid();
            Quest = quest;
            Complete = false;
        }

        public void MakeComplete(Player p)
        {
            Complete = true;
            p.inventory.gold += Quest.Gold;
            p.stats.score += Quest.Score;
            p.attributes.AddExperience(Quest.Experience);
        }

        public Guid Id {get; private set;}
        public virtual Quest Quest { get; private set; }
        public int Count { get; set; } //tracks some random data (like number of creatures killed or items collected)
        public bool Complete { get; private set; }
    }
}
