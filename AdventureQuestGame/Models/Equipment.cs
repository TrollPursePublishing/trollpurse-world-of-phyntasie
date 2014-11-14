using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Equipment
    {
        public Equipment()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; private set; }
        public virtual Armor arm { get; set; }
        public virtual Armor head { get; set; }
        public virtual Armor torso { get; set; }
        public virtual Armor legs { get; set; }
        public virtual Armor feet { get; set; }
        public virtual Weapon weapon { get; set; }
    }
}
