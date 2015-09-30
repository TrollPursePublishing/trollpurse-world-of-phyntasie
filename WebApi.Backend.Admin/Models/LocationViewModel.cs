using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Backend.Admin.Models
{
    public class LocationViewModel
    {
        public string Name;
        public string Description;
        public AdventureQuestGame.Models.MonsterType MonsterType;
        public bool HasMarket;
        public bool IsExit;
        public Guid QuestGiverId;
        public List<Guid> RoomIds;
    }
}