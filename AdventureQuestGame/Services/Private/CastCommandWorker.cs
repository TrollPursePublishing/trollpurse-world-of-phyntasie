using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class CastCommandWorker : ICommandWorker
    {
        public IList<string> Process(Player player, string additionalParams, GameContext GameCtx)
        {

            int spellIndex = player.spells.ToList().IndexOf(player.spells.FirstOrDefault(s => s.name.ToLower() == additionalParams));
            if (spellIndex < 0)
                return new List<string>(new[] { String.Format("I do not know how to cast {0}", additionalParams) });
            if (player.attributes.currentMana >= player.spells.ElementAt(spellIndex).manaCost)
            {
                IList<string> result = new List<string>(new[] { player.CastSpell(spellIndex) });

                if (player.isInCombat && player.engaging.attribute.currentHealth <= 0)
                {
                    result.Add(player.Disengage());
                    return result;
                }

                if(player.isInCombat)
                    result.Add(player.Defend());

                if (player.attributes.currentHealth <= 0)
                {
                    player.OnDeath();
                    player.navigation.currentWorld = GameCtx.worlds.First();
                    player.navigation.currentArea = player.navigation.currentWorld.areas.First();
                    player.navigation.currentLocation = player.navigation.currentArea.locations.First();
                    result.Add(String.Format("{0} has died a brutal death.", player.FullName));
                }
                return result;
            }
            else
            {
                return new List<string>(new[] { String.Format("I cannot cast the spell, I need {0} more mana.", player.spells.ElementAt(spellIndex).manaCost - player.attributes.currentMana) });
            }
        }

        public Commands Handles()
        {
            return Commands.cast;
        }
    }
}
