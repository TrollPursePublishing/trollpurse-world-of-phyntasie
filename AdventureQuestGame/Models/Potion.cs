using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Potion
    {
        protected Potion() { }

        public Potion(string name, string description, int healingValue, int poisonValue, int stanimaRestoreValue, int manaRestoreValue, int value, int effectTurns = 0)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.healingValue = healingValue;
            this.manaRestoreValue = manaRestoreValue;
            this.poisonValue = poisonValue;
            this.stanimaRestoreValue = stanimaRestoreValue;
            this.value = value;
            this.effectTurns = effectTurns;
        }

        public Guid Id { get; set; }
        public string name { get; set; }
        public int healingValue { get; set; }
        public int poisonValue { get; set; }
        public int stanimaRestoreValue { get; set; }
        public int manaRestoreValue { get; set; }
        public int effectTurns { get; set; }
        public int value { get; set; }
        public string description { get; set; }

        public Potion Copy()
        {
            Potion p = (Potion)MemberwiseClone();
            p.Id = Guid.NewGuid();
            return p;
        }
    }
}
