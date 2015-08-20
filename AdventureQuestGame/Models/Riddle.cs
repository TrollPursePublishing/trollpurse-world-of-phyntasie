using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    public class Riddle
    {
        public Riddle(string question, string answer)
        {
            Question = question;
            Answer = answer;
            Id = Guid.NewGuid();
        }

        protected Riddle() { }

        public bool IsAnswer(string input)
        {
            return input.ToLower().Contains(Answer.ToLower());
        }

        public Guid Id { get; private set; }
        public string Question { get; protected set; }
        public string Answer { get; protected set; }
    }
}
