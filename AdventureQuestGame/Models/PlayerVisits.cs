using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    public class PlayerVisits
    {
        public PlayerVisits()
        {
            Id = Guid.NewGuid();
        }
        public Guid Id { get; set; }
        public Guid placesVisitedId { get; set; }
    }
}
