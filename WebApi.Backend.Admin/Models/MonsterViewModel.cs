using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Backend.Admin.Models
{
    public class MonsterViewModel
    {
        public string Name;
        public string Description;
        public int Strength;
        public int Toughness;
        public int Health;
        public int Level;
        public AdventureQuestGame.Models.MonsterType Type;
    }
}