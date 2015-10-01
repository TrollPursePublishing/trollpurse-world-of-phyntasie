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
    [Authorize(Roles="Admin")]
    [RoutePrefix("event")]
    public class EventAdminController : ApiController
    {
        EventAdministration service = new EventAdministration();

        [HttpGet]
        [Route("GetEvents")]
        public IHttpActionResult GetEvents()
        {
            return Ok(service.GetEvents());
        }

        [HttpPut]
        [Route("CreateEvent")]
        public IHttpActionResult CreateEvent([FromBody]EventViewModel model)
        {
            return Ok(service.CreateEvent(model.Title, model.Description));
        }
    }
}
