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
            when = DateTime.UtcNow;
            this.title = title;
            this.description = description;
        }

        public Guid Id { get; private set; }
        public string title { get; private set; }
        public string description { get; private set; }
        public DateTime when { get; private set; }
    }
}
