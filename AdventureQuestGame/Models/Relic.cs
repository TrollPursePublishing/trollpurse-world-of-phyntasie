using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Relic
    {
        protected Relic() { }

        public Relic(string name, string description, int value)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.value = value;
        }

        public Guid Id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int value { get; set; }

        public Relic Copy()
        {
            Relic r = MemberwiseClone() as Relic;
            r.Id = Guid.NewGuid();
            return r;
        }
    }
}
