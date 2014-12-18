using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class HelpCommandWorker : ICommandWorker
    {
        public Commands Handles()
        {
            return Commands.help;
        }

        public IList<string> Process(Models.Player player, string additionalParams, Contexts.GameContext GameCtx)
        {
            IList<string> result = new List<string> { "Available Commands:" };
            foreach (var i in Enum.GetValues(typeof(Commands)))
            {
                result.Add(i.ToString());
            }
            return result;
        }
    }
}
