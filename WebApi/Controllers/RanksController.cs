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
    class RankNameScorePair
    {
        public string name { get; private set; }
        public int score { get; private set; }
        public RankNameScorePair(string name, int score)
        {
            this.name = name;
            this.score = score;
        }
    }

    class RanksViewModel
    {
        public List<RankNameScorePair> pairs = new List<RankNameScorePair>();
    }

    public class RanksController : ApiController
    {
        private RankService service = new RankService();

        [HttpGet]
        [AllowAnonymous]
        [Route("api/ranks/{playerId}")]
        public async Task<string> Get(string playerId)
        {
            return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(service.GetStatsById(new Guid(playerId))));
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/ranks/topten")]
        public async Task<string> Get()
        {
            try
            {
                RanksViewModel vm = new RanksViewModel();
                service.GetTopTen().ToList().ForEach(r => vm.pairs.Add(new RankNameScorePair(r.FullName, r.stats.score)));
                return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(vm));
            }catch(Exception e)
            {
                return JsonConvert.SerializeObject(e);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/ranks/all")]
        public async Task<string> GetAll()
        {
            RanksViewModel vm = new RanksViewModel();
            service.GetAllOrdered().ToList().ForEach(r => vm.pairs.Add(new RankNameScorePair(r.FullName, r.stats.score)));
            return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(vm));
        }
    }
}
