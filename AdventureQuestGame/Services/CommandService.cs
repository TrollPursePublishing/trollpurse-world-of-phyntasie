using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;

namespace AdventureQuestGame.Services
{
    public enum Commands
    {
        go,
        exit,
        attack,
        cast,
        use,
        equip,
        buy,
        help,
        map,
        explore,
        rest,
        quest
    }

    public class GameResponse
    {
        public IList<string> messages { get; private set; }
        public Player player { get; private set; }
        public GameResponse(IList<string> messages, Player player)
        {
            this.messages = messages;
            this.player = player;
        }
    }

    public class CommandService : AbstractService
    {
        private ICollection<ICommandWorker> workers;

        public CommandService()
        {
            workers = new List<ICommandWorker>();
            foreach (Type worker in Assembly.GetExecutingAssembly().GetTypes().Where(t => t.GetInterfaces().Contains(typeof(ICommandWorker))))
            {
                workers.Add(Activator.CreateInstance(worker) as ICommandWorker);
            }
        }

        public string ParseCommands(ref string additionalParams)
        {
            bool hasParams = additionalParams.IndexOf(' ') > 0;
            int commandEndIndex = hasParams ? additionalParams.IndexOf(' ') - 1 : additionalParams.Length - 1;
            string command = additionalParams.Substring(1, commandEndIndex).Trim().ToLower();
            if (hasParams)
                additionalParams = additionalParams.Substring(commandEndIndex + 2);

            return command;
        }

        public Player ResolvePlayer(Guid id)
        {
            return GameCtx.players.First(p => p.Id == id);
        }

        public GameResponse ProcessCommand(Player player, string additionalParams)
        {
            IList<string> result;
            if (!additionalParams.StartsWith("-"))
                return new GameResponse(new List<string>(new[] { "Commands must start with '-', type '-help' for help." }), player);

            string command = ParseCommands(ref additionalParams);
            Commands ecommand;
            bool success = Enum.TryParse<Commands>(command, true, out ecommand);

            if (!success)
            {
                return new GameResponse(new List<string>(new[] { String.Format("I do not know how to {0}", command) }), player);
            }

            result = workers.First(w => w.Handles().Equals(ecommand)).Process(player, additionalParams, GameCtx);

            GameplayStatics.DetectOneToOneRemovals(GameCtx, player);
            GameplayStatics.DetectLevelUpEvent(GameCtx, player);
            GameplayStatics.DetectCompletedQuests(GameCtx, player);
            GameCtx.SaveChanges();

            return new GameResponse(result, player);
        }
    }
}
