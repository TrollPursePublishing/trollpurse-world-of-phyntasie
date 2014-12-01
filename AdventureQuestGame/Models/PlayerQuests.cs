using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class PlayerQuests
    {
        public PlayerQuests()
        {
            Id = Guid.NewGuid();
            Quests = new List<PlayerQuestQuest>();
        }

        public Guid Id { get; private set; }
        public virtual ICollection<PlayerQuestQuest> Quests { get; private set; }
    }
}
