﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Location
    {
        protected Location() { }

        public Location(string name, string description)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.rooms = new List<Room>();
            this.isExit = false;
            this.hasMarket = false;
            monsterTypeHere = MonsterType.Monster;
            this.QuestGiver = null;
        }

        public Guid Id { get; private set; }
        public string name { get; set; }
        public string description  { get; set; }
        public virtual ICollection<Room> rooms { get; set; }
        public bool isExit { get; set; }
        public bool hasMarket { get; set; }
        public MonsterType monsterTypeHere { get; set; }
        public virtual QuestGiver QuestGiver { get; set; }
    }
}
