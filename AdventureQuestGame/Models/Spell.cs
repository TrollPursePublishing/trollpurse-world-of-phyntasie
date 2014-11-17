using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Spell
    {
        protected Spell() { }

        public Spell(string name, string description, int damage, int manaCost, int minLevel)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.damage = damage;
            this.manaCost = manaCost;
            this.minLevel = minLevel;
        }

        public Guid Id { get; private set; }
        public string name { get; set; }
        public string description { get; set; }
        public int damage { get; set; }
        public int manaCost { get; set; }
        public int minLevel { get; set; }

        public Spell Copy()
        {
            Spell sp = MemberwiseClone() as Spell;
            sp.Id = Guid.NewGuid();
            return sp;
        }
    }
}
