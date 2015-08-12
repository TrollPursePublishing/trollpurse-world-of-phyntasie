
--Types -> 0: kill, 1: collect, 2: goto

--Add the new quest path
INSERT INTO [dbo].[Quests] (Id, Title, Description, Instructions, Gold, Score, Experience, CountNeeded, Type, NameOfObject, NextQuest_Id) VALUES 
 (NEWID(), 'Just Rewards', 'After a long journey and some frightful combat, well... I DESERVE THIS! Time to go back and get what I came for.', 'Travel to Cave Entrance', 10000, 100, 1000, 1, 2, 'Cave Entrance', null),
 (NEWID(), 'The Guardians', 'Within the caves I find a chest. Finally! But there is something inscribed on it. Prove your worthiness, slay those who would do harm to others, and my treasures will be yours. It seems I have one more job to do.', 'Slay ten Bandits.', 300, 10, 500, 10, 0, 'Bandit', (select Id from [dbo].[Quests] q where q.Title = 'Just Rewards')),
 (NEWID(), 'Hills of Gold', 'I have finally reached the foothills but there is no sign of what gave off that sheen of light. But lo! In one of the caves I can see a chest full of gold!', 'Travel to the Cave Entrance.', 0, 10, 200, 1, 2, 'Cave Entrance', (select Id from [dbo].[Quests] q where q.Title = 'The Guardians')),
 (NEWID(), 'Scorched Pride', 'After my treck through the wastes, I have reached the Oasis. However, I cannot see much water here, just a muddy puddle and the hull of a row boat, burned out. How could that have gotten here? As I look inside I see that there is some gold, might as well as make it worth it. Wait... to the west I see a glint of something... like glass or metal.', 'Travel to The Foothills.', 0, 20, 250, 1, 2, 'The Foothills', (select Id from [dbo].[Quests] q where q.Title = 'Hills of Gold')),
 (NEWID(), 'The Long Journey', 'I have reached the Vast Desert, and its name does not deceive. It seems that there is nothing here. Have I been sent on a fruitless journey by this ancient map? However, as I look at the map I see that there is a small X far to the north. I think pursuing this at this point is in my best interest.', 'Travel to The Oasis.', 10, 20, 200, 1, 2, 'The Oasis', (select Id from [dbo].[Quests] q where q.Title = 'Scorched Pride')),
 (NEWID(), 'Where There Lie None', 'From the legends of old, this land is filled with ancient ruins that contain vast amounts of treasure. It seems from this map that there is a location that contains some undiscovered treasure. Also, there are brief mentions of some kind of staff. I can only assume it is important due to that the time was taken to write about it.', 'Travel to the Vast Desert.', 0, 10, 300, 1, 2, 'Vast Desert', (select Id from [dbo].[Quests] q where q.Title = 'The Long Journey'));

INSERT INTO [dbo].[QuestGivers] (Id, Name, Description, Quest_Id) VALUES (NEWID(), 'Strange Traveller', 'As I enter the location a strange gentleman walks up to me, nudges my shoulder, and continues walking. I think he might have dropped something in my pack.', (select Id from [dbo].[Quests] q where q.Title = 'Where There Lie None'));
 
UPDATE [dbo].[Locations] SET QuestGiver_Id = (SELECT Id FROM [dbo].[QuestGivers] qg WHERE qg.Name = 'Strange Traveller') WHERE name='Reedton Market' AND QuestGiver_Id IS NULL;
--Add the new location, areas and rooms
INSERT INTO [dbo].[Areas] (Id, name, description, World_Id) VALUES (NEWID(), 'Vast Desert', 'Large and brown, not much else to say', (SELECT Id FROM [dbo].[Worlds] w WHERE w.Name = 'Phynomen'));

--Monster type here -> 0: monster, 1: human, 2: animal
INSERT INTO [dbo].[Locations] (Id, name, description, isExit, hasMarket, monsterTypeHere, QuestGiver_Id, Area_Id) VALUES 
 (NEWID(), 'Lonely Oasis', 'This seems to be the only place of refuge in this harsh area.', 'true', 'false', 1, null, (SELECT Id FROM [dbo].[Areas] a WHERE a.name = 'Vast Desert')),
 (NEWID(), 'Lonely Desert Path', 'It seems that the only safe way to get anywhere is to take this path', 'false', 'false', 1, null, (SELECT Id FROM [dbo].[Areas] a WHERE a.name = 'Vast Desert'));
 
INSERT INTO [dbo].[Rooms] (Id, name, description, isExit, chanceForRelic, Location_Id) VALUES
 (NEWID(), 'Scorched Pride', 'It looks like the only distinguishing land mark is a burnt out ship hull. It seems that the name started with P and R.', 'false', 10, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path')),
 (NEWID(), 'The Foothills','Settled beneath the shadow of the Long Range, these foothills have been fabled to contain greate treasure, I think I will explore some more to prove this.', 'false', 12, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path')),
 (NEWID(), 'Path Crossroads', 'It seems that the desert gives me two options, North or West. Why did I bother coming here again?', 'true', 2, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path')),
 (NEWID(), 'Northern Path', 'A long path, that heads - well - North.', 'false', 1, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path')),
 (NEWID(), 'Western Path', 'A long path that ever heads to the West. It seems to never end and when I look back, it seems I have never started.', 'false', 1, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path')),
 (NEWID(), 'North-Western Path', 'A path that heads in only one direction - deeper into the desert.', 'false', 1, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path')),
 (NEWID(), 'Faded Desert Path', 'Sand has long claimed this trail and to continue on would be dangerious to my health.', 'false', 1, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path')),
 (NEWID(), 'Ruined Desert Path', 'Now I am suspicious, this trail looks destroyed, not decayed, not eroded, destroyed. What could have done this?', 'false', 1, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path')),
 (NEWID(), 'Cave Entrance', 'A small cut out of the cave in the Foothills. Something feels strange to me here, as if something has tried to hide or remains hidden.', 'false', 15, (SELECT Id FROM [dbo].[Locations] l WHERE l.name = 'Lonely Desert Path'));
 
INSERT INTO [dbo].[RoomRooms] (Room_Id, Room_Id1) VALUES
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Path Crossroads'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Northern Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Path Crossroads'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Western Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Northern Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'North-Western Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'North-Western Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Faded Desert Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Faded Desert Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Ruined Desert Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Ruined Desert Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Scorched Pride')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Ruined Desert Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'The Foothills')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'The Foothills'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Cave Entrance')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Northern Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Path Crossroads')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Western Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Path Crossroads')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'North-Western Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Northern Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Faded Desert Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'North-Western Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Ruined Desert Path'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Faded Desert Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Scorched Pride'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Ruined Desert Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'The Foothills'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Ruined Desert Path')),
 ((SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'Cave Entrance'),(SELECT Id FROM [dbo].[Rooms] r WHERE r.name = 'The Foothills'));
 
--Add the new bandit
--Bandit attributes
INSERT INTO [dbo].[PlayerAttributes] (Id, strength, mana, stanima, toughness, health, experience, level, currentStrength, currentMana, currentStanima, currentToughness, currentHealth, state, leveledUp) VALUES 
 (NEWID(), 12, 10, 10, 4, 20, 0, 1, 12, 10, 10, 4, 20, 0, 0)

--Bandit monster
INSERT INTO [dbo].[Monsters] (Id, name, description, type, attribute_Id) VALUES (NEWID(), 'Bandit', 'Gruff, and holding a large billy club, he charges after me. We shall see who is tougher!', 1, 
(
 SELECT Id FROM [dbo].[PlayerAttributes]
 WHERE strength = 12 AND mana = 10 AND stanima = 10 AND toughness = 4 AND health = 20
)
);

--Tell the players the great news
INSERT INTO Events (Id, title, description, "when") VALUES (NEWID(), 'New Adventures!', 'We are glad to announce that a new area, Vast Desert, has been added. We also added a new quest line for it, can you discover the treasure that awaits?', GETUTCDATE());