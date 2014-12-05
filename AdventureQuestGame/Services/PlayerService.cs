using AdventureQuestGame.Models;
using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services
{
    public class PlayerService : AbstractService
    {
        public Player GetPlayer(Guid playerId)
        {
            return GameCtx.players.First(p => p.Id == playerId);
        }

        public Player GetPlayer(string name)
        {
            return GameCtx.players.First(p => p.name.Equals(name));
        }

        public IList<Player> GetPlayersInArea(Guid areaId)
        {
            return GameCtx.players.Where(p => p.navigation.currentArea.Id == areaId).ToList();
        }

        public IList<Player> GetPlayersNearPlayer(Guid playerId)
        {
            return GetPlayersInArea(GetPlayer(playerId).navigation.currentArea.Id).ToList();
        }

        public PlayerAttributes GetPlayerAttributes(Guid playerId)
        {
            return GetPlayer(playerId).attributes;
        }

        public PlayerStats GetPlayerStats(Guid playerId)
        {
            return GetPlayer(playerId).stats;
        }

        public void Delete(Player p)
        {
            GameCtx.spells.RemoveRange(p.spells);
            GameCtx.players.Remove(p);
            GameCtx.SaveChanges();
        }

        public Player Create(string name, string gender)
        {
            Gender egender;
            if (!Enum.TryParse<Gender>(gender, true, out egender))
                egender = Gender.Male;
            Player p = new Player(name, GameCtx.titles.First(t => t.genderRelation == egender && t.levelToAcheive == 1).Copy());
            p.gender = egender;
            p.spells.Add(GameCtx.spells.First(s => s.name.Equals("Spitball")).Copy());
            p.navigation.currentWorld = GameCtx.worlds.First();
            p.navigation.currentArea = p.navigation.currentWorld.areas.First(a => a.name.StartsWith("Buttleberry"));
            p.navigation.currentLocation = p.navigation.currentArea.locations.First();
            if(p.navigation.currentRoom != null)
                p.navigation.currentRoom.Id = null;

            GameCtx.achievements.Add(new Acheivement("Gone on an Adventure!", "Winding roads, rustling trees, and death await this journey. Never will life be the same! Imagine it - loot, combat, and being maimed.", p));
            
            GameCtx.players.Add(p);
            GameCtx.SaveChanges();
            return p;
        }
    }
}
