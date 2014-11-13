using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Event
    {
        protected Event() { }

        public Event(string title, string description)
        {
            Id = Guid.NewGuid();
            this.title = title;
            this.description = description;
        }

        public Guid Id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
    }
}
