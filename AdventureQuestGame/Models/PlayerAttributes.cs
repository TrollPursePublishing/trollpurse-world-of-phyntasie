using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public enum PlayerState : int
    {
        Alive,
        Dead
    }

    [Serializable]
    public class PlayerAttributes
    {
        public PlayerAttributes()
        {
            Id = Guid.NewGuid();
            strength = currentStrength = 5;
            mana = currentMana = 10;
            stanima = currentStanima = 10;
            toughness = currentToughness = 2;
            health = currentHealth = 12;
            experience = 0;
            level = 1;
            state = PlayerState.Alive;
            leveledUp = false;
        }

        public PlayerAttributes(int str, int tgh, int hlth, int lvl)
        {
            Id = Guid.NewGuid();
            strength = currentStrength = str;
            mana = currentMana = 10;
            stanima = currentStanima = 10;
            toughness = currentToughness = tgh;
            health = currentHealth = hlth;
            experience = 0;
            level = lvl;
            state = PlayerState.Alive;
            leveledUp = false;
        }

        public Guid Id { get; set; }
        public int strength {get; set;}
        public int mana { get; set; }
        public int stanima { get; set; }
        public int toughness { get; set; }
        public int health { get; set; }
        public int experience { get; set; }
        public int level { get; set; }

        public int currentStrength { get; set; }
        public int currentMana { get; set; }
        public int currentStanima { get; set; }
        public int currentToughness { get; set; }
        public int currentHealth { get; set; }

        public PlayerState state { get; set; }

        public bool leveledUp { get; set; }

        public void ResetStats()
        {
            currentHealth = health;
            currentMana = mana;
            currentStanima = stanima;
            currentStrength = strength;
            currentToughness = toughness;
        }

        private int calcStats(int flat, int mod)
        {
            return flat * (level % mod);
        }

        private void LevelUp()
        {
            level += 1;
            currentHealth = health = health + calcStats(10, 6);
            currentMana = mana = mana + calcStats(5, 3);
            currentStanima = stanima = stanima + calcStats(8, 3);
            currentStrength = strength = strength + calcStats(1, 3);
            currentToughness = toughness = toughness + calcStats(1, 2);
            leveledUp = true;
        }

        public void AddExperience(int value)
        {
            experience += value;
            if(experience > ((level * 1000 + (100 * (level % 100)))))
            {
                LevelUp();
            }
        }
    }
}
