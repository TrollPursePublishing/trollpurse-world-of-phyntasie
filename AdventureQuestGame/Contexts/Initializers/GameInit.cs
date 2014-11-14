using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Contexts.Initializers
{
    public sealed class GameInit : CreateDatabaseIfNotExists<GameContext>
    {
        private PlayerAttributes PlayerAttributesWithLevel(int strength, int toughness, int health)
        {
            return new PlayerAttributes(strength, toughness, health, ((strength + toughness + (health / 2)) / 10 ) + 1);
        }

        private Weapon WeaponWithCost(string name, string description, int damage, int criticalDamage, int durability, int stanimaCost)
        {
            return new Weapon(name, description, damage, criticalDamage, durability, stanimaCost, (damage * 10) + (int)(criticalDamage / 1.5) - stanimaCost + (durability * 2));
        }

        private Potion PotionWithCost(string name, string description, int healingValue, int poisonValue, int stanimaRestoreValue, int manaRestoreValue, int effectTurns = 0)
        {
            return new Potion(name, description, healingValue, poisonValue, stanimaRestoreValue, manaRestoreValue, ((healingValue + stanimaRestoreValue + manaRestoreValue) / 2 + (int)(poisonValue * 1.5)) * (effectTurns > 0 ? effectTurns : 1), effectTurns);
        }

        private Armor ArmorWithCost(string name, ArmorType type, int armorRating, int durability, string description)
        {
            return new Armor(name, type, armorRating, durability, (int)((((armorRating + 1) / 2) + durability) * 1.5), description);
        }

        protected override void Seed(GameContext context)
        {
            PlayerAttributes[] attributes =
            {
                PlayerAttributesWithLevel(1, 0, 12),//Imp
                PlayerAttributesWithLevel(20, 24, 100),//Golem
                PlayerAttributesWithLevel(1, 0, 1), //Tiny Mouse
                PlayerAttributesWithLevel(3, 0, 20), //Skeleton Ghost
                PlayerAttributesWithLevel(5, 5, 5), //Goblin
                PlayerAttributesWithLevel(1, 1, 10),//Enraged Geezer
                PlayerAttributesWithLevel(100, 50, 2100), //Dragon
                PlayerAttributesWithLevel(20, 10, 35), //Medusa
                PlayerAttributesWithLevel(12, 2, 30), //Unicorn
                PlayerAttributesWithLevel(30, 30, 35), //Orc
                PlayerAttributesWithLevel(100, 1, 1), //Vengeful Soul
                PlayerAttributesWithLevel(35, 5, 32), //Giant Rat
                PlayerAttributesWithLevel(5, 100, 10), //Giant Centipede
                PlayerAttributesWithLevel(102, 51, 2200), //Elder Dragon
                PlayerAttributesWithLevel(10, 2, 12), //Guard
            };

            Potion[] potions =
            {
                PotionWithCost("Red Bottle of Healing", "The liquid inside is red, so it must heal me!", 5, 0, 0, 0),
                PotionWithCost("Blue Bottle of Mana", "This one is blue!", 0, 0, 0, 5),
                PotionWithCost("The Magical Remedy of Liquid Courage", "A potion with a potent smell; however, I feel invigorated when I drink it!", 0, 0, 10, 0),
                PotionWithCost("Bubbling Orange Potion", "I think I will throw this one at my enemies... I don't think it is safe.", 0, 5, 0, 0)
            };

            Relic[] relics =
            {
                new Relic("Golden Statue", "Rather boring golden statue. It has some neat carvings on it, hopefully not curses.", 10),
                new Relic("Jade Elephant", "Still, green, and not as large as the real thing. This extinct animal is portrayed perfectly... I think. A trunk, three legs, and one eye, must have been a frightening creation!", 20),
                new Relic("Basket of Rock", "Worth more than you think!", 30),
                new Relic("Nude Statue and Statuette", "Some people might be interested in this for thier own pleasure. However, I just might keep it for myself.", 45),
                new Relic("Chest full of silver", "Now that's what I'm talkin' about!", 200)
            };

            Room[] rooms =
            {
                new Room("Entrance", "A dank, smelly, cold room filled with other rooms", true),
                new Room("Torture Chamber", "A part of this room elicits excitement! Another part dread. I am so confused.", false),
                new Room("Sewer Entrance", "A hole in the ground covered by a large copper plate. Easily set aside. Down I go!", true),
                new Room("Sewer Hallway", "A long, dank, smelly, place. What could possibly be here?", false),
                new Room("Sewer Cavern", "Chunks of the sewer has fallen away and something has burrowed in. Dare I see who is home?", false),
                new Room("Sewer Crossroads", "Many other sewer hallways connect here, making for one large cesspool. Blech! What drove me here?", false),
                new Room("Castle Entrance", "Majestic gates stand before you and wary guards eye you, best stow the weapons... for now.", true),
                new Room("Grand Hall", "Large, ornate, and full of loot. Best get started.", false),
                new Room("Farm Fields", "The wind lazily pushes the large strands of wheat around. They sway, as if drunk on the sunlight. The only thing menacing about these fields is what they can potentially hide.", true),
                new Room("Burned Home", "This building used to house a family. Now, telling by the socerous scorch marks and bones, it houses the souls of the deceased.", false),
                new Room("Overlook Hill", "Looming in the distance the opposite of the island, one can see Reedton. So interesting, a bustling city, diminished to such a puny size by something as simple as distance. One thing to note though is that this hill does not look natural.", false)
            };

            Spell[] spells =
            {
                new Spell("Spitball", "A small flame flicks out from my finger and it kind of hurts the monster. Not that impressive, but good for carnival tricks", 3, 1, 1),
                new Spell("Ice Cube", "A small cube of ice. Looking at it though, you can't help but feel that it is angry... Perhaps throwing it at the enemy will do damage.", 4, 1, 2),
                new Spell("Earthen Spike Wall", "The ground trembles and roars, splitting open beneath your foe. Large stalagmites erupt from the surface, piercing them.", 8, 4, 4),
                new Spell("Torrentual Downpour", "Mother always said the rain wouldn't hurt you. WELL SHE WAS WRONG!", 13, 7, 5),
                new Spell("Red Tide", "Like a screaming banshee, it tears out of the valley and strikes all who opposes it, covering them in hot sticky blood. The foe chokes from such a onslaught.", 18, 8, 6),
                new Spell("Dove of Doom", "Summon a black dove to swoop and peck your opponent. It's pretty neat.", 20, 10, 8)
            };

            Title[] titles =
            {
                new Title("Peon", "I don't get out much", Gender.Male, 1),
                new Title("Peonette", "I don't get out much", Gender.Female, 1),
                new Title("Soldier", "Adventuring has become a way of life.", Gender.Male, 3),
                new Title("Battle-Maid", "Adventuring has become a way of life.", Gender.Female, 3),
                new Title("Adventurer", "I have gone out and done a few things, slain plenty of monsters, and taken on challenges that most have not dared dreamed of. I am not a full blown adventurer and seek to continue that streak.", Gender.Male, 10),
                new Title("Adventurer", "I have gone out and done a few things, slain plenty of monsters, and taken on challenges that most have not dared dreamed of. I am not a full blown adventurer and seek to continue that streak.", Gender.Female, 10)
            };

            Weapon[] weapons =
            {
                WeaponWithCost("Butcher Knife", "Well, it's large and sharp, so it must do something painful!", 2, 3, 5, 0),
                WeaponWithCost("Gladius", "Short enough for stabbing and wide enough for slicing, this will make a great kitchen utensil, erm, weapon!", 25, 7, 30, 3),
                WeaponWithCost("Throwing Spear", "A large wooden pole with a pointy end. I could have done that, but this one is balanced *just* right.", 10, 25, 1, 1)
            };

            Location[] locations = 
            {
                new Location("Nowhere, The Void", "The place beyond the concious physical realm, where all are born but none remain."){isExit=true},
                new Location("Buttleberry, The Marble Manor", "Within Buttleberry is a large manor. Its walls are carved from a solid mammoth cut of marble. How such was acheived is only known by the original owners, long passed away. Although impressive, the building resembles a block with holes cut into it for windows and doors. Guards partrol the area, looking for nefarious individuals."),
                new Location("Grove of the Elder", "These woods contain many mysteries. This is one of them. It is said that child sacrifice and the birth of demons took place here. The rituals too unspeakable to speak anymore of. It looks peacefull now, with the exception of the blood stained stone table resting in the middle of the grove. It speaks to you, calling your name."){isExit=true},
                new Location("The Tall Tree", "Of all the trees in this forest, this particular specimen seems to know the most. Its presence unsettles you. Sweat begins dripping down your eye, stinging. However, you can't help but feel that it is this wooden creature before you, crying through your soul."),
                new Location("Buttleberry Square", "Vibrant colors, and boisterous sounds make this town a living entity within a dreary world. The market has several shops that interest you."){hasMarket=true},
                new Location("The Widower Colossus", "Being the only sentitent being left in these wastes, you cannot help but feel a sense of lonliness emanate from the statue. It looks across the desert, peering, waiting for it's lover's return."){isExit=true},
                new Location("Buttleberry Gates", "Two large stone griffins peer into your eyes as you approach the iron-wrought gates of Buttleberry. They promise swift vengeance to evil-doers."){isExit=true},
                new Location("Buttleberry Dungeon", "Well, it looks frightening enough."){rooms=new List<Room>(new[]{rooms[0], rooms[1]})},
                new Location("Reedton Market", "A bustling venue filled with various shops and treats. To the left are some amazing artists of puppetry and to the right more sweet shops. Children run up to you in awe, while mothers wink from a distance."){hasMarket=true},
                new Location("Reedton Castle", "Large a forboding, this castle overlooks the town square and surrounding ocean. Flags fly in the wind, indicating that the Lord and Lady are home. Perhaps paying them a visit will prove... fruitful"){rooms=new List<Room>(new[]{rooms[6], rooms[7]})},
                new Location("Reedton Grasslands", "Being on an island, but space had to be conserved for farms. However, creatures of the night have claimed what farmers have not. Who knows what treasures await here."){rooms=new List<Room>(new[]{rooms[8], rooms[9], rooms[10]})},
                new Location("Reedton Wharf", "The only way on or off this island legally. It controls the imports and exports of this island. It is said that one man owns it all, and thus owns the island."){isExit=true},
                new Location("Reedton Sewers", "All the waste, and who knows what else, runs into these large caverns and into the ocean from the other side of the island. An engineering miracle."){rooms=new List<Room>(rooms.Where(r => r.name.StartsWith("Sewer")).ToArray())}
            };

            Area[] areas =
            {
                new Area("The Barren Wastes", "The moans of the dead ride the howling wind in this arid plane. Naught but your soul and those of the perished remain here. For miles, nothing can be seen."){locations=new List<Location>(new[]{locations[5]})},
                new Area("Buttleberry", "Cheerfully, the vibrant roofs of this town reach for the heavens in jubilee. The town charms you, reminding you that there is joy and happiness left in this world. There are many homes and a humble market. Atop a hill sits the governor's estate, encased in marble."){locations=new List<Location>(locations.Where(l => l.name.StartsWith("Buttleberry")).ToArray())},
                new Area("Haunted Forest", "As always, this forest is haunted, filled with the nightmares born of the surrounding villagers suuperstitions and fears. It looms ahead, gaping, a maw ready to devour your soul. Have any ever made it through alive? Have any ever even attempted such a trail? Why not take the path?"){locations=new List<Location>(new[]{locations[2], locations[3]})},
                new Area("Reedton", "A small town precariously nestled above the cliffs of a small island. It looks fragile, as if the first gust will take it - and it's inhabitants - into the deep blue. There seems to be more here and they share a friendly rivalry with Buttleberry."){locations=new List<Location>(locations.Where(l => l.name.StartsWith("Reedton")).ToArray())}
            };

            World[] worlds =
            {
                new World("Phynomen", "The world you love and cherish"){areas=new List<Area>(areas)}
            };

            Armor[] armors =
            {
                ArmorWithCost("Hide Cuirass", ArmorType.Torso, 5, 10,"Simple Hide armor made from buck-skin"),
                ArmorWithCost("Hide Shield", ArmorType.Arm, 2, 10, "Round and somewhat stiff... could do the trick"),
                ArmorWithCost("Hide Leggings", ArmorType.Legs, 2, 10, "How many more cows must perish for this outfit to match!?"),
                ArmorWithCost("Coif", ArmorType.Head, 1, 5, "Brown, Boring, and a fashion wreck. It looks like a cap with a bad hair-day."),
                ArmorWithCost("Muddy Boots", ArmorType.Feet, 1, 20, "Put them through the wash and they will be grand!"),
                ArmorWithCost("Chainmail Hauberk", ArmorType.Torso, 10, 15, "Long and noisy. It also chaffes."),
                ArmorWithCost("Plated Boots", ArmorType.Feet, 3, 25, "Hard and heavy, these boots can take a licking."),
                ArmorWithCost("Round Studded Shield", ArmorType.Arm, 5, 25, "Made with wooden planks and iron studs, it definitely does a better job than the one made from cow skin."),
                ArmorWithCost("Plated Leggings", ArmorType.Legs, 8, 20, "Great... more chaffing. Better be worth it."),
                ArmorWithCost("Spangenhelm", ArmorType.Head, 3, 10, "Looks hard enough to protect my nogan.")
            };

            Event[] events =
            {
                new Event("Game Launched", "AdventureQuestGame has been launched and seeded. A fresh world to explore, enjoy, and loot!")
            };

            //Only add Market Inventories here (must copy items)
            Inventory[] inventories =
            {
                new Inventory()
                {
                    armors= new List<Armor>(new[]
                    {
                        armors[0].Copy(),
                        armors[1].Copy()
                    }),
                    potions=new List<Potion>(new[]
                    {
                        potions[0].Copy(),
                        potions[1].Copy(),
                        potions[2].Copy()
                    }),
                    weapons=new List<Weapon>(new[]
                    {
                        weapons[0].Copy(),
                        weapons[2].Copy()
                    })
                },

                new Inventory()
                {
                    armors = new List<Armor>(new[]
                    {
                        armors[0].Copy(),
                        armors[2].Copy(),
                        armors[3].Copy(),
                        armors[4].Copy(),
                        armors[5].Copy(),
                        armors[6].Copy(),
                        armors[7].Copy(),
                        armors[8].Copy(),
                        armors[9].Copy()
                    }),
                    weapons=new List<Weapon>(new[]
                    {
                        weapons[1].Copy(),
                        weapons[2].Copy()
                    }),
                    potions=new List<Potion>(new[]
                    {
                        potions[3].Copy()
                    })
                }
            };

            Market[] markets = 
            {
                new Market(inventories[0], locations.First(l => l.name.Equals("Buttleberry Square"))),
                new Market(inventories[1], locations.First(l => l.name.Equals("Reedton Market")))
            };

            Monster[] monsters =
            {
                new Monster("Imp", "A mighty creature in its own right, it can nibble your bum. Small creature, barely a meter tall with a larger wingspan. Its limbs hang limp and spindly from its body. Horns curve out the top of it's head. It smile's, teeth sharp, menacing.", attributes[0], MonsterType.Monster),
                new Monster("Golem", "Its a mountian, its a rock, no, wait... Its coming right at me! In all seriousness though, this creature looks like a rather muscular human. The main difference is that where joints and limbs should be are boulders.", attributes[1], MonsterType.Monster),
                new Monster("Tiny Mouse", "*ROAR!!!!*", attributes[2], MonsterType.Creature),
                new Monster("Skeleton Ghost", "Spooky, Scary, Skeleton Ghost, out to haunt you.", attributes[3], MonsterType.Monster),
                new Monster("Goblin", "Like a child with green skin... and just as annoying!", attributes[4], MonsterType.Monster),
                new Monster("Engraged Geezer", "'Get off my LAWN and off my PROPERTY!'", attributes[5], MonsterType.Person),
                new Monster("Dragon", "Unfortunately, I must tell you that you will die. Its just plain HUGE. The wings darken the ground for miles and the scales blind you. Nothing you can say or do will assist you.", attributes[6], MonsterType.Monster),
                new Monster("Medusa", "She is just abosolutely gorgeous. Except that she has the lower body of a snake. But I can dig that. Her hair freaks me out a bit, all writhing in slithering silliness. She stares at you and you can't help but feel... immobilized.", attributes[7], MonsterType.Monster),
                new Monster("Unicorn", "Not the little pony you have expected. After being hunted for years, the dark mane on this creature glistens with blood. A sheen covers its horn as it is lowered and begins to charge you.", attributes[8], MonsterType.Monster),
                new Monster("Orc", "The purple skin of this three meter tall creature ripples from the muscle and sinew beneath. Perhaps it was a bad idea to explore at this time. Or perhaps it will be a grand duel. You both grin at each other for the coming blood-letting, mutual agreement of combat.", attributes[9], MonsterType.Monster),
                new Monster("Vengeful Soul", "Not sure how this happened, but the power from this creature is overwhelming. I best dispatch this soul with swiftness!", attributes[10], MonsterType.Monster),
                new Monster("Giant Rat", "Alas, old foe, we meet again. I have been expecting you... You words seem to fall short on this gray dim-wit. What a waste of time. Why is he always so big too?", attributes[11], MonsterType.Creature),
                new Monster("Giant Centipede", "I hope my strength and blade are enough to pierce the armor of this monstrosity. It crawls towards you, hundreds of feet moving in unison - ECK!", attributes[12], MonsterType.Creature),
                new Monster("Elder Dragon", "Large, angry, and full of muscle. He, or she, is a sight to behold. Stronger than most dragons of it's Warren, it commands dominance from every creature it sees. You will assert yours, or die trying.", attributes[13], MonsterType.Monster),
                new Monster("Guard", "This guard feels you have done something wrong. He approaches you with a maniacal grin, raising his halbred - he swings. Looks like there is only one way out of this one.", attributes[14], MonsterType.Person)
            };

            context.areas.AddRange(areas);
            context.armors.AddRange(armors);
            context.locations.AddRange(locations);
            context.markets.AddRange(markets);
            context.monsters.AddRange(monsters);
            context.potions.AddRange(potions);
            context.relics.AddRange(relics);
            context.rooms.AddRange(rooms);
            context.spells.AddRange(spells);
            context.titles.AddRange(titles);
            context.weapons.AddRange(weapons);
            context.worlds.AddRange(worlds);
            context.events.AddRange(events);
            context.SaveChanges();

            //Room associations
            //Buttleberry Dungeon
            context.rooms.First(r => r.name.Equals("Entrance")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Torture Chamber")));
            context.rooms.First(r => r.name.Equals("Torture Chamber")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Entrance")));

            //Reedton Castle
            context.rooms.First(r => r.name.Equals("Castle Entrance")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Grand Hall")));
            context.rooms.First(r => r.name.Equals("Grand Hall")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Castle Entrance")));

            //Reedton Sewers
            context.rooms.First(r => r.name.Equals("Sewer Entrance")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Sewer Hallway")));
            context.rooms.First(r => r.name.Equals("Sewer Hallway")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Sewer Entrance")));
            context.rooms.First(r => r.name.Equals("Sewer Hallway")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Sewer Crossroads")));
            context.rooms.First(r => r.name.Equals("Sewer Crossroads")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Sewer Hallway")));
            context.rooms.First(r => r.name.Equals("Sewer Crossroads")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Sewer Cavern")));
            context.rooms.First(r => r.name.Equals("Sewer Cavern")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Sewer Crossroads")));

            //Reedton Grasslands
            context.rooms.First(r => r.name.Equals("Farm Fields")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Overlook Hill")));
            context.rooms.First(r => r.name.Equals("Farm Fields")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Burned Home")));
            context.rooms.First(r => r.name.Equals("Burned Home")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Farm Fields")));
            context.rooms.First(r => r.name.Equals("Overlook Hill")).linkedRoom.Add(context.rooms.First(r => r.name.Equals("Farm Fields")));

            context.SaveChanges();
        }
    }
}