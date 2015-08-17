using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Equipment
    {
        public Equipment()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; private set; }
        public virtual Armor arm { get; set; }
        public virtual Armor head { get; set; }
        public virtual Armor torso { get; set; }
        public virtual Armor legs { get; set; }
        public virtual Armor feet { get; set; }
        public virtual Weapon weapon { get; set; }

        public bool TryGetArmorTypeFromName(string armorname, out ArmorType type)
        {
            if (arm != null && arm.name.ToLower().Equals(armorname)) { type = ArmorType.Arm; return true; }
            if (head != null && head.name.ToLower().Equals(armorname)) { type = ArmorType.Head; return true; }
            if (torso != null && torso.name.ToLower().Equals(armorname)) { type = ArmorType.Torso; return true; }
            if (legs != null && legs.name.ToLower().Equals(armorname)) { type = ArmorType.Legs; return true; }
            if (feet != null && feet.name.ToLower().Equals(armorname)) { type = ArmorType.Feet; return true; }
            type = ArmorType.Arm;
            return false;
        }
    }
}
