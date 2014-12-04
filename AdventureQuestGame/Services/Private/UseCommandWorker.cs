using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class UseCommandWorker : ICommandWorker
    {
        public IList<string> Process(Player player, string addtionalParams, GameContext GameCtx)
        {
            int index = player.inventory.potions.ToList().IndexOf(player.inventory.potions.FirstOrDefault(p => p.name.ToLower() == addtionalParams));
            if(index < 0){
                return new List<string>(new[]{String.Format("I do not have a {0}", addtionalParams)});
            }
            if(player.isInCombat)
            {
                IList<string> result = new List<string>();
                result.Add(player.UsePotion(index));

                if (player.engaging.attribute.currentHealth < 0)
                {
                    result.Add(player.Disengage());
                    return result;
                }

                result.Add(player.Defend());
                if (player.attributes.currentHealth <= 0)
                {
                    player.OnDeath();
                    player.navigation.currentWorld = GameCtx.worlds.First();
                    player.navigation.currentArea = player.navigation.currentWorld.areas.First();
                    player.navigation.currentLocation = player.navigation.currentArea.locations.First();
                    result.Add(String.Format("{0} has died a tragic death.", player.FullName));
                    return result;
                }
                return result;
            }
            return new List<string>(new[] { player.UsePotion(index) });
        }

        public Commands Handles()
        {
            return Commands.use;
        }
    }
}
