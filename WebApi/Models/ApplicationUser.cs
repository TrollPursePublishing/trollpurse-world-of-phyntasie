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

        protected ApplicationUser() { }

        public ApplicationUser(Guid PlayerId)
        {
            this.PlayerId = PlayerId;
        }
    }

    public class AuthenticationDbContext : IdentityDbContext<ApplicationUser>
    {
        public AuthenticationDbContext()
            : base("name=Game")
        {
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
            context.SaveChanges();
        }
    }
}