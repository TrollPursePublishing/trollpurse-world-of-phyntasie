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
    [Authorize(Roles="Admin")]
    [RoutePrefix("quest")]
    public class QuestAdminController : ApiController
    {
        private readonly AdventureQuestGame.Admin.QuestAdministration adminService = new AdventureQuestGame.Admin.QuestAdministration();

        [HttpGet]
        [Route("GetAreas")]
        public IHttpActionResult GetAreas()
        {
            return Ok(adminService.GetAreas());
        }

        [HttpGet]
        [Route("GetRooms")]
        public IHttpActionResult GetRooms()
        {
            return Ok(adminService.GetRooms());
        }

        [HttpGet]
        [Route("GetQuestGivers")]
        public IHttpActionResult GetQuestGivers()
        {
            return Ok(adminService.GetQuestGivers());
        }

        [HttpGet]
        [Route("GetQuests")]
        public IHttpActionResult GetQuests()
        {
            return Ok(adminService.GetQuests());
        }

        [HttpPut]
        [Route("CreateQuest")]
        public IHttpActionResult CreateQuest([FromBody]QuestViewModel model)
        {
            return Ok(adminService.CreateQuest(model.Title,
                model.Description,
                model.Instructions,
                model.GoldReward,
                model.ScoreReward,
                model.ExperienceReward,
                model.QuestType,
                model.NameOfObject,
                model.CountNeeded,
                model.NextQuestId));
        }

        [HttpPut]
        [Route("CreateQuestGiver")]
        public IHttpActionResult CreateQuestGiver([FromBody]QuestGiverViewModel model)
        {
            return Ok(adminService.CreateQuestGiver(model.Name,
                model.Description,
                model.QuestId,
                model.QuestIdsToComplete));
        }

        [HttpDelete]
        [Route("DeleteQuest/{Id}")]
        public void DeleteQuest(Guid Id)
        {
            adminService.DeleteQuest(Id);
        }

        [HttpDelete]
        [Route("DeleteQuestGiver/{Id}")]
        public void DeleteQuestGiver(Guid Id)
        {
            adminService.DeleteQuestGiver(Id);
        }

        [HttpPost]
        [Route("UpdateQuestGiver/{Id}")]
        public IHttpActionResult UpdateQuestGiver(Guid Id, [FromBody]QuestGiverViewModel model)
        {
            return Ok(adminService.UpdateQuestGiver(Id, model.Name,
                model.Description,
                model.QuestId,
                model.QuestIdsToComplete));
        }
    }
}
