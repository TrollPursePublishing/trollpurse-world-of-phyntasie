using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using WebApi;
using Newtonsoft.Json;
using WebApi.Models;
using AdventureQuestGame.Services;
using System.Web.Http.Description;
using System.Text;
using System.Linq;
using AdventureQuestGame.Admin;
using WebApi.Backend.Admin.Models;

namespace WebApi.Backend.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("event")]
    public class EventAdminController : ApiController
    {
        EventAdministration service = new EventAdministration();

        private ApplicationUserManager _userManager = null;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        [HttpGet]
        [Route("GetEvents")]
        public IHttpActionResult GetEvents()
        {
            return Ok(service.GetEvents());
        }

        [HttpPut]
        [Route("CreateEvent")]
        public async Task<IHttpActionResult> CreateEvent([FromBody]EventViewModel model)
        {
            try
            {
                var result = service.CreateEvent(model.Title, model.Description);
                var mailableUsers = UserManager.Users
                    .Where(u => u.EmailConfirmed &&
                        u.SendMail &&
                        !String.IsNullOrEmpty(u.Email))
                    .Where(u => u.Claims
                        .FirstOrDefault(c => c.ClaimValue == "Player") != null)
                    .ToList();

                foreach (var u in mailableUsers)
                {
                    await UserManager.SendEmailAsync(u.Id,
                        String.Format("AdventureGameQuest: {0}", model.Title),
                        String.Format("{0}<br /><br /> Haven't played in a while? <a href=\"{1}\">Press to Play!</a><br /><br /> Don't want to receive these emails anymore? Log in to your account and disable Email Notifications.",
                            model.Description,
                           @"https://adventuregamequest.azurewebsites.net"));
                }

                return Ok(result);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }
    }
}