using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AdventureQuestGame.Models;
using System.Data.Entity;

namespace AdventureQuestGame.Admin
{
    public class AreaAdministration : AbstractService
    {
        public AreaAdministration()
        {
            GameCtx.Configuration.LazyLoadingEnabled = false;
        }

        public List<Area> GetAreas()
        {
            return GameCtx.areas
                .Include(a => a.locations)
                .ToList();
        }

        public Area UpdateArea(Guid Id, string name, string description, string imagePath, ICollection<Guid> locationIds)
        {
            var area = GameCtx.areas.Find(Id);
            if(area != null)
            {
                var locations = GameCtx.locations
                    .Where(l => locationIds.Contains(l.Id))
                    .ToList();

                area.name = name;
                area.description = description;
                area.imagepath = imagePath;
                area.locations = locations;
                GameCtx.SaveChanges();
            }
            return area;
        }

        public Area CreateArea(string name, string description, string imagePath, ICollection<Guid> locationIds)
        {
            var locations = GameCtx.locations
                .Where(l => locationIds.Contains(l.Id))
                .ToList();

            var created = new Area(name, description)
            {
                imagepath = imagePath,
                locations = locations
            };
            GameCtx.areas.Add(created);
            GameCtx.SaveChanges();
            return created;
        }

        public void DeleteArea(Guid Id)
        {
            var toRemove = GameCtx.areas.Find(Id);
            if(toRemove != null)
            {
                toRemove.locations = new List<Location>();
                GameCtx.SaveChanges();
                GameCtx.areas.Remove(toRemove);
                GameCtx.SaveChanges();
            }
        }
    }
}