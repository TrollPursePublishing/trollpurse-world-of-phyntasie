using AdventureQuestGame.Contexts.Initializers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
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
            //Various third party configurations
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            };

            //Migrations
            var authmigration = new WebApi.Migrations.Configuration();
            var migrator = new DbMigrator(authmigration);
            migrator.Update();

            var gamemigration = new AdventureQuestGame.Migrations.Configuration();
            migrator = new DbMigrator(gamemigration);
            migrator.Update();

            //Initiailizers
            Database.SetInitializer(new GameInit());
            Database.SetInitializer(new AuthInit());

            //Web Configurations
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
