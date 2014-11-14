using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class MapCommandWorker : ICommandWorker
    {
        public Commands Handles()
        {
            return Commands.map;
        }

        public IList<string> Process(Models.Player player, string additionalParams, Contexts.GameContext GameCtx)
        {
            IList<string> result = new List<string>();
            player.navigation.currentWorld.areas
                .ToList()
                .ForEach(a => result.Add(a.name));
            return result; 
        }
    }
}
