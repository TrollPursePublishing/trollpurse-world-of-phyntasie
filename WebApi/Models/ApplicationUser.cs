using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace WebApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        public Guid PlayerId { get; private set; }
        public bool SendMail { get; set; }

        protected ApplicationUser() { }

        public ApplicationUser(Guid PlayerId)
        {
            this.PlayerId = PlayerId;
            SendMail = true;
        }
    }

    public class AuthenticationDbContext : IdentityDbContext<ApplicationUser>
    {
        public AuthenticationDbContext()
            : base("Game")
        {
            Database.SetInitializer(new AuthInit());
        }

        public static AuthenticationDbContext Create()
        {
            return new AuthenticationDbContext();
        }
    }

    public sealed class AuthInit : CreateDatabaseIfNotExists<AuthenticationDbContext>
    {
        protected override void Seed(AuthenticationDbContext context)
        {
            context.Roles.Add(new IdentityRole("Player"));
            context.Roles.Add(new IdentityRole("Admin"));
            context.SaveChanges();
        }
    }
}