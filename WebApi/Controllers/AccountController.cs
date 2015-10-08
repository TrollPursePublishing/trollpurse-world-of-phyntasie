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
    public class EmailViewModel
    {
        public EmailViewModel(string msg, bool success)
        {
            this.msg = msg;
            this.success = success;
        }
        public string msg { get; set; }
        public bool success { get; set; }
    }

    public class PasswordResetViewModel
    {
        public PasswordResetViewModel(string msg, bool success)
        {
            this.msg = msg;
            this.success = success;
        }
        public string msg { get; set; }
        public bool success { get; set; }
        public string additionalData { get; set; }
    }

    public class RegisterViewModel
    {
        public RegisterViewModel(string username, string password, string confirmpassword, string email, string gender, bool emailOptout = false)
        {
            this.username = username;
            this.password = password;
            this.confirmpassword = password;
            this.email = email;
            this.gender = gender;
            this.emailOptout = emailOptout;
        }
        public string username { get; set; }
        public string password { get; set; }
        public string confirmpassword { get; set; }
        public string email { get; set; }
        public string gender { get; set; }
        public bool emailOptout { get; set; }

        public bool Valid()
        {
            return !String.IsNullOrWhiteSpace(username) &&
                !String.IsNullOrWhiteSpace(password) &&
                !String.IsNullOrWhiteSpace(confirmpassword) &&
                password.Equals(confirmpassword) &&
                ((!emailOptout && !String.IsNullOrWhiteSpace(email)) ||
                emailOptout) &&
                !String.IsNullOrWhiteSpace(gender);
        }
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

        [HttpPost]
        [AllowAnonymous]
        [Route("api/account/password/reset")]
        public IHttpActionResult PasswordResetRequested([FromBody]string email)
        {
            try
            {
                if (String.IsNullOrWhiteSpace(email))
                    return BadRequest("Valid email must be supplied");

                var user = UserManager.FindByEmail(email);
                string link = String.Format("{0}#/api/account/password/{1}/{2}", Website, GenerateHashString(user.Id, user.PlayerId.ToString()), user.SecurityStamp);
                UserManager.SendEmailAsync(user.Id, "AdventureQuestGame Password Reset", String.Format("You are receiving this email because a password reset has been request for your account with this email address.\r\n If you did not request this information, please contact support and do not continue. If you did, please follow the link below or copy and pasted it into your URL bar.\r\n\r\n<a href=\"{0}\">{0}</a>\r\n{0}", link));
            }
            catch (Exception) { }
            return Ok(new PasswordResetViewModel(String.Format("Your Password reset confirmation was sent to {0}", email), true));
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/account/password/{hash}/{securityStamp}")]
        public IHttpActionResult ConfirmPasswordReset(string hash, string securityStamp)
        {
            var user = GetUserFromHash(hash);
            if (user == null)
                return BadRequest();

            if (user.SecurityStamp == securityStamp)
            {
                return Ok(new PasswordResetViewModel("Please Enter and Confirm your new password.", true) { additionalData = user.Id });
            }
            else
                return BadRequest();
        }

        public class PasswordResetViewModelRequest
        {
            public string id { get; set; }
            public string password { get; set; }
            public string confirmPassword { get; set; }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/account/password/confirm")]
        public IHttpActionResult ResetPassword([FromBody]PasswordResetViewModelRequest model)
        {
            try
            {
                var user = UserManager.FindById(model.id);
                if (model.password == model.confirmPassword)
                {
                    var token = UserManager.GeneratePasswordResetToken(model.id);
                    var result = UserManager.ResetPassword(user.Id, token, model.password);
                    if (result.Succeeded)
                        return Ok(new PasswordResetViewModel("Your password has been reset, please try logging in.", true));
                    else
                    {
                        return Ok(new PasswordResetViewModel(String.Join(", ", result.Errors), false));
                    }
                }
                else
                    return Ok(new PasswordResetViewModel("Passwords do not match, please try again.", false));
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/account/confirm/{hash}/{confirmationCode}")]
        public async Task<IHttpActionResult> ConfirmEmail(string hash, string confirmationCode)
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
                await UserManager.RegisterUserEmail(user.Id);
                return Ok(new EmailViewModel("Alright! you may now play!", true));
            }
            else
                return BadRequest();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/account/donotdisturb/{hash}")]
        public async Task<IHttpActionResult> DoNotDisturb(string hash)
        {
            var user = GetUserFromHash(hash);
            if (user == null)
                return BadRequest();
            await UserManager.SetUserSendMail(user, false);
            
            return Ok(new EmailViewModel("You have been removed from the mailing list.", true));
        }

        [HttpGet]
        [Authorize(Roles = "Player")]
        [Route("api/account/sendmail/{playerid}")]
        public IHttpActionResult GetSendMail(string playerId)
        {
            var ctx = Request.GetOwinContext();
            var user = ctx.Authentication.User;
            var claims = user.Claims;
            if (claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier) && c.Value.Equals(playerId)) != null)
            {
                Guid id;
                if (Guid.TryParse(playerId, out id))
                {
                    var us = UserManager.Users.First(u => u.PlayerId.Equals(id));
                    return Ok(us.SendMail);
                }
                else return BadRequest();
            }
            else return BadRequest();
        }

        [HttpPost]
        [Authorize(Roles = "Player")]
        [Route("api/account/sendmail")]
        public async Task<IHttpActionResult> SendMeUpdates([FromBody]string playerId)
        {
            var ctx = Request.GetOwinContext();
            var user = ctx.Authentication.User;
            var claims = user.Claims;
            if (claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier) && c.Value.Equals(playerId)) != null)
            {
                Guid id;
                if (Guid.TryParse(playerId, out id))
                {
                    var us = UserManager.Users.First(u => u.PlayerId.Equals(id));
                    await UserManager.SetUserSendMail(us, true);
                    return Ok(new EmailViewModel("Awesome! You will now receive updates!", true));
                }
                else return BadRequest();
            }
            else return BadRequest();
        }

        [HttpPost]
        [Authorize(Roles = "Player")]
        [Route("api/account/logout")]
        public IHttpActionResult Logout([FromBody]string playerId)
        {
            Request.GetOwinContext().Authentication.SignOut();
            return Ok();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/account/register")]
        public async Task<IHttpActionResult> Register([FromBody]RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.Valid())
            {

                var p = service.Create(model.username, model.gender);
                var user = new ApplicationUser(p.Id) { UserName = model.username, Email = model.emailOptout ? String.Empty : model.email };

                IdentityResult result = await UserManager.CreateAsync(user, model.password);

                if (!result.Succeeded)
                {
                    service.Delete(service.GetPlayer(p.Id));
                    return GetErrorResult(result);
                }

                string token = Guid.NewGuid().ToString();
                var claims = new Claim[] 
                { 
                    new Claim(ClaimTypes.NameIdentifier, user.PlayerId.ToString()),
                    new Claim(ClaimTypes.Email, token),
                    new Claim(ClaimTypes.Role, "Player")
                };

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
                    if (!model.emailOptout)
                    {
                        await UserManager.SendEmailAsync(user.Id, "AdventureQuestGame Account Confirmation", String.Format("Please press this link or copy and paste it into the URL to complete registrations: <a href=\"{0}\">{0}</a>\n If you cannot see the link, copy and paste this to your address bar: {0}", link));
                    }
                    else
                    {
                        return Ok(ConfirmEmail(GenerateHashString(user.Id, user.PlayerId.ToString()), token));
                    }
                }
                catch (Exception)
                {
                    ModelState.AddModelError("d", "Could not send e-mail for confirmation.");
                    service.Delete(p);
                    UserManager.Delete(user);
                    return BadRequest();
                }
                return Ok(new IdentityResult("Please check your e-mail for a confirmation link, then you will be all set to adventure!"));
            }
            else
            {
                return GetErrorResult(new IdentityResult("Invalid data submitted"));
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (UserManager != null)
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
    }
}