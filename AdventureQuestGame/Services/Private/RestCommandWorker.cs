using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class RestCommandWorker : ICommandWorker
    {
        public IList<string> Process(Player player, string additionalParams, GameContext GameCtx)
        {
            List<string> result = new List<string>();
            if (player.navigation.currentLocation.hasMarket)
            {
                result.Add(String.Format("Resting at the {0} Inn. The bed was hard, the bread was hard, but my coin purse seems softer.", player.navigation.currentLocation.name));
                player.attributes.ResetStats();
            }
            else
                result.Add(String.Format("{0} does not have an Inn. I must find a place with a Market to find and Inn and rest.", player.navigation.currentLocation.name));
            return result;
        }

        public Commands Handles()
        {
            return Commands.rest;
        }
    }
}
