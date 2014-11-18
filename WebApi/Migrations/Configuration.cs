namespace WebApi.Migrations
{
    using Microsoft.AspNet.Identity.EntityFramework;
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
            if(context.Roles.All(r => !r.Name.Equals("Player")))
                context.Roles.AddOrUpdate(new IdentityRole("Player"));
            context.SaveChanges();
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            context.Roles.AddOrUpdate(
                r => r.Id);

            context.Users.AddOrUpdate(
                r => r.Id);
        }
    }
}
