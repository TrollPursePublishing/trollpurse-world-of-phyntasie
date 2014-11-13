using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Navigation
    {
        public Navigation()
        {
            this.Id = Guid.NewGuid();
            isInRoom = false;
        }

        public Guid Id { get; set; }
        public virtual Location currentLocation { get; set; }
        public virtual Area currentArea { get; set; }
        public virtual Room currentRoom { get; set; }
        public virtual World currentWorld { get; set; }
        public bool isInRoom { get; set; }
    }
}
