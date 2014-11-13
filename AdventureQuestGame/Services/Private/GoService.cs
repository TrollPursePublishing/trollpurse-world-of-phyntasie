using AdventureQuestGame.Contexts;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class GoService : AbstractService
    {
        const int size = 7;
        public IList<string> Process(Player player, string additionalParams, GameContext GameCtx)
        {
            if(player.isInCombat)
            {
                return new List<string>(new[]{"I cannot go anywhere when in combat, I am not a coward!"});
            }

            if(player.navigation.currentRoom != null && player.isInside)
            {
                IList<string> result = new List<string>();
                //ONly move to rooms
                if (player.navigation.currentRoom.linkedRoom != null)
                {
                    Room destination = player.navigation.currentRoom.linkedRoom.FirstOrDefault(r => r.name.Equals(additionalParams));
                    if (destination != null)
                    {
                        Room old = player.navigation.currentRoom;
                        player.navigation.currentRoom = destination;

                        if(player.OnMove(destination.Id.Value))
                        {
                            GameCtx.achievements.Add(new Acheivement(String.Format("Adventurous Soul: {0}", destination.name), String.Format("Discovering {0} has given a fresh new outlook on life and adventuring - for good or bad. {1}", destination.name, destination.description), player));
                        }

                        result.Add(String.Format("I transition from {0} to {1}, {2}.", old.name, destination.name, destination.description));
                        
                        Random r = new Random();
                        if(r.Next(5) > 1)
                        {
                            IList<Monster> monsters = GameCtx.monsters.Where(mm => mm.attribute.level <= player.attributes.level).ToList();
                            int index = r.Next(monsters.Count);
                            Monster m = monsters[index];
                            result.Add(player.Engage(m.Copy()));
                        }
                        return result;
                    }
                }
                result.Add(String.Format("{0} is not a room I may go to.", additionalParams));
                return result;
            }
            else if (player.navigation.currentRoom == null && !player.isInside)
            {
                if (player.navigation.currentLocation.rooms != null)
                {
                    Room destination = player.navigation.currentLocation.rooms.FirstOrDefault(r => r.isExit && r.name.Equals(additionalParams));
                    if (destination != null)
                    {
                        if (player.OnMove(destination.Id.Value))
                        {
                            GameCtx.achievements.Add(new Acheivement(String.Format("Adventurous Soul: {0}", destination.name), String.Format("Discovering {0} has given a fresh new outlook on life and adventuring - for good or bad. {1}", destination.name, destination.description), player));
                        }
                        player.navigation.currentRoom = destination;
                        player.isInside = true;
                        return new List<string>(new[]{String.Format("I enter the {0}, a part of {1}. {2}", destination.name, player.navigation.currentLocation.name, destination.description)});
                    }
                }

                //must be trying to go to a location
                Location location = player.navigation.currentArea.locations.FirstOrDefault(l => l.name.Equals(additionalParams));
                if (location != null)
                {
                    if (player.OnMove(location.Id))
                    {
                        GameCtx.achievements.Add(new Acheivement(String.Format("Adventurous Soul: {0}", location.name), String.Format("Discovering {0} has given a fresh new outlook on life and adventuring - for good or bad. {1}", location.name, location.description), player));
                    }
                    IList<string> result = new List<string>();
                    player.navigation.currentLocation = location;
                    result.Add(String.Format("{0}, {1}", location.name, location.description));
                    Random r = new Random();
                    if (r.Next(5) > 3)
                    {
                        IList<Monster> monsters = GameCtx.monsters.Where(mm => mm.attribute.level <= player.attributes.level).ToList();
                        int index = r.Next(monsters.Count);
                        Monster m = monsters[index];
                        result.Add(player.Engage(m.Copy()));
                    }
                    return result;
                }
                //finally, try to see if they are trying to go to a new area
                Area area = player.navigation.currentWorld.areas.FirstOrDefault(a => a.name.Equals(additionalParams));
                if (area != null)
                {
                    if (player.navigation.currentLocation.isExit)
                    {
                        if (player.OnMove(area.Id))
                        {
                            GameCtx.achievements.Add(new Acheivement(String.Format("Adventurous Soul: {0}", area.name), String.Format("Discovering {0} has given a fresh new outlook on life and adventuring - for good or bad. {1}", area.name, area.description), player));
                        }
                        player.navigation.currentArea = area;
                        player.navigation.currentLocation = area.locations.First();
                        return new List<string>(new[]{String.Format("I have travelled to {0}. {1}", area.name, area.description)});
                    }
                    return new List<string>(new[]{String.Format("I cannot go to {0} from {1}", area.name, player.navigation.currentLocation.name)});
                }

            }
            //finally, if we reach this point
            return new List<string>(new[]{String.Format("I do not know where {0} is.", additionalParams)});
        }
    }
}
