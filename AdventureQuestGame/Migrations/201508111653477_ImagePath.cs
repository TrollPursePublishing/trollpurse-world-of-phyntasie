namespace AdventureQuestGame.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ImagePath : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Areas", "imagepath", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Areas", "imagepath");
        }
    }
}
