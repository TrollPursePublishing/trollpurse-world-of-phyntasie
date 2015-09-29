using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    public class Acheivement
    {
        protected Acheivement() { }

        public Acheivement(string name, string description, Player p)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.time = DateTime.UtcNow;
            this.player = p;
        }

        public Guid Id { get; private set; }
        public DateTime time { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public virtual Player player { get; set; }
    }
}
