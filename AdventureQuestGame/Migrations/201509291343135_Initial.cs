namespace AdventureQuestGame.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Acheivements",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        time = c.DateTime(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        player_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Players", t => t.player_Id, cascadeDelete: true)
                .Index(t => t.player_Id);
            
            CreateTable(
                "dbo.Players",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        gender = c.Int(nullable: false),
                        isInCombat = c.Boolean(nullable: false),
                        isInside = c.Boolean(nullable: false),
                        expireRoom = c.Boolean(nullable: false),
                        attributes_Id = c.Guid(),
                        engaging_Id = c.Guid(),
                        equipment_Id = c.Guid(),
                        inventory_Id = c.Guid(),
                        navigation_Id = c.Guid(),
                        quests_Id = c.Guid(),
                        stats_Id = c.Guid(),
                        title_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.PlayerAttributes", t => t.attributes_Id)
                .ForeignKey("dbo.Monsters", t => t.engaging_Id)
                .ForeignKey("dbo.Equipments", t => t.equipment_Id)
                .ForeignKey("dbo.Inventories", t => t.inventory_Id)
                .ForeignKey("dbo.Navigations", t => t.navigation_Id)
                .ForeignKey("dbo.PlayerQuests", t => t.quests_Id)
                .ForeignKey("dbo.PlayerStats", t => t.stats_Id)
                .ForeignKey("dbo.Titles", t => t.title_Id)
                .Index(t => t.attributes_Id)
                .Index(t => t.engaging_Id)
                .Index(t => t.equipment_Id)
                .Index(t => t.inventory_Id)
                .Index(t => t.navigation_Id)
                .Index(t => t.quests_Id)
                .Index(t => t.stats_Id)
                .Index(t => t.title_Id);
            
            CreateTable(
                "dbo.PlayerAttributes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        strength = c.Int(nullable: false),
                        mana = c.Int(nullable: false),
                        stanima = c.Int(nullable: false),
                        toughness = c.Int(nullable: false),
                        health = c.Int(nullable: false),
                        experience = c.Int(nullable: false),
                        level = c.Int(nullable: false),
                        currentStrength = c.Int(nullable: false),
                        currentMana = c.Int(nullable: false),
                        currentStanima = c.Int(nullable: false),
                        currentToughness = c.Int(nullable: false),
                        currentHealth = c.Int(nullable: false),
                        state = c.Int(nullable: false),
                        leveledUp = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Monsters",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        type = c.Int(nullable: false),
                        attribute_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.PlayerAttributes", t => t.attribute_Id)
                .Index(t => t.attribute_Id);
            
            CreateTable(
                "dbo.Equipments",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        arm_Id = c.Guid(),
                        feet_Id = c.Guid(),
                        head_Id = c.Guid(),
                        legs_Id = c.Guid(),
                        torso_Id = c.Guid(),
                        weapon_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Armors", t => t.arm_Id)
                .ForeignKey("dbo.Armors", t => t.feet_Id)
                .ForeignKey("dbo.Armors", t => t.head_Id)
                .ForeignKey("dbo.Armors", t => t.legs_Id)
                .ForeignKey("dbo.Armors", t => t.torso_Id)
                .ForeignKey("dbo.Weapons", t => t.weapon_Id)
                .Index(t => t.arm_Id)
                .Index(t => t.feet_Id)
                .Index(t => t.head_Id)
                .Index(t => t.legs_Id)
                .Index(t => t.torso_Id)
                .Index(t => t.weapon_Id);
            
            CreateTable(
                "dbo.Armors",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        type = c.Int(nullable: false),
                        armorRating = c.Int(nullable: false),
                        durability = c.Int(nullable: false),
                        value = c.Int(nullable: false),
                        description = c.String(),
                        Inventory_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.Inventory_Id)
                .Index(t => t.Inventory_Id);
            
            CreateTable(
                "dbo.Weapons",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        damage = c.Int(nullable: false),
                        criticalDamage = c.Int(nullable: false),
                        durability = c.Int(nullable: false),
                        stanimaCost = c.Int(nullable: false),
                        value = c.Int(nullable: false),
                        description = c.String(),
                        Inventory_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.Inventory_Id)
                .Index(t => t.Inventory_Id);
            
            CreateTable(
                "dbo.Inventories",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        gold = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Potions",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        healingValue = c.Int(nullable: false),
                        poisonValue = c.Int(nullable: false),
                        stanimaRestoreValue = c.Int(nullable: false),
                        manaRestoreValue = c.Int(nullable: false),
                        effectTurns = c.Int(nullable: false),
                        value = c.Int(nullable: false),
                        description = c.String(),
                        Inventory_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.Inventory_Id)
                .Index(t => t.Inventory_Id);
            
            CreateTable(
                "dbo.Relics",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        value = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Navigations",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        isInRoom = c.Boolean(nullable: false),
                        currentArea_Id = c.Guid(),
                        currentLocation_Id = c.Guid(),
                        currentRoom_Id = c.Guid(),
                        currentWorld_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Areas", t => t.currentArea_Id)
                .ForeignKey("dbo.Locations", t => t.currentLocation_Id)
                .ForeignKey("dbo.Rooms", t => t.currentRoom_Id)
                .ForeignKey("dbo.Worlds", t => t.currentWorld_Id)
                .Index(t => t.currentArea_Id)
                .Index(t => t.currentLocation_Id)
                .Index(t => t.currentRoom_Id)
                .Index(t => t.currentWorld_Id);
            
            CreateTable(
                "dbo.Areas",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        imagepath = c.String(),
                        World_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Worlds", t => t.World_Id)
                .Index(t => t.World_Id);
            
            CreateTable(
                "dbo.Locations",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        isExit = c.Boolean(nullable: false),
                        hasMarket = c.Boolean(nullable: false),
                        monsterTypeHere = c.Int(nullable: false),
                        QuestGiver_Id = c.Guid(),
                        Area_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.QuestGivers", t => t.QuestGiver_Id)
                .ForeignKey("dbo.Areas", t => t.Area_Id)
                .Index(t => t.QuestGiver_Id)
                .Index(t => t.Area_Id);
            
            CreateTable(
                "dbo.QuestGivers",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        Quest_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Quests", t => t.Quest_Id)
                .Index(t => t.Quest_Id);
            
            CreateTable(
                "dbo.Quests",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(),
                        Description = c.String(),
                        Instructions = c.String(),
                        Gold = c.Int(nullable: false),
                        Score = c.Int(nullable: false),
                        Experience = c.Int(nullable: false),
                        CountNeeded = c.Int(nullable: false),
                        Type = c.Int(nullable: false),
                        NameOfObject = c.String(),
                        NextQuest_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Quests", t => t.NextQuest_Id)
                .Index(t => t.NextQuest_Id);
            
            CreateTable(
                "dbo.Rooms",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        isExit = c.Boolean(nullable: false),
                        chanceForRelic = c.Int(nullable: false),
                        Location_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Locations", t => t.Location_Id)
                .Index(t => t.Location_Id);
            
            CreateTable(
                "dbo.Worlds",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PlayerQuests",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PlayerQuestQuests",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Count = c.Int(nullable: false),
                        Complete = c.Boolean(nullable: false),
                        Quest_Id = c.Guid(),
                        PlayerQuests_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Quests", t => t.Quest_Id)
                .ForeignKey("dbo.PlayerQuests", t => t.PlayerQuests_Id)
                .Index(t => t.Quest_Id)
                .Index(t => t.PlayerQuests_Id);
            
            CreateTable(
                "dbo.Spells",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        damage = c.Int(nullable: false),
                        manaCost = c.Int(nullable: false),
                        minLevel = c.Int(nullable: false),
                        methodName = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PlayerStats",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        joinDate = c.DateTime(nullable: false),
                        areasDiscovered = c.Int(nullable: false),
                        monstersKilled = c.Int(nullable: false),
                        score = c.Int(nullable: false),
                        playerImageUrl = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PlayerVisits",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        placesVisitedId = c.Guid(nullable: false),
                        PlayerStats_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.PlayerStats", t => t.PlayerStats_Id)
                .Index(t => t.PlayerStats_Id);
            
            CreateTable(
                "dbo.Titles",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        description = c.String(),
                        genderRelation = c.Int(nullable: false),
                        levelToAcheive = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Events",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        title = c.String(),
                        description = c.String(),
                        when = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Markets",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        inventory_Id = c.Guid(nullable: false),
                        locationIAmIn_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.inventory_Id, cascadeDelete: true)
                .ForeignKey("dbo.Locations", t => t.locationIAmIn_Id)
                .Index(t => t.inventory_Id)
                .Index(t => t.locationIAmIn_Id);
            
            CreateTable(
                "dbo.InventoryRelics",
                c => new
                    {
                        Inventory_Id = c.Guid(nullable: false),
                        Relic_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Inventory_Id, t.Relic_Id })
                .ForeignKey("dbo.Inventories", t => t.Inventory_Id, cascadeDelete: true)
                .ForeignKey("dbo.Relics", t => t.Relic_Id, cascadeDelete: true)
                .Index(t => t.Inventory_Id)
                .Index(t => t.Relic_Id);
            
            CreateTable(
                "dbo.QuestGiverQuests",
                c => new
                    {
                        QuestGiver_Id = c.Guid(nullable: false),
                        Quest_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.QuestGiver_Id, t.Quest_Id })
                .ForeignKey("dbo.QuestGivers", t => t.QuestGiver_Id, cascadeDelete: true)
                .ForeignKey("dbo.Quests", t => t.Quest_Id, cascadeDelete: true)
                .Index(t => t.QuestGiver_Id)
                .Index(t => t.Quest_Id);
            
            CreateTable(
                "dbo.RoomRooms",
                c => new
                    {
                        Room_Id = c.Guid(nullable: false),
                        Room_Id1 = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Room_Id, t.Room_Id1 })
                .ForeignKey("dbo.Rooms", t => t.Room_Id)
                .ForeignKey("dbo.Rooms", t => t.Room_Id1)
                .Index(t => t.Room_Id)
                .Index(t => t.Room_Id1);
            
            CreateTable(
                "dbo.PlayerSpells",
                c => new
                    {
                        Player_Id = c.Guid(nullable: false),
                        Spell_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Player_Id, t.Spell_Id })
                .ForeignKey("dbo.Players", t => t.Player_Id, cascadeDelete: true)
                .ForeignKey("dbo.Spells", t => t.Spell_Id, cascadeDelete: true)
                .Index(t => t.Player_Id)
                .Index(t => t.Spell_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Markets", "locationIAmIn_Id", "dbo.Locations");
            DropForeignKey("dbo.Markets", "inventory_Id", "dbo.Inventories");
            DropForeignKey("dbo.Acheivements", "player_Id", "dbo.Players");
            DropForeignKey("dbo.Players", "title_Id", "dbo.Titles");
            DropForeignKey("dbo.Players", "stats_Id", "dbo.PlayerStats");
            DropForeignKey("dbo.PlayerVisits", "PlayerStats_Id", "dbo.PlayerStats");
            DropForeignKey("dbo.PlayerSpells", "Spell_Id", "dbo.Spells");
            DropForeignKey("dbo.PlayerSpells", "Player_Id", "dbo.Players");
            DropForeignKey("dbo.Players", "quests_Id", "dbo.PlayerQuests");
            DropForeignKey("dbo.PlayerQuestQuests", "PlayerQuests_Id", "dbo.PlayerQuests");
            DropForeignKey("dbo.PlayerQuestQuests", "Quest_Id", "dbo.Quests");
            DropForeignKey("dbo.Players", "navigation_Id", "dbo.Navigations");
            DropForeignKey("dbo.Navigations", "currentWorld_Id", "dbo.Worlds");
            DropForeignKey("dbo.Areas", "World_Id", "dbo.Worlds");
            DropForeignKey("dbo.Navigations", "currentRoom_Id", "dbo.Rooms");
            DropForeignKey("dbo.Navigations", "currentLocation_Id", "dbo.Locations");
            DropForeignKey("dbo.Navigations", "currentArea_Id", "dbo.Areas");
            DropForeignKey("dbo.Locations", "Area_Id", "dbo.Areas");
            DropForeignKey("dbo.Rooms", "Location_Id", "dbo.Locations");
            DropForeignKey("dbo.RoomRooms", "Room_Id1", "dbo.Rooms");
            DropForeignKey("dbo.RoomRooms", "Room_Id", "dbo.Rooms");
            DropForeignKey("dbo.Locations", "QuestGiver_Id", "dbo.QuestGivers");
            DropForeignKey("dbo.QuestGiverQuests", "Quest_Id", "dbo.Quests");
            DropForeignKey("dbo.QuestGiverQuests", "QuestGiver_Id", "dbo.QuestGivers");
            DropForeignKey("dbo.QuestGivers", "Quest_Id", "dbo.Quests");
            DropForeignKey("dbo.Quests", "NextQuest_Id", "dbo.Quests");
            DropForeignKey("dbo.Players", "inventory_Id", "dbo.Inventories");
            DropForeignKey("dbo.Weapons", "Inventory_Id", "dbo.Inventories");
            DropForeignKey("dbo.InventoryRelics", "Relic_Id", "dbo.Relics");
            DropForeignKey("dbo.InventoryRelics", "Inventory_Id", "dbo.Inventories");
            DropForeignKey("dbo.Potions", "Inventory_Id", "dbo.Inventories");
            DropForeignKey("dbo.Armors", "Inventory_Id", "dbo.Inventories");
            DropForeignKey("dbo.Players", "equipment_Id", "dbo.Equipments");
            DropForeignKey("dbo.Equipments", "weapon_Id", "dbo.Weapons");
            DropForeignKey("dbo.Equipments", "torso_Id", "dbo.Armors");
            DropForeignKey("dbo.Equipments", "legs_Id", "dbo.Armors");
            DropForeignKey("dbo.Equipments", "head_Id", "dbo.Armors");
            DropForeignKey("dbo.Equipments", "feet_Id", "dbo.Armors");
            DropForeignKey("dbo.Equipments", "arm_Id", "dbo.Armors");
            DropForeignKey("dbo.Players", "engaging_Id", "dbo.Monsters");
            DropForeignKey("dbo.Monsters", "attribute_Id", "dbo.PlayerAttributes");
            DropForeignKey("dbo.Players", "attributes_Id", "dbo.PlayerAttributes");
            DropIndex("dbo.PlayerSpells", new[] { "Spell_Id" });
            DropIndex("dbo.PlayerSpells", new[] { "Player_Id" });
            DropIndex("dbo.RoomRooms", new[] { "Room_Id1" });
            DropIndex("dbo.RoomRooms", new[] { "Room_Id" });
            DropIndex("dbo.QuestGiverQuests", new[] { "Quest_Id" });
            DropIndex("dbo.QuestGiverQuests", new[] { "QuestGiver_Id" });
            DropIndex("dbo.InventoryRelics", new[] { "Relic_Id" });
            DropIndex("dbo.InventoryRelics", new[] { "Inventory_Id" });
            DropIndex("dbo.Markets", new[] { "locationIAmIn_Id" });
            DropIndex("dbo.Markets", new[] { "inventory_Id" });
            DropIndex("dbo.PlayerVisits", new[] { "PlayerStats_Id" });
            DropIndex("dbo.PlayerQuestQuests", new[] { "PlayerQuests_Id" });
            DropIndex("dbo.PlayerQuestQuests", new[] { "Quest_Id" });
            DropIndex("dbo.Rooms", new[] { "Location_Id" });
            DropIndex("dbo.Quests", new[] { "NextQuest_Id" });
            DropIndex("dbo.QuestGivers", new[] { "Quest_Id" });
            DropIndex("dbo.Locations", new[] { "Area_Id" });
            DropIndex("dbo.Locations", new[] { "QuestGiver_Id" });
            DropIndex("dbo.Areas", new[] { "World_Id" });
            DropIndex("dbo.Navigations", new[] { "currentWorld_Id" });
            DropIndex("dbo.Navigations", new[] { "currentRoom_Id" });
            DropIndex("dbo.Navigations", new[] { "currentLocation_Id" });
            DropIndex("dbo.Navigations", new[] { "currentArea_Id" });
            DropIndex("dbo.Potions", new[] { "Inventory_Id" });
            DropIndex("dbo.Weapons", new[] { "Inventory_Id" });
            DropIndex("dbo.Armors", new[] { "Inventory_Id" });
            DropIndex("dbo.Equipments", new[] { "weapon_Id" });
            DropIndex("dbo.Equipments", new[] { "torso_Id" });
            DropIndex("dbo.Equipments", new[] { "legs_Id" });
            DropIndex("dbo.Equipments", new[] { "head_Id" });
            DropIndex("dbo.Equipments", new[] { "feet_Id" });
            DropIndex("dbo.Equipments", new[] { "arm_Id" });
            DropIndex("dbo.Monsters", new[] { "attribute_Id" });
            DropIndex("dbo.Players", new[] { "title_Id" });
            DropIndex("dbo.Players", new[] { "stats_Id" });
            DropIndex("dbo.Players", new[] { "quests_Id" });
            DropIndex("dbo.Players", new[] { "navigation_Id" });
            DropIndex("dbo.Players", new[] { "inventory_Id" });
            DropIndex("dbo.Players", new[] { "equipment_Id" });
            DropIndex("dbo.Players", new[] { "engaging_Id" });
            DropIndex("dbo.Players", new[] { "attributes_Id" });
            DropIndex("dbo.Acheivements", new[] { "player_Id" });
            DropTable("dbo.PlayerSpells");
            DropTable("dbo.RoomRooms");
            DropTable("dbo.QuestGiverQuests");
            DropTable("dbo.InventoryRelics");
            DropTable("dbo.Markets");
            DropTable("dbo.Events");
            DropTable("dbo.Titles");
            DropTable("dbo.PlayerVisits");
            DropTable("dbo.PlayerStats");
            DropTable("dbo.Spells");
            DropTable("dbo.PlayerQuestQuests");
            DropTable("dbo.PlayerQuests");
            DropTable("dbo.Worlds");
            DropTable("dbo.Rooms");
            DropTable("dbo.Quests");
            DropTable("dbo.QuestGivers");
            DropTable("dbo.Locations");
            DropTable("dbo.Areas");
            DropTable("dbo.Navigations");
            DropTable("dbo.Relics");
            DropTable("dbo.Potions");
            DropTable("dbo.Inventories");
            DropTable("dbo.Weapons");
            DropTable("dbo.Armors");
            DropTable("dbo.Equipments");
            DropTable("dbo.Monsters");
            DropTable("dbo.PlayerAttributes");
            DropTable("dbo.Players");
            DropTable("dbo.Acheivements");
        }
    }
}
