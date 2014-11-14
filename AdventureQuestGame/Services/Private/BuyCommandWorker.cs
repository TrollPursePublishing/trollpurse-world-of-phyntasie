using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class BuyCommandWorker : ICommandWorker
    {
        public IList<string> Process(Player player, string additionalParams, GameContext GameCtx)
        {
            if (player.isInCombat || player.isInside)
            {
                return new List<string>(new[]{"I cannot purchase at this time."});
            }
            Market market = GameCtx
                .markets
                .FirstOrDefault(m => m.locationIAmIn.Id == player.navigation.currentLocation.Id);

            if (market == null)
            {
                return new List<string>(new[]{"I am not in a location where I can do this."});
            }

            Armor a = market.inventory.armors.FirstOrDefault(ar => ar.name == additionalParams);
            if (a != null)
                return new List<string>(new[]{player.BuyInventoryItem(a)});

            Potion p = market.inventory.potions.FirstOrDefault(pp => pp.name == additionalParams);
            if (p != null)
                return new List<string>(new[]{player.BuyInventoryItem(p)});

            Weapon w = market.inventory.weapons.FirstOrDefault(ww => ww.name == additionalParams);
            if (w != null)
                return new List<string>(new[]{player.BuyInventoryItem(w)});

            //else just show the player what he/she can buy
            IList<string> result = new List<string>();
            if(!additionalParams.TrimStart().TrimEnd().Equals(String.Format("-{0}", Commands.buy.ToString())))
                result.Add(String.Format("{0} was not found in the market.", additionalParams));
            
            result.Add("Here is what is in the market: ");
            market.inventory.armors.ToList().ForEach(aa => result.Add(aa.name));
            market.inventory.potions.ToList().ForEach(pp => result.Add(pp.name));
            market.inventory.weapons.ToList().ForEach(ww => result.Add(ww.name));
            return result;
        }

        public Commands Handles()
        {
            return Commands.buy;
        }
    }
}
