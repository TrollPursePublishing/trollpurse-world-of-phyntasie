using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using WebApi;
using Newtonsoft.Json;
using WebApi.Models;
using AdventureQuestGame.Services;
using System.Web.Http.Description;
using System.Text;
using System.Linq;

namespace WebApplication1.Controllers
{
    class EmailViewModel
    {
        public EmailViewModel(string msg, bool success)
        {
            this.msg = msg;
            this.success = success;
        }
        public string msg { get; private set; }
        public bool success { get; private set; }
    }

    class RegisterViewModel
    {
        public RegisterViewModel(string username, string password, string confirmpassword, string email, string gender)
        {
            this.username = username;
            this.password = password;
            this.confirmpassword = password;
            this.email = email;
            this.gender = gender;
        }
        public string username { get; private set; }
        public string password { get; private set; }
        public string confirmpassword { get; private set; }
        public string email { get; private set; }
        public string gender { get; private set; }
    }

    class LoginViewModel
    {
        public LoginViewModel(string username, string password)
        {
            this.username = username;
            this.password = password;
        }

        public string username { get; private set; }
        public string password { get; private set; }
    }

    class LoginReponseViewModel
    {
        public LoginReponseViewModel(string message, bool isError)
        {
            this.message = message;
            this.isError = isError;
        }

        public string message {get; private set;}
        public bool isError{get; private set;}
    }

    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager = null;
        private PlayerService service = new PlayerService();
        private static readonly string Website = @"http://adventuregamequest.azurewebsites.net";

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        private ApplicationUser GetUserFromHash(string hash)
        {
            ApplicationUser user = null;
            foreach (var u in UserManager.Users)
            {
                if (GenerateHashString(u.Id, u.PlayerId.ToString()).Equals(hash))
                {
                    user = u;
                    break;
                }
            }
            return user;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/account/confirm/{hash}/{confirmationCode}")]
        public IHttpActionResult ConfirmEmail(string hash, string confirmationCode)
        {
            var users = UserManager.Users.Where(u => !u.EmailConfirmed);
            if (users == null)
                return BadRequest();

            ApplicationUser user = null;
            foreach (var u in users)
            {
                if (GenerateHashString(u.Id, u.PlayerId.ToString()).Equals(hash))
                {
                    user = u;
                    break;
                }
            }
            if (user == null)
                return BadRequest();

            if (user.Claims.FirstOrDefault(c => c.ClaimType.Equals(ClaimTypes.Email) && c.ClaimValue.Equals(confirmationCode)) != null)
            {
                UserManager.RegisterUserEmail(user.Id);
                return Ok(new EmailViewModel("Alright! you may now play!", true));
            }
            else
                return BadRequest();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/account/donotdisturb/{hash}")]
        public IHttpActionResult DoNotDisturb(string hash)
        {
            var user = GetUserFromHash(hash);
            if (user == null)
                return BadRequest();
            user.SendMail = false;
            return Ok(new EmailViewModel("You have been removed from the mailing list.", true));
        }

        [HttpGet]
        [Authorize(Roles="Player")]
        [Route("api/account/sendmail/{playerId}")]
        public IHttpActionResult SendMeUpdates(string playerId)
        {
            var ctx = Request.GetOwinContext();
            var user = ctx.Authentication.User;
            var claims = user.Claims;
            if (claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier) && c.Value.Equals(playerId)) != null)
            {
                Guid id = Guid.Parse(playerId);
                var us = UserManager.Users.First(u => u.PlayerId.Equals(id));
                us.SendMail = true;
                return Ok(new EmailViewModel("Awesome! You will now receive updates!", true));
            }
            else return BadRequest();
        }

        [HttpGet]
        [Authorize(Roles="Player")]
        [Route("api/account/logout/{playerId}")]
        public IHttpActionResult Logout(string playerId)
        {
            Request.GetOwinContext().Authentication.SignOut();
            return Ok();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/account/login")]
        [ResponseType(typeof(string))]
        public async Task<string> Login()
        {
            Dictionary<string, string> content = await Request.Content.ReadAsAsync<Dictionary<string, string>>();
            LoginViewModel model = new LoginViewModel(content["username"], content["password"]);

            var user = await UserManager.FindAsync(model.username, model.password);
            if (user == null)
                return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(new LoginReponseViewModel("Username and password pair not found", true)));
            if (String.IsNullOrWhiteSpace(user.Email) || !user.EmailConfirmed)
                return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(new LoginReponseViewModel("You have not confirmed your e-mail address. If you have not received the e-mail, please check your junk folder.", true)));

            var id = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            var ctx = Request.GetOwinContext();
            var auth = ctx.Authentication;
            auth.SignIn(new AuthenticationProperties() {IsPersistent = true }, id);

            return await Task.Factory.StartNew<string>(() => JsonConvert.SerializeObject(new LoginReponseViewModel(user.PlayerId.ToString(), false)));
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/account/register")]
        public async Task<IHttpActionResult> Register()
        {
            Dictionary<string, string> content = await Request.Content.ReadAsAsync<Dictionary<string, string>>();
            RegisterViewModel model = new RegisterViewModel(content["username"], content["password"], content["confirmpassword"], content["email"], content["gender"]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!model.password.Equals(model.confirmpassword))
            {
                return GetErrorResult(new IdentityResult("Passwords do not match!"));
            }

            var p = service.Create(model.username, model.gender);
            var user = new ApplicationUser(p.Id) { UserName = model.username, Email = model.email};

            IdentityResult result = await UserManager.CreateAsync(user, model.password);

            if (!result.Succeeded)
            {
                service.Delete(service.GetPlayer(p.Id));
                return GetErrorResult(result);
            }

            string token = Guid.NewGuid().ToString();
            var claims = new Claim[]{ new Claim(ClaimTypes.NameIdentifier, user.PlayerId.ToString()), new Claim(ClaimTypes.Email, token)};

            result = await UserManager.AddToRoleAsync(user.Id, "Player");
            if (!result.Succeeded)
            {
                service.Delete(service.GetPlayer(p.Id));
                UserManager.Delete(user);
                return GetErrorResult(result);
            }

            foreach (var claim in claims)
            {
                result = await UserManager.AddClaimAsync(user.Id, claim);
                if (!result.Succeeded)
                {
                    UserManager.Delete(user);
                    service.Delete(service.GetPlayer(p.Id));
                    return GetErrorResult(result);
                }
            }

            string link = String.Format("{0}/#/external/account/register/{1}/{2}", Website, GenerateHashString(user.Id, user.PlayerId.ToString()), token);
            try
            {
                await UserManager.SendEmailAsync(user.Id, "AdventureQuestGame Account Confirmation", String.Format("Please press this link or copy and paste it into the URL to complete registrations: <a href=\"{0}\">{1}</a>\n If you cannot see the link, copy and paste this to your address bar: {2}", link, link, link));
            }
            catch (Exception e)
            {
                ModelState.AddModelError("d", "Could not send e-mail for confirmation.");
                service.Delete(p);
                UserManager.Delete(user);
                return BadRequest();
            }
            return Ok(new IdentityResult("Please check your e-mail for a confirmation link, then you will be all set to adventure!"));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if(UserManager != null)
                    UserManager.Dispose();
            }

            base.Dispose(disposing);
        }

        private string GenerateHashString(string userId, string playerId)
        {
            using (var crypto = System.Security.Cryptography.SHA512.Create())
            {
                string result = String.Empty;
                foreach (var b in crypto.ComputeHash(Encoding.UTF8.GetBytes(userId + playerId + "@4j$")))
                {
                    result += b.ToString("x2");
                }
                return result;
            }
        }

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("d", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion
    }
}
