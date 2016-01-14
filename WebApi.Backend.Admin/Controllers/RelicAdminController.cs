using AdventureQuestGame.Admin;
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
    [RoutePrefix("relic")]
    public class RelicAdminController : ApiController
    {
        private RelicAdministration service = new RelicAdministration();

        [HttpGet]
        [Route("GetRelics")]
        public IHttpActionResult GetRelics()
        {
            return Ok(service.GetRelics());
        }

        [HttpPut]
        [Route("CreateRelic")]
        public IHttpActionResult CreateMonster([FromBody]RelicViewModel model)
        {
            return Ok(service.CreateRelic(model.Name, model.Description, model.Value));
        }

        [HttpPost]
        [Route("UpdateRelic/{Id}")]
        public IHttpActionResult UpdateMonster(Guid Id, [FromBody]RelicViewModel model)
        {
            return Ok(service.UpdateRelic(Id, model.Name, model.Description, model.Value));
        }

        [HttpDelete]
        [Route("DeleteRelic/{Id}")]
        public void DeleteMonster(Guid Id)
        {
            service.DeleteRelic(Id);
        }
    }
}
