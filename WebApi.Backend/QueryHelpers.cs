using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Admin
{
    public class NameDistinct : IEqualityComparer<Relic>,
        IEqualityComparer<Monster>
    {
        public bool Equals(Relic x, Relic y)
        {
            return x.name == y.name;
        }

        public int GetHashCode(Relic obj)
        {
            return obj.name.GetHashCode();
        }

        public bool Equals(Monster x, Monster y)
        {
            return x.name == y.name;
        }

        public int GetHashCode(Monster obj)
        {
            return obj.name.GetHashCode();
        }
    }
}
