using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    
    public enum ArmorType : int
    {
        Head,
        Torso,
        Arm,
        Legs,
        Feet
    }

    
    public class Armor
    {
        protected Armor() { }

        public Armor(string name, ArmorType type, int armorRating, int durability, int value, string description)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.type = type;
            this.armorRating = armorRating;
            this.durability = durability;
            this.value = value;
            this.description = description;
        }

        public Guid? Id { get; set; }
        public string name { get; set; }
        public ArmorType type { get; set; }
        public int armorRating { get; set; }
        public int durability { get; set; }
        public int value { get; set; }
        public string description { get; set; }

        public Armor Copy()
        {
            Armor a = MemberwiseClone() as Armor;
            a.Id = Guid.NewGuid();
            return a;
        }
    }
}
