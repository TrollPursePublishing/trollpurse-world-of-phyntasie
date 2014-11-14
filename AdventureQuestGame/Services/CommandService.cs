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
        rest
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
                return new GameResponse(new List<string>(new[]{"Commands must start with '-', type '-help' for help."}), player);

            string command = ParseCommands(ref additionalParams);
            Commands ecommand;
            bool success = Enum.TryParse<Commands>(command, true, out ecommand);

            if (!success)
            {
                return new GameResponse(new List<string>(new[]{String.Format("I do not know how to {0}", command)}), player);
            }

            result = workers.First(w => w.Handles().Equals(ecommand)).Process(player, additionalParams, GameCtx);

            DetectOneToOneRemovals(player);
            DetectLevelUpEvent(player);
            GameCtx.SaveChanges();

            return new GameResponse(result, player);
        }

        private void DetectLevelUpEvent(Player player)
        {
            if (player.attributes.leveledUp)
            {
                List<Title> sorted = GameCtx.titles
                    .Where(t => t.levelToAcheive <= player.attributes.level)
                    .OrderBy(t => t.levelToAcheive)
                    .ToList();

                sorted.Reverse();

                player.title = sorted
                    .First()
                    .Copy();
                
                Spell[] spells = GameCtx.spells.Where(s => s.minLevel <= player.attributes.level).ToArray();
                foreach(Spell s in spells)
                {
                    bool has = false;
                    foreach(Spell ps in player.spells)
                        has |= ps.name.Equals(s.name);
                    
                    if (!has)
                        player.spells.Add(s.Copy());
                }

                GameCtx.achievements.Add(new Acheivement("Has Grown More Wiser", String.Format("Gained another point to their level, making them stronger, braver, faster than before. This is granted for reaching level {0}.", player.attributes.level), player));
            }
            player.attributes.leveledUp = false;
        }

        private void DetectOneToOneRemovals(Player player)
        {
            if (player.equipment.feet != null && player.equipment.feet.durability <= 0)
            {
                GameCtx.Entry(player.equipment.feet).State = EntityState.Deleted;
            }

            if (player.equipment.head != null && player.equipment.head.durability <= 0)
            {
                GameCtx.Entry(player.equipment.head).State = EntityState.Deleted;
            }

            if (player.equipment.torso != null && player.equipment.torso.durability <= 0)
            {
                GameCtx.Entry(player.equipment.torso).State = EntityState.Deleted;
            }

            if (player.equipment.arm != null && player.equipment.arm.durability <= 0)
            {
                GameCtx.Entry(player.equipment.arm).State = EntityState.Deleted;
            }

            if (player.equipment.legs != null && player.equipment.legs.durability <= 0)
            {
                GameCtx.Entry(player.equipment.legs).State = EntityState.Deleted;
            }

            if (player.navigation.currentRoom != null && player.expireRoom)
            {
                GameCtx.players.First(p => p.Id == player.Id).navigation.currentRoom = null;
                player.expireRoom = false;
            }
        }
    }
}
