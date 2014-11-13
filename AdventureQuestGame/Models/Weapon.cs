using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Weapon
    {
        protected Weapon() { }

        public Weapon(string name, string description, int damage, int criticalDamage, int durability, int stanimaCost, int value)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.damage = damage;
            this.criticalDamage = criticalDamage;
            this.durability = durability;
            this.stanimaCost = stanimaCost;
            this.value = value;
        }

        public Guid? Id { get; set; }
        public string name { get; set; }
        public int damage { get; set; }
        public int criticalDamage { get; set; }
        public int durability { get; set; }
        public int stanimaCost { get; set; }
        public int value { get; set; }
        public string description { get; set; }

        public Weapon Copy()
        {
            Weapon w = MemberwiseClone() as Weapon;
            w.Id = Guid.NewGuid();
            return w;
        }
    }
}
