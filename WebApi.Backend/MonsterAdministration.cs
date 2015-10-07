using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AdventureQuestGame.Models;
using System.Data.Entity;

namespace AdventureQuestGame.Admin
{
    public class MonsterAdministration : AbstractService
    {
        public MonsterAdministration()
        {
            GameCtx.Configuration.LazyLoadingEnabled = false;
        }

        public List<Monster> GetMonsters()
        {
            return GameCtx.monsters
                .Include(m => m.attribute)
                .Where(m =>
                    GameCtx.players
                    .FirstOrDefault(p => p.engaging.Id == m.Id) == null
                    &&
                    m.attribute.health == m.attribute.currentHealth
                )
                .ToArray()
                .Distinct(new NameDistinct())
                .ToList();
        }

        public Monster CreateMonster(string name, string description, int strength, int toughness, int health, int level, MonsterType type)
        {
            var created = new Monster(name, description, new PlayerAttributes(strength, toughness, health, level), type);
            GameCtx.monsters.Add(created);
            GameCtx.SaveChanges();
            return created;
        }

        public Monster UpdateMonster(Guid Id, string name, string description, int strength, int toughness, int health, int level, MonsterType type)
        {
            var updated = GameCtx.monsters.Include(m => m.attribute).SingleOrDefault(m => m.Id == Id);
            if(updated != null)
            {
                updated.name = name;
                updated.description = description;
                updated.attribute.currentStrength = updated.attribute.strength = strength;
                updated.attribute.currentToughness = updated.attribute.toughness = toughness;
                updated.attribute.currentHealth = updated.attribute.health = health;
                updated.attribute.level = level;
                updated.type = type;

                GameCtx.SaveChanges();
            }
            return updated;
        }

        public void DeleteMonster(Guid Id)
        {
            var toDelete = GameCtx.monsters.Include(m => m.attribute).SingleOrDefault(m => m.Id == Id);
            if(toDelete != null)
            {
                GameCtx.monsters.Remove(toDelete);
                GameCtx.SaveChanges();
            }
        }
    }
}
