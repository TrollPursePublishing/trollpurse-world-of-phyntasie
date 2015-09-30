using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Owin;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;
using System.Web.Security;
using WebApi;
using WebApi.Backend.Admin;

namespace UpdateService.WebApi.Authorization.Auth
{
    public class MachineKeyDataProtector : IDataProtector
    {
        public byte[] Protect(byte[] userData)
        {
            return MachineKey.Protect(userData, typeof(OAuthBearerAuthenticationMiddleware).Namespace, "Access_Token", "v1");
        }

        public byte[] Unprotect(byte[] protectedData)
        {
            return MachineKey.Unprotect(protectedData, typeof(OAuthBearerAuthenticationMiddleware).Namespace, "Access_Token", "v1");
        }
    }

    public class APIAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            await Task.Run(() => context.Validated());
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task MatchEndpoint(OAuthMatchEndpointContext context)
        {
            return base.MatchEndpoint(context);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            string username = context.UserName;
            string password = context.Password;
            ApplicationUserManager clientManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

            var response = await clientManager.FindAsync(username, password);

            if (response != null)
            {
                var identity = new ClaimsIdentity(context.Options.AuthenticationType);

                identity.AddClaims(await clientManager.GetClaimsAsync(response.Id));

                if (!identity.HasClaim(ClaimTypes.Role, "Admin"))
                {
                    context.SetError("You are not and administrator, leave now!");
                    context.Rejected();
                    return;
                }

                IDictionary<string, string> properties = new Dictionary<string, string>
                {
                };

                var ticket = new AuthenticationTicket(identity, new AuthenticationProperties(properties));
                context.Validated(ticket);
            }
            else
            {
                context.SetError("invalid_grant", "Invalid username and/or password");
                context.Rejected();
            }
        }
    }
}
