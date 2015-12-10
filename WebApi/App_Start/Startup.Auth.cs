using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.DataHandler;
using Microsoft.Owin.Security.Infrastructure;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using UpdateService.WebApi.Authorization.Auth;
using WebApi;
using WebApi.Models;

namespace WebApi
{
    public partial class Startup
    {
        private static OAuthAuthorizationServerOptions OAuthOptions;

        static Startup()
        {

            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/token"),
                Provider = new APIAuthorizationServerProvider(),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(7),
                AccessTokenFormat = new TicketDataFormat(new MachineKeyDataProtector()),
                AccessTokenProvider = new AuthenticationTokenProvider(),
                AllowInsecureHttp = false
            };
        }
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();

            app.CreatePerOwinContext<AuthenticationDbContext>(AuthenticationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);

            app.UseOAuthAuthorizationServer(OAuthOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

        }
    }

}