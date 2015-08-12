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
        public Task<string> Get(string playerId)
        {
            try
            {
                return Task.Run(() =>
                {
                    var ctx = Request.GetOwinContext();
                    var user = ctx.Authentication.User;
                    var claims = user.Claims;
                    if (claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier) && c.Value.Equals(playerId)) != null)
                        return JsonConvert.SerializeObject(service.GetPlayer(Guid.Parse(playerId)));
                    else
                        return JsonConvert.SerializeObject("null");
                });
            }
            catch(Exception)
            {
                return Task.Run(() => JsonConvert.SerializeObject("null"));
            }
        }
    }
}
