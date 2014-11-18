namespace AdventureQuestGame.Migrations
{
    using AdventureQuestGame.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    public sealed class Configuration : DbMigrationsConfiguration<AdventureQuestGame.Contexts.GameContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "AdventureQuestGame.Contexts.GameContext";
        }

        protected override void Seed(AdventureQuestGame.Contexts.GameContext context)
        {
            foreach(Room room in context.rooms)
            {
                if(room.chanceForRelic <= 0)
                    room.chanceForRelic = 5;
            }
            context.rooms.AddOrUpdate(
                r => r.Id
                );

            context.achievements.AddOrUpdate(
                r => r.Id
                );

            context.areas.AddOrUpdate(
                r => r.Id
                );

            context.armors.AddOrUpdate(
                r => r.Id
                );

            context.events.AddOrUpdate(
                r => r.Id,
                new Event("Game Update", "The game has been upgraded to a new version! Huzzah, there are tons of fixes and features added. Probably some new bugs as well.")
                );

            foreach (Location location in context.locations)
            {
                location.monsterTypeHere = MonsterType.Monster;
            }
            context.locations.First(l => l.name.Equals("Reedton Grasslands")).monsterTypeHere = MonsterType.Creature;
            context.locations.First(l => l.name.Equals("Reedton Castle")).monsterTypeHere = MonsterType.Person;
            context.locations.AddOrUpdate(
                r => r.Id
                );

            context.markets.AddOrUpdate(
                r => r.Id
                );

            context.monsters.AddOrUpdate(
                r => r.Id
                );

            context.players.AddOrUpdate(
                r => r.Id
                );

            context.playerstats.AddOrUpdate(
                r => r.Id
                );

            context.potions.AddOrUpdate(
                r => r.Id
                );

            context.relics.AddOrUpdate(
                r => r.Id
                );

            context.rooms.AddOrUpdate(
                r => r.Id
                );

            context.spells.AddOrUpdate(
                r => r.Id
                );

            context.titles.AddOrUpdate(
                r => r.Id
                );

            context.weapons.AddOrUpdate(
                r => r.Id
                );

            context.worlds.AddOrUpdate(
                r => r.Id
                );
        }
    }
}
