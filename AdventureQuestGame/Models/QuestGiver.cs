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

        public QuestGiver(string name, string description, Quest quest)
        {
            Id = Guid.NewGuid();
            Quest = quest;
            Name = name;
            Description = description;
        }

        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public virtual Quest Quest { get; private set; }
    }
}
