namespace WebApi.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<WebApi.Models.AuthenticationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "WebApi.Models.AuthenticationDbContext";
        }

        protected override void Seed(WebApi.Models.AuthenticationDbContext context)
        {
            context.Roles.AddOrUpdate(
                r => r.Id
                );

            context.Users.AddOrUpdate(
                r => r.Id
                );
        }
    }
}
