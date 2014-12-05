namespace AdventureQuestGame.Migrations
{
    using AdventureQuestGame.Models;
    using System;
    using System.Collections.Generic;
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

            foreach (Event e in context.events)
            {
                if (e.when == null)
                {
                    var refresh = new Event(e.title, e.description);
                    context.events.Remove(e);
                    context.events.Add(refresh);
                }
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
                       "Explore and find one Basket of Rock", 120, 5, 150, QuestType.Collect, "Basket of Rock", 1,
                           new Quest("One Final Treasure", "The old man wanted to see this back at Reedton Wharf.", "Go to Reedton Wharf", 1000, 125, 100, QuestType.GoTo, "Reedton Wharf")));

            var bm = context.locations.First(l => l.name.Equals("Buttleberry, The Marble Manor"));
            if (bm.QuestGiver == null)
                bm.QuestGiver = new QuestGiver("Lord Buttleberry", "LordButtleberry stands at his Manor, clearly aggitated. He is pacing back and forth, his leather boots echoing across the manor grounds. His brow furrowed, he has the likeness of a boar. His ostentatious clothes billow wildly about him as he spins around. Finally, you both match stares, he approaches you.",
                    new Quest("Failing Fields", "\"Thank the spiritual entities that you are here adventurer! How do I know are one? Look at your garb! Enough idle talk. I am in the need of your assistance. It seems that the rivalry with Reedton has gone a too far this time! Some of our crops have gone bad and the farmers swear that the fields were poisoned. I need you to confront the Lord of Reedton, Alexander, about this and report to me the details. Hurry, go, Buttleberry will be most in your debt.\"", "Go to Grand Hall in Reedton Castle", 100, 25, 30, QuestType.GoTo, "Grand Hall", 1,
                        new Quest("Speaking of Farm Fields", "I confronted Lord Alexander Reedton about the poisoned farm fields in Buttleberry and Lord Buttleberry's concerns. His face nearly exploded as he exclaimed, \"You.. HE dares to accuse me! Just yesterday our farmers brought to me the same complaints! Do you challenge my authority!? Go, see for yourself.\"", "Go to Farm Fields in Reedton Grassland", 50, 20, 35, QuestType.GoTo, "Farm Fields")));

            var rg = context.locations.First(l => l.name.Equals("Reedton Grasslands"));
            if(rg.QuestGiver == null)
                rg.QuestGiver = new QuestGiver("Aggitated Farmer", "He looks... lost, as if he has no purpose left in life. His eyes look at you, but it is as if he does not see you.",
                    new Quest("Lost Souls", "The only thing I could hear from the farmer where the same words, over and over: \"They were here, but not, then the rest were not, gone, like ghosts, gone, gone... gone\". Eerie to say the least.", "Go to a haunted place and inspect it.", 100, 25, 35, QuestType.GoTo, "The Tall Tree", 1,
                        new Quest("Putting Souls to Rest", "It seems that the souls the farmer spoke of were here all along. They seem miserable, trapped. One, a small spectre, weeping sought you out and spoke to you, in the faintest of whispers. From the sillhouette, I could tell it was once a small child. She whispered to me, \"Release us... defeat the Vengeful Souls that... harm... pain\". After that she wept some more, her small shoulders rapidly rising and falling twice with each sob.", "Slay ten Vengeful Souls", 1250, 250, 3000, QuestType.Slay, "Vengeful Soul", 10)), new List<Quest>() { bm.QuestGiver.Quest.NextQuest });
               

            context.locations.AddOrUpdate(
                r => r.Id
                );

            context.markets.AddOrUpdate(
                r => r.Id
                );

            context.monsters.AddOrUpdate(
                r => r.Id
                );

            if (context.spells.Count() <= 0)
            {
                context.spells.AddRange(new[]
                {
                    new Spell("Spitball", "A small flame flicks out from my finger and it kind of hurts the monster. Not that impressive, but good for carnival tricks", 3, 1, 1, "Damage"),
                    new Spell("Ice Cube", "A small cube of ice. Looking at it though, you can't help but feel that it is angry... Perhaps throwing it at the enemy will do damage.", 4, 1, 2, "Damage"),
                    new Spell("Earthen Spike Wall", "The ground trembles and roars, splitting open beneath your foe. Large stalagmites erupt from the surface, piercing them.", 8, 4, 4, "Damage"),
                    new Spell("Torrentual Downpour", "Mother always said the rain wouldn't hurt you. WELL SHE WAS WRONG!", 13, 7, 5, "Damage"),
                    new Spell("Red Tide", "Like a screaming banshee, it tears out of the valley and strikes all who opposes it, covering them in hot sticky blood. The foe chokes from such a onslaught.", 18, 8, 6, "Damage"),
                    new Spell("Dove of Doom", "Summon a black dove to swoop and peck your opponent. It's pretty neat.", 20, 10, 8, "Damage"),
                    new Spell("Healing Touch", "My hand glows blue and I start to feel better when I touch myself.", 5, 1, 1, "Heal")
                });
            }

            var sp = context.spells.Distinct().ToList();
            foreach (var s in context.spells)
                context.spells.Remove(s);
            context.SaveChanges();
            var strarr = new string[]{ "Spitball", "Ice Cube", "Earhen Spike Wall", "Torrentual Downpour", "Red Tide", "Dove of Doom"};
            foreach (var x in sp.Where(y => strarr.Contains(y.name)))
                x.methodName = "Damage";
            context.spells.AddRange(sp);
            context.SaveChanges();
            
            if(context.spells.FirstOrDefault(ss => ss.name.Equals("Healing Touch")) == null)
                context.spells.Add(new Spell("Healing Touch", "My hand glows blue and I start to feel better when I touch myself.", 5, 1, 1, "Heal"));
            
            context.SaveChanges();

            foreach(Player p in context.players)
            {
                if (p.quests == null)
                    p.quests = new PlayerQuests();

                if (p.spells.Count == 0)
                {
                    foreach (var spell in context.spells.Where(spp => spp.minLevel <= p.attributes.level))
                        p.spells.Add(spell);
                }
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
