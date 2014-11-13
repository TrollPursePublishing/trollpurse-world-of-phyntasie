using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Inventory
    {
        public Inventory()
        {
            Id = Guid.NewGuid();
            armors = new List<Armor>();
            potions = new List<Potion>();
            weapons = new List<Weapon>();
            relics = new List<Relic>();
            gold = 1000;
        }

        public Guid Id { get; set; }
        public virtual ICollection<Armor> armors { get; set; }
        public virtual ICollection<Potion> potions { get; set; }
        public virtual ICollection<Weapon> weapons { get; set; }
        public virtual ICollection<Relic> relics { get; set; }
        public int gold { get; set; }
    }
}
