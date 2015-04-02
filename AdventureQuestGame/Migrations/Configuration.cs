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
        }
    }
}
