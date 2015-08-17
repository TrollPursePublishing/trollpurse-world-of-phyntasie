using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class UnequipCommandWorker : ICommandWorker
    {
        public Commands Handles()
        {
            return Commands.unequip;
        }

        public IList<string> Process(Player player, string additionalParams, GameContext GameCtx)
        {
            IList<string> results = new List<string>();
            Weapon unequipped = player.Equip((Weapon)null);
            if(unequipped != null)
            {
                player.AddInventoryItem(unequipped);
                results.Add(String.Format("Unequipped {0}", unequipped.name));
            }
            else
            {
                results.Add("I have nothing to unequip.");
            }
            return results;
        }
    }
}
