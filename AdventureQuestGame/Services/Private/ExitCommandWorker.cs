using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class ExitCommandWorker : ICommandWorker
    {
        public IList<string> Process(Player player, string additionalParams, GameContext GameCtx)
        {
            if (player.isInCombat)
                return new List<string>(new[] { "I am no coward, I cannot leave whilst combating a mighty foe!" });

            if (player.navigation.currentRoom != null && player.navigation.currentRoom.isExit)
            {
                player.isInside = false;
                Room old = player.navigation.currentRoom;
                player.expireRoom = true;

                List<string> result = new List<string>(){ String.Format("Exiting {0}.", old.name) };

                result.Add(String.Format("{0}, {1}", player.navigation.currentLocation.name, player.navigation.currentLocation.description));
                if (player.navigation.currentLocation.QuestGiver != null && player.navigation.currentLocation.QuestGiver.CanDoQuest(player))
                    result.Add(String.Format("{0} is here. {1}", player.navigation.currentLocation.QuestGiver.Name, player.navigation.currentLocation.QuestGiver.Description));
                
                return result;
            }
            else
            {
                return new List<string>(new[]{"There is no exit in this place."});
            }
        }

        public Commands Handles()
        {
            return Commands.exit;
        }
    }
}
