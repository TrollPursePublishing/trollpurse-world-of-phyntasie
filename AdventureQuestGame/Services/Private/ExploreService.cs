﻿using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class ExploreService : AbstractService
    {
        private const int rsize = 5;

        public IList<string> Process(Player player)
        {
            IList<string> result = new List<string>();

            if (player.isInside && !player.isInCombat)
            {
                Random r = new Random();
                if (r.Next(1000) < 990)
                {
                    IList<Monster> monsters = GameCtx.monsters.Where(mm => mm.attribute.level <= player.attributes.level).ToList();
                    int index = r.Next(monsters.Count);
                    Monster m = monsters[index];
                    result.Add(player.Engage(m.Copy()));
                }
                else
                {
                    int index = r.Next(rsize);

                    int rarity = r.Next(5);
                    Relic relic;
                    if (rarity > 3)
                        relic = GameCtx.relics.Take(rsize).ToArray()[index];
                    else
                        relic = GameCtx.relics.Take(rsize).ToArray()[(rsize - (int)Math.Floor(rsize / 3.0f))];

                    result.Add(String.Format("I have discoverd a(n) {0}. {1}", relic.name, relic.description));
                    result.Add(player.AddInventoryItem(relic.Copy()));
                }
            }
            else
                result.Add("I cannot explore here or at this time.");

            return result;
        }
    }
}
