using AdventureQuestGame.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    public class AbstractService : IDisposable
    {
        private GameContext ctx = new GameContext();

        protected GameContext GameCtx
        {
            get
            {
                return ctx;
            }
        }

        public void Dispose()
        {
            ctx.Dispose();
        }
    }
}
