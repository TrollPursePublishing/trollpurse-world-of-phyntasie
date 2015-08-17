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
        quest,
        whereami,
        unequip
    }

    public class GameResponse
    {
        public IList<string> messages { get; private set; }
        public Player player { get; private set; }
        public GameResponse(IList<string> messages, Player player)
        {
            this.messages = messages;
            this.player = player;

            //Trim data
            this.player.stats = null;
            this.player.navigation.currentWorld.areas = null;
            foreach (var r in this.player.navigation.currentLocation.rooms)
                r.linkedRoom = null;
            foreach (var l in this.player.navigation.currentArea.locations)
            {
                l.QuestGiver = null;
                foreach (var rr in l.rooms)
                    rr.linkedRoom = null;
            }
            this.player.quests = null;
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
            if (!hasParams)
                return additionalParams;

            string[] split = additionalParams.Split(' ');
            string[] add = new string[split.Length - 1];
            Array.ConstrainedCopy(split, 1, add, 0, add.Length);
            additionalParams = String.Join(" ", add);
            return split[0];
        }

        public Player ResolvePlayer(Guid id)
        {
            return GameCtx.players.First(p => p.Id == id);
        }

        public GameResponse ProcessCommand(Player player, string additionalParams)
        {
            IList<string> result;
            additionalParams = additionalParams.ToLower();
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
            (result as List<string>).AddRange(GameplayStatics.DetectCompletedQuests(GameCtx, player));
            GameCtx.SaveChanges();

            return new GameResponse(result, player);
        }
    }
}
