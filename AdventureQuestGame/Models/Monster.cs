using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public enum MonsterType : int
    {
        Monster,
        Person,
        Creature
    }


    [Serializable]
    public class Monster
    {
        protected Monster() { }

        public Monster(string name, string description, PlayerAttributes attributes, MonsterType type)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.attribute = attributes;
            this.type = type;
        }

        public Guid Id { get; private set; }
        public string name { get; set; }
        public string description { get; set; }
        public virtual PlayerAttributes attribute { get; set; }
        public MonsterType type { get; set; }

        public Monster Copy()
        {
            Monster m = new Monster(name, description, new PlayerAttributes(attribute.strength, attribute.toughness, attribute.health, attribute.level), type);
            return m;
        }

        public int GoldLoot
        {
            get
            {
                return (int)(attribute.level + ((attribute.toughness + attribute.health) * 0.5f));
            }
        }

        public int GetScore
        {
            get
            {
                return attribute.level * attribute.toughness;
            }
        }
    }
}
