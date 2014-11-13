using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class ExitService
    {
        public IList<string> Process(Player player)
        {
            if (player.isInCombat)
                return new List<string>(new[] { "I am no coward, I cannot leave whilst combating a mighty foe!" });

            if (player.navigation.currentRoom != null && player.navigation.currentRoom.isExit)
            {
                player.isInside = false;
                Room old = player.navigation.currentRoom;
                player.expireRoom = true;
                return new List<string>(new[]{String.Format("Exiting {0}.", old.name)});
            }
            else
            {
                return new List<string>(new[]{"There is not exit in this place."});
            }
        }
    }
}
