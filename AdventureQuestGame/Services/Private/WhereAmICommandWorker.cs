using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class WhereAmICommandWorker : ICommandWorker
    {
        public Commands Handles()
        {
            return Commands.whereami;
        }

        public IList<string> Process(Models.Player player, string additionalParams, Contexts.GameContext GameCtx)
        {
            List<string> results = new List<string>();
            if (player.navigation.currentRoom != null || player.navigation.isInRoom)
            {
                results.Add(String.Format("I am in {0} and I can go to the following places.", player.navigation.currentRoom.name));
                foreach (var room in player.navigation.currentRoom.linkedRoom) {
                    results.Add(room.name);
                }
                if(player.navigation.currentRoom.isExit)
                {
                    results.Add(String.Format("I may also exit from this room to {0}", player.navigation.currentLocation.name));
                }
            }
            else
            {
                results.Add(String.Format("I am in {0} and I may go to the following places.", player.navigation.currentArea.name));
                foreach (var location in player.navigation.currentArea.locations)
                {
                    results.Add(location.name);
                }
                if (player.navigation.currentLocation.rooms != null && player.navigation.currentLocation.rooms.Count > 0)
                {
                    results.Add(String.Format("{0} also has an entrance at {1}", player.navigation.currentLocation.name, player.navigation.currentLocation.rooms.First(r => r.isExit).name));
                }
                if (player.navigation.currentLocation.isExit)
                {
                    results.Add(String.Format("I may also travel from {0} to farther lands. I could check my map.", player.navigation.currentLocation.name));
                }
            }
            return results;
        }
    }
}
