using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Services.Private
{
    class QuestCommandWorker : ICommandWorker
    {
        public Commands Handles()
        {
            return Commands.quest;
        }

        public IList<string> Process(Models.Player player, string additionalParams, Contexts.GameContext GameCtx)
        {
            List<string> Results = new List<string>();
            if (additionalParams.Equals("start"))
            {
                if (player.navigation.currentLocation.QuestGiver == null || (player.navigation.currentLocation.QuestGiver != null && !player.navigation.currentLocation.QuestGiver.CanDoQuest(player)))
                    Results.Add("There are no quest givers here.");
                else if (player.quests.Quests.FirstOrDefault(q => q.Quest.Title.Equals(player.navigation.currentLocation.QuestGiver.Quest.Title)) != null)
                    Results.Add(String.Format("I have already accepted or completed {0}. {1}", player.navigation.currentLocation.QuestGiver.Quest.Title,
                        player.navigation.currentLocation.QuestGiver.Quest.Instructions));
                else
                {
                    Results.Add(String.Format("I accept {0}. {1} {2}", player.navigation.currentLocation.QuestGiver.Quest.Title,
                        player.navigation.currentLocation.QuestGiver.Quest.Description,
                        player.navigation.currentLocation.QuestGiver.Quest.Instructions));

                    player.quests.Quests.Add(new Models.PlayerQuestQuest(player.navigation.currentLocation.QuestGiver.Quest));
                }
            }
            else
            {
                Results.Add("My Current Quests.");
                var range = player.quests.Quests.Where(q => !q.Complete);
                if (range.Count() > 0)
                    range.ToList().ForEach(qq => Results.Add(String.Format("{0}: {1}", qq.Quest.Title, qq.Quest.Instructions)));
                else
                    Results.Add("I have not taken on any quests lately, am I a coward? Lazy? I think not! Forth I go to collect and complete quests!");
            }

            return Results;
        }
    }
}
