using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    
    public class PlayerStats
    {
        public PlayerStats()
        {
            Id = Guid.NewGuid();
            joinDate = DateTime.UtcNow;
            areasDiscovered = 0;
            monstersKilled = 0;
            score = 0;

        }

        public Guid Id { get; private set; }
        public DateTime joinDate { get; private set; }
        public int areasDiscovered { get; set; }
        public int monstersKilled { get; set; }
        public int score { get; set; }
        public virtual ICollection<PlayerVisits> placesVisited { get; set; }
        public string playerImageUrl { get; private set; }
    }
}
