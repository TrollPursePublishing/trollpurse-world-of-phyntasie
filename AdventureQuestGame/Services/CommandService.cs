using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        private GoService goService = new GoService();
        private ExitService exitService = new ExitService();
        private AttackService attackService = new AttackService();
        private CastService castService = new CastService();
        private UseService useService = new UseService();
        private EquipService equipService = new EquipService();
        private BuyService buyService = new BuyService();
        private ExploreService exploreService = new ExploreService();
        private RestService restService = new RestService();

        public Player ResolvePlayer(Guid id)
        {
            return GameCtx.players.First(p => p.Id == id);
        }

        public GameResponse ProcessCommand(Player player, string additionalParams)
        {
            IList<string> result;
            if (!additionalParams.StartsWith("-"))
                return new GameResponse(new List<string>(new[]{"Commands must start with '-', type '-help' for help."}), player);

            bool hasParams = additionalParams.IndexOf(' ') > 0;
            int commandEndIndex = hasParams ? additionalParams.IndexOf(' ') - 1 : additionalParams.Length - 1;
            string command = additionalParams.Substring(1, commandEndIndex).Trim().ToLower();
            if (hasParams)
                additionalParams = additionalParams.Substring(commandEndIndex + 2);

            Commands ecommand;
            bool success = Enum.TryParse<Commands>(command, true, out ecommand);

            if (!success)
            {
                return new GameResponse(new List<string>(new[]{String.Format("I do not know how to {0}", command)}), player);
            }

            switch (ecommand)
            {
                case Commands.go:
                    result = goService.Process(player, additionalParams, GameCtx);
                    break;

                case Commands.exit:
                    result = exitService.Process(player);
                    break;

                case Commands.attack:
                    result = attackService.Process(player, GameCtx);
                    break;

                case Commands.cast:
                    result = castService.Process(player, additionalParams, GameCtx);
                    break;

                case Commands.use:
                    result = useService.Process(player, additionalParams, GameCtx);
                    break;

                case Commands.equip:
                    result = equipService.Process(player, additionalParams);
                    break;

                case Commands.buy:
                    result = buyService.Process(player, additionalParams);
                    break;

                case Commands.map:
                    result = PrintMap(player);
                    break;

                case Commands.explore:
                    result = exploreService.Process(player);
                    break;

                case Commands.rest:
                    result = restService.Process(player);
                    break;

                default:
                    result = new List<string>();
                    foreach(var i in Enum.GetValues(typeof(Commands)))
                    {
                        result.Add("-" + i.ToString());
                    }
                    break;
            }

            DetectOneToOneRemovals(player);
            DetectLevelUpEvent(player);
            GameCtx.SaveChanges();
            return new GameResponse(result, player);
        }

        private IList<string> PrintMap(Player p)
        {
            IList<string> result = new List<string>();
            p.navigation.currentWorld.areas
                .ToList()
                .ForEach(a => result.Add(a.name));
            return result;            
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
