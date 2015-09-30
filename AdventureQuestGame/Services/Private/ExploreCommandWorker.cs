using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class ExploreCommandWorker : ICommandWorker
    {
        private static int rsize = 5;
        public IList<string> Process(Player player, string additionalParams, GameContext GameCtx)
        {
            IList<string> result = new List<string>();

            if (player.isInside && !player.isInCombat)
            {
                Random r = new Random();
                if (r.Next(100) > player.navigation.currentRoom.chanceForRelic)
                {
                    IList<Monster> monsters = GameCtx.monsters.Where(mm => 
                        mm.attribute.level <= player.attributes.level && 
                        mm.type == player.navigation.currentLocation.monsterTypeHere && 
                        mm.attribute.currentHealth > 0 &&
                        GameCtx.players.FirstOrDefault(p => p.engaging.Id == mm.Id) == null)
                        .ToList();

                    int index = r.Next(monsters.Count);
                    Monster m = monsters[index];
                    result.Add(player.Engage(m.Copy()));
                }
                else
                {
                    int index = r.Next(rsize);

                    int rarity = r.Next(5);
                    Relic relic = null;
                    if (rarity > 3)
                        relic = GameCtx.relics.Take(rsize).ToArray()[index];
                    else
                        relic = GameCtx.relics.Take(rsize).ToArray()[(rsize - (int)(rsize / 3.0f))];

                    if(relic != null)
                    { 
                        result.Add(String.Format("I have discoverd a(n) {0}. {1}", relic.name, relic.description));
                        result.Add(player.AddInventoryItem(relic.Copy()));
                    }
                }
            }
            else
                result.Add("I cannot explore here or at this time.");

            return result;
        }

        public Commands Handles()
        {
            return Commands.explore;
        }
    }
}
