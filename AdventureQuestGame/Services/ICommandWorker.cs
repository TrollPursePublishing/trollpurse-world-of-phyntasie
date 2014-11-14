using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services
{
    interface ICommandWorker
    {
        Commands Handles();
        IList<string> Process(Player player, string additionalParams, GameContext GameCtx);
    }
}
