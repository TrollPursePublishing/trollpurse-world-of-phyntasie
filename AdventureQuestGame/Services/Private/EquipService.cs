using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class EquipService
    {
        public IList<string> Process(Player player, string additionalParams)
        {
            IList<string> result = new List<string>();

            Armor a = player.inventory.armors.FirstOrDefault(aa => aa.name.Equals(additionalParams));
            if(a != null)
            {
                a = player.RemoveInventoryArmor(a);
                Armor old = player.Equip(a);
                result.Add(String.Format("{0} Equipped.", additionalParams));
                if(old != null)
                {
                    player.AddInventoryItem(old);
                    result.Add(String.Format("{0} Unequipped.", old.name));
                }
                return result;
            }

            Weapon w = player.inventory.weapons.FirstOrDefault(ww => ww.name.Equals(additionalParams));
            if(w != null)
            {
                w = player.RemoveInventoryWeapon(w);
                Weapon old = player.Equip(w);
                result.Add(String.Format("{0} Equipped.", additionalParams));
                if(old != null)
                {
                    player.AddInventoryItem(old);
                    result.Add(String.Format("{0} Unequipped.", old.name));
                }
                return result;
            }

            if(result.Count == 0)
            {
                result.Add(String.Format("I do not have a {0} to equip.", additionalParams));
            }
            return result;
        }
    }
}
