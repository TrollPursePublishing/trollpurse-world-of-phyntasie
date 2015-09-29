namespace AdventureQuestGame.Migrations
{
    using AdventureQuestGame.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<AdventureQuestGame.Contexts.GameContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(AdventureQuestGame.Contexts.GameContext context)
        {
        }
    }
}
