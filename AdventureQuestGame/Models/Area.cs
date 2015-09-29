using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    public class Area
    {
        protected Area() { }

        public Area(string name, string description)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.locations = new List<Location>();
        }

        public Guid Id { get; private set; } 
        public string name { get; set; }
        public string description { get; set; }
        public string imagepath { get; set; }
        public virtual ICollection<Location> locations { get; set; }
    }
}
