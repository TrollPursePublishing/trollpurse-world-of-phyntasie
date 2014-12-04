using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public enum QuestType
    {
        Slay,
        Collect,
        GoTo
    }

    [Serializable]
    public class Quest
    {
        protected Quest() { }

        public Quest(string title, string description, string instructions, int goldReward, int scoreReward, int experienceReward, QuestType type, string nameOfObject, int countNeeded = 1, Quest nextQuest = null)
        {
            Id = Guid.NewGuid();
            Title = title;
            Description = description;
            Gold = goldReward;
            Score = scoreReward;
            Experience = experienceReward;
            Instructions = instructions;
            Type = type;
            NameOfObject = nameOfObject;
            CountNeeded = countNeeded;
            NextQuest = nextQuest;
        }

        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public string Instructions { get; private set; }
        public int Gold { get; private set; }
        public int Score { get; private set; }
        public int Experience { get; private set; }
        public int CountNeeded { get; private set; }
        public QuestType Type { get; private set; }
        public string NameOfObject { get; private set; }
        public bool IsComplete(int currentCount) { return currentCount >= CountNeeded; }
        public virtual Quest NextQuest { get; private set; }
    }
}
