using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class World
    {
        protected World() { }

        public World(string name, string description)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            areas = new List<Area>();
        }

        public Guid Id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public virtual ICollection<Area> areas { get; set; }
    }
}
