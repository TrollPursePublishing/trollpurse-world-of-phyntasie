using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public enum CardinalPoints : int
    {
        North,
        South,
        East,
        West
    }

    [Serializable]
    public class Room
    {
        protected Room() { }

        public Room(string name, string description, bool isExit, int chanceForRelic)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.isExit = isExit;
            this.chanceForRelic = chanceForRelic;
            linkedRoom = new List<Room>();
        }

        public Guid? Id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool isExit { get; set; }
        public virtual ICollection<Room> linkedRoom { get; set; }
        public int chanceForRelic { get; set; }
    }
}
