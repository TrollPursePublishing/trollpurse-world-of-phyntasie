﻿using AdventureQuestGame.Models;
using AdventureQuestGame.Services.Private;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace AdventureQuestGame.Services
{
    public class RankService : AbstractService
    {
        public IList<Player> GetTopTen()
        {
        try{
            if (GameCtx.players.Count() > 9)
            {
                return GameCtx.players.AsParallel().OrderBy(p => p.stats.score).ToList().GetRange(0, 10).ToList();
            }
            return GameCtx.players.OrderBy(p => p.stats.score).ToList();
            }catch(Exception e){
            throw e;
            }
        }

        public IList<Player> GetAllOrdered()
        {
            return GameCtx.players.AsParallel().OrderBy(p => p.stats.score).ToList();
        }

        public PlayerStats GetStatsById(Guid playerId)
        {
            return GameCtx.players.First(p => p.Id == playerId).stats;
        }
    }
}
