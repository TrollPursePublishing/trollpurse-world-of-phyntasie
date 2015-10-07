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
    [RoutePrefix("monster")]
    public class MonsterAdminController : ApiController
    {
        private MonsterAdministration service = new MonsterAdministration();

        [HttpGet]
        [Route("GetMonsters")]
        public IHttpActionResult GetMonsters()
        {
            return Ok(service.GetMonsters());
        }

        [HttpPut]
        [Route("CreateMonster")]
        public IHttpActionResult CreateMonster([FromBody]MonsterViewModel model)
        {
            return Ok(service.CreateMonster(model.Name,
                model.Description,
                model.Strength,
                model.Toughness,
                model.Health,
                model.Level,
                model.Type));
        }

        [HttpPost]
        [Route("UpdateMonster/{Id}")]
        public IHttpActionResult UpdateMonster(Guid Id, [FromBody]MonsterViewModel model)
        {
            return Ok(service.UpdateMonster(Id,
                model.Name,
                model.Description,
                model.Strength,
                model.Toughness,
                model.Health,
                model.Level,
                model.Type));
        }

        [HttpDelete]
        [Route("DeleteMonster/{Id}")]
        public void DeleteMonster(Guid Id)
        {
            service.DeleteMonster(Id);
        }
    }
}
