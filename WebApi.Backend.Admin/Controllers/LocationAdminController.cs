using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Backend.Admin.Models;

namespace WebApi.Backend.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("location")]
    public class LocationAdminController : ApiController
    {
        private readonly AdventureQuestGame.Admin.LocationAdministration adminService = new AdventureQuestGame.Admin.LocationAdministration();

        [HttpGet]
        [Route("GetLocations")]
        public IHttpActionResult GetLocations()
        {
            return Ok(adminService.GetLocations());
        }

        [HttpPost]
        [Route("UpdateLocation/{Id}")]
        public IHttpActionResult UpdateLocation(Guid Id, [FromBody]Location model)
        {
            return Ok(adminService.UpdateLocation(Id, model));
        }

        [HttpPut]
        [Route("CreateLocation")]
        public IHttpActionResult CreateLocation([FromBody]LocationViewModel model)
        {
            return Ok(adminService.CreateLocation(model.Name,
                model.Description,
                model.MonsterType,
                model.HasMarket,
                model.IsExit,
                model.QuestGiverId,
                model.RoomIds));
        }

        [HttpDelete]
        [Route("DeleteLocation/{Id}")]
        public void DeleteLocation(Guid Id)
        {
            adminService.DeleteLocation(Id);
        }
    }
}
