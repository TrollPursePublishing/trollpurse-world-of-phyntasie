using AdventureQuestGame.Contexts.Initializers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using WebApi.Models;

namespace WebApi
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            };

            Database.SetInitializer(new GameInit());
            Database.SetInitializer(new AuthInit());
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
