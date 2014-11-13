using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;
using AdventureQuestGame.Services;
using WebApi.Attributes;
using Microsoft.Owin;
using System.Security.Claims;

namespace WebApi.Controllers
{
    public class CommandController : ApiController
    {
        CommandService service = new CommandService();

        [HttpGet]
        [Authorize(Roles="Player")]
        [Route("api/command/{playerId}/{parameters}")]
        public async Task<string> Command(string playerId, string parameters)
        {
            try
            {
                var ctx = Request.GetOwinContext();
                var user = ctx.Authentication.User;
                var claims = user.Claims;
                if (claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier) && c.Value.Equals(playerId)) != null)
                    return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(service.ProcessCommand(service.ResolvePlayer(Guid.Parse(playerId)), parameters)));
                else
                    return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject("The world used to be a good place, but now it is not..."));
            }
            catch(Exception e)
            {
                return JsonConvert.SerializeObject("The world used to be a good place, but now it is not...");
            }
        }
    }
}
