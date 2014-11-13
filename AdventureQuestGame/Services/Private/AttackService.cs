using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class AttackService
    {
        public IList<string> Process(Player player, GameContext GameCtx)
        {
            if (player.isInCombat)
            {
                IList<string> result = new List<string>();

                if (player.equipment.weapon != null && player.attributes.currentStanima < player.equipment.weapon.stanimaCost)
                {
                    return new List<string>(new[] { String.Format("I am too tired to use my {0}. I need {1} more stanima.", player.equipment.weapon.name, player.equipment.weapon.stanimaCost - player.attributes.currentStanima) });
                }
                result.Add(player.Attack());
                if (player.engaging.attribute.currentHealth > 0)
                {
                    result.Add(player.Defend());
                    if (player.attributes.currentHealth <= 0)
                    {
                        result.Add("\n" + String.Format("{0} has died!", player.FullName));
                        player.OnDeath();
                        player.navigation.currentWorld = GameCtx.worlds.First();
                        player.navigation.currentArea = player.navigation.currentWorld.areas.First();
                        player.navigation.currentLocation = player.navigation.currentArea.locations.First();
                        return result;
                    }
                }
                else
                {
                    result.Add(player.Disengage());
                }
                return result;
            }
            else
            {
                return new List<string>(new[] { "I am not in combat right now." });
            }
        }
    }
}
