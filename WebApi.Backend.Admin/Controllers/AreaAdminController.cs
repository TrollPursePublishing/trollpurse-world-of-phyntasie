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
    [RoutePrefix("area")]
    public class AreaAdminController : ApiController
    {
        private readonly AdventureQuestGame.Admin.AreaAdministration adminService = new AdventureQuestGame.Admin.AreaAdministration();

        [HttpGet]
        [Route("GetAreas")]
        public IHttpActionResult GetAreas()
        {
            return Ok(adminService.GetAreas());
        }

        [HttpPost]
        [Route("UpdateArea/{Id}")]
        public IHttpActionResult UpdateArea(Guid Id, [FromBody]AreaViewModel model)
        {
            return Ok(adminService.UpdateArea(Id, model.Name,
                model.Description,
                model.ImagePath,
                model.LocationIds));
        }

        [HttpPut]
        [Route("CreateArea")]
        public IHttpActionResult CreateArea([FromBody]AreaViewModel model)
        {
            return Ok(adminService.CreateArea(model.Name,
                model.Description,
                model.ImagePath,
                model.LocationIds));
        }

        [HttpDelete]
        [Route("DeleteArea/{Id}")]
        public void DeleteArea(Guid Id)
        {
            adminService.DeleteArea(Id);
        }
    }
}