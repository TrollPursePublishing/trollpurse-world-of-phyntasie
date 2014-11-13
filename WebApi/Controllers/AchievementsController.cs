using AdventureQuestGame.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace WebApi.Controllers
{
    class NameAchPair
    {
        public string playerName { get; private set; }
        public string name {get; private set;}
        public string description {get; private set;}

        public NameAchPair(string playerName, string name, string description)
        {
            this.playerName = playerName;
            this.name = name;
            this.description = description;
        }
    }

    class AchievementsViewModel
    {
        public List<NameAchPair> pairs = new List<NameAchPair>();
    }

    public class AchievementsController : ApiController
    {
        private AchievementsService service = new AchievementsService();

        [HttpGet]
        [AllowAnonymous]
        [Route("api/ach/{playerId}")]
        public async Task<string> Get(string playerId)
        {
            AchievementsViewModel vm = new AchievementsViewModel();
            service.GetPlayerAcheivements(playerId).ToList().ForEach(a => vm.pairs.Add(new NameAchPair(a.player.name, a.name, a.description)));
            return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(vm));
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/ach/latest")]
        public async Task<string> Get()
        {
            AchievementsViewModel vm = new AchievementsViewModel();
            service.GetPlayerAcheivementsOrdered().ToList().ForEach(a => vm.pairs.Add(new NameAchPair(a.player.name, a.name, a.description)));
            return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(vm));
        }
    }
}
