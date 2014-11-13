using AdventureQuestGame.Services;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Owin;
using System.Security.Claims;
using System.Net.Http;
using System.Linq;

namespace WebApi.Controllers
{
    public class PlayerController : ApiController
    {
        private PlayerService service = new PlayerService();

        [HttpGet]
        [Authorize(Roles="Player")]
        [Route("api/player/{playerId}")]
        public async Task<string> Get(string playerId)
        {
            try
            {
                var ctx = Request.GetOwinContext();
                var user = ctx.Authentication.User;
                var claims = user.Claims;
                if (claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier) && c.Value.Equals(playerId)) != null)
                    return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(service.GetPlayer(Guid.Parse(playerId))));
                else
                    return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject("null"));
            }
            catch(Exception e)
            {
                return JsonConvert.SerializeObject("null");
            }
        }
    }
}
