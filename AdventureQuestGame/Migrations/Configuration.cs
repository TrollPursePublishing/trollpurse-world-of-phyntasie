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
            AutomaticMigrationDataLossAllowed = true;
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

            context.events.RemoveRange(context.events.Where(e => e.title.Equals("Game Update")));
            context.monsters.RemoveRange(context.monsters.Where(m => m.attribute.currentHealth <= 0));

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

            var bs = context.locations.First(l => l.name.Equals("Buttleberry Square"));
            if (bs.QuestGiver == null)
                bs.QuestGiver = new QuestGiver("Buttleberry Herald", "He stands there, smug, with his uniform sporting a large orange berry. His myraid colours truly relay his job - a herald. Town crier, the easiest job of late. A true slacker. However, it seems he has a job for me.",
                    new Quest("The Imp Menace", "Hear ye! Hear ye, there are most abundant collections of nasty creatures within our dungeon that are of most import to remove from the vacinity. Rewards, a-plenty. Honor, a-plenty. All bestowed upon the completion of this boon from our most merciful Lord Buttleberry!",
                        "Combat and slay three Imps.", 100, 10, 300, QuestType.Slay, "Imp", 3));

            var rw = context.locations.First(l => l.name.Equals("Reedton Wharf"));
            if (rw.QuestGiver == null)
                rw.QuestGiver = new QuestGiver("Dying Gentleman", "The Dying Gentleman is sitting there, hands folded. His eyes wander to you, looking hopefully. You feel drawn to him, as if you share a brotherhood. It seems he has something to request of you.",
                   new Quest("One Last Glimpse...", "Dear Adventurer, will you aid a foolish old man? Like you, I used to adventure, until I took a bolt to the hip. I have seen many things, marvelous things: creatures you cannot imagine, dungeons deeper than the earth itself, and treasures beyond mortal comprehension. Alas, I have never laid my eyes upon on object of which I could never find. Will you assist me... with my dying wish? I wish to lay eyes upon the Basket of Rock, go forth and find it, please, afore I waste to nothing.",
                       "Explore and find one Basket of Rock", 120, 5, 150, QuestType.Collect, "Basket of Rock", 1));
               

            context.locations.AddOrUpdate(
                r => r.Id
                );

            context.markets.AddOrUpdate(
                r => r.Id
                );

            context.monsters.AddOrUpdate(
                r => r.Id
                );

            foreach(Player p in context.players)
            {
                if (p.quests == null)
                    p.quests = new PlayerQuests();
            }
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
