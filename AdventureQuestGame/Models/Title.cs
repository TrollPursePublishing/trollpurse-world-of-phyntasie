using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public class Title
    {
        protected Title() { }

        public Title(string name, string description, Gender genderRelation, int levelToAcheive)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.description = description;
            this.genderRelation = genderRelation;
            this.levelToAcheive = levelToAcheive;
        }

        public Guid Id { get; set; }
        public string name { get; set; }
        public string description {get; set;}
        public Gender genderRelation { get; set; }
        public int levelToAcheive { get; set; }

        public Title Copy()
        {
            Title t = MemberwiseClone() as Title;
            t.Id = Guid.NewGuid();
            return t;
        }
    }
}
