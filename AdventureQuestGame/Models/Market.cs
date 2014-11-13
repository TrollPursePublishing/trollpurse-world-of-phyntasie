using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Market
    {
        protected Market() { }

        public Market(Inventory inventory, Location locationIAmIn)
        {
            Id = Guid.NewGuid();
            this.inventory = inventory;
            this.locationIAmIn = locationIAmIn;
        }

        public Guid Id { get; set; }
        public virtual Inventory inventory  { get; set; }
        public virtual Location locationIAmIn { get; set; }
    }
}
