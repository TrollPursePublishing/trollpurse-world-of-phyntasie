using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Backend.Admin.Models
{
    public struct QuestViewModel
    {
        public string Title;
        public string Description;
        public string Instructions;
        public int GoldReward;
        public int ScoreReward;
        public int ExperienceReward;
        public AdventureQuestGame.Models.QuestType QuestType;
        public string NameOfObject;
        public int CountNeeded;
        public Guid NextQuestId;
    }

    public struct QuestGiverViewModel
    {
        public string Name;
        public string Description;
        public Guid QuestId;
        public List<Guid> QuestIdsToComplete;
    }
}