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
    public class CommandViewModel
    {
        public string playerId { get; set; }
        public string parameters { get; set; }
    }

    public class CommandController : ApiController
    {
        CommandService service = new CommandService();

        [HttpPost]
        [Authorize(Roles="Player")]
        [Route("api/command/")]
        public async Task<string> Command([FromBody]CommandViewModel command)
        {
            if (command != null && !String.IsNullOrWhiteSpace(command.playerId) && !String.IsNullOrWhiteSpace(command.parameters))
            {
                try
                {
                    var ctx = Request.GetOwinContext();
                    var user = ctx.Authentication.User;
                    var claims = user.Claims;
                    if (claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier) && c.Value.Equals(command.playerId)) != null)
                        return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(service.ProcessCommand(service.ResolvePlayer(Guid.Parse(command.playerId)), command.parameters)));
                    else
                        return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject("The world used to be a good place, but now it is not..."));
                }
                catch (Exception e)
                {
                    return JsonConvert.SerializeObject("The world used to be a good place, but now it is not...");
                }
            }
            else
            {
                return JsonConvert.SerializeObject("The world used to be a good place, but now it is not...");
            }
        }
    }
}
