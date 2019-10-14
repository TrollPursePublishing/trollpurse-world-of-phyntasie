"use strict";

function wop_game() {
  const {
    wop_player,
    wop_playerQuestQuest,
    wop_achievement,
    INVENTORY_SLOTS,
    QUEST_TYPE,
  } = wop_models();
  const {
    createWorld,
    allSpells,
    allPotions
  } = gameContext();

  // Begin Utility functions
  function playerBridge(player) {
    function flattenRooms(rooms) {
      return rooms.concat(rooms.flatMap(room => flattenRooms(room.linkedRoom)));
    }

    const rooms = flattenRooms(player.currentLocation.rooms);

    return player
      ? {
          ...player,
          attributes: {
            ...player.attributes,
            level: player.attributes.level()
          },
          navigation: {
            currentWorld: player.currentWorld,
            currentArea: player.currentArea,
            currentLocation: {
              ...player.currentLocation,
              rooms
            },
            currentRoom: player.currentRoom
          },
          title: {
            name: player.title
          },
          stats: {
            areasDiscovered: player.areasDiscovered,
            monstersKilled: player.monstersSlain,
            joinDate: player.joinDate
          }
        }
      : {};
  }

  function postPlayerCombatAction(p, targetPlayer) {
    const result = [];
    if (targetPlayer.attributes.currentHealth > 0) {
      result.push(targetPlayer.attack(p));
      if (p.attributes.currentHealth <= 0) {
        result.push(p.onDeath());
        result.push(p.onCombatOver(targetPlayer));
        result.push(p.onRevive());
        p.currentArea = p.currentWorld.areas[0];
        p.currentLocation = p.currentArea.locations[0];
        p.currentRoom = null;
      }
    } else {
      p.attributes.addExperience(targetPlayer.attributes.level() * 30);
      p.inventory.gold = p.inventory.gold + targetPlayer.attributes.level() * 10;
      result.push(targetPlayer.onDeath());
      targetPlayer.onRevive(); //Do not post this message.
      result.push(p.onCombatOver(targetPlayer));

      p.monstersSlain = p.monstersSlain + 1;
      p.quests.quests
        .filter(q => q.quest.type === QUEST_TYPE.Kill)
        .filter(q => !q.isComplete())
        .filter(q => q.quest.nameOfObject.toLowerCase() === targetPlayer.name.toLowerCase())
        .forEach(q => {
          q.count = q.count + 1;
          if (q.isComplete()) {
            p.inventory.gold = p.inventory.gold + q.quest.gold;
            result.push(`Completed ${q.quest.title}!`);
          }
        });
    }
    targetPlayer.savedTarget = null; //clear monster's saved target
    if (p.savedTarget) {
      p.savedTarget.savedTarget = null;
    }
    return result;
  }

  function rollEncounter(p, oneThroughFive) {
    const roll = Math.floor(Math.random() * Math.floor(5));
    if (roll > oneThroughFive) {
      let pool = p.currentLocation.monsters
        .filter(m => p.attributes.level() >= m.attributes.level());

      if (pool.length <= 0) {
        pool = p.currentLocation.monsters;
      }

      const index = Math.floor(
        Math.random() * pool.length
      );
      const monster = pool[index];
      if (monster) {
        return p.engage(monster);
      }
    }
    return "All seems quiet here.";
  }
  // End Utility functions

  function attack(p, _) {
    if (p.isInCombat) {
      return [p.attack(p.savedTarget)].concat(
        postPlayerCombatAction(p, p.savedTarget)
      );
    }
    return ["I am not in combat right now"];
  }

  function buy(p, itemName) {
    if (p.isInCombat || p.isInside) {
      return ["I cannot purchase anything at this time."];
    }

    const market = p.currentLocation.market;

    if (market) {
      const item = market.inventory.getItem(itemName);
      if (item) {
        return [p.buyItem(item.clone()), item.description];
      }
      return [
        "I can buy the following.",
        ...market.inventory.allItems().map(item => item.name)
      ];
    } else {
      return ["There is no market where I am at."];
    }
  }

  function cast(p, spellName) {
    const spell = p.spells.find(
      spell => spell.name.toLowerCase() === spellName.toLowerCase()
    );
    if (spell) {
      if (p.isInCombat) {
        return [
          spell.description,
          p.castSpell(spell, p.savedTarget),
          ...postPlayerCombatAction(p, p.savedTarget)
        ];
      } else {
        return [
          spell.description,
          p.castSpell(spell),
        ];
      }
    }
    return [`I do not know how to cast ${spellName}`];
  }

  function equip(p, itemName) {
    const equipment = p.inventory.getItem(itemName);
    if (equipment) {
      switch (equipment.slot) {
        case INVENTORY_SLOTS.Armor:
          return [p.equipArmor(equipment)];
        case INVENTORY_SLOTS.Weapon:
          return [p.equipWeapon(equipment)];
        default:
          return [`I cannot equip ${itemName}. It is not possible to do so.`];
      }
    }
    return [`I do not have ${itemName} to equip.`];
  }

  function exit(p, _params) {
    if (p.isInCombat) {
      return ["I cannot leave while in combat."];
    }

    if (p.currentRoom) {
      if (p.currentRoom.isExit) {
        p.isInside = false;
        p.expireRoom = true;

        const result = [
          `Leaving ${p.currentRoom.name}.`,
          `Arriving at ${p.currentLocation.name}`,
          p.currentLocation.description
        ];

        if (p.currentLocation.questGiver && p.currentLocation.questGiver.canDoQuest(p)) {
          result.push(`${p.currentLocation.questGiver.name} is here.`);
          result.push(p.currentLocation.questGiver.description);
        }

        p.currentRoom = null;

        return result;
      }
      return ["There is no exit here. I must keep moving."];
    }
  }

  function explore(p, _) {
    if (p.isInCombat) {
      return ["I cannot explore while in combat."];
    }

    if ((p.isInside || p.isInRoom) && p.currentRoom) {
      if (Math.random() <= p.currentRoom.chanceForRelic) {
        const index = Math.floor(Math.random() * Math.floor(p.currentRoom.length));
        return [p.addItemToInventory(p.currentRoom.relics[index])];
      } else {
        return [rollEncounter(p, -1)];
      }
    }

    return ["I can only explore in rooms."];
  }

  function go(p, where) {
    if (p.isInCombat) {
      return ["I cannot go anywhere when in combat."];
    }

    if (p.currentRoom && p.isInside) {
      if (p.currentRoom.linkedRoom && p.currentRoom.linkedRoom.length) {
        const destination = p.currentRoom.linkedRoom.find(
          room => room.name.toLowerCase() === where.toLowerCase()
        );
        if (destination) {
          p.currentRoom = destination;
          return [p.onMove(destination), rollEncounter(p, 1)];
        }
      } else {
        //n-tree breadth first search for root with child node of name
        function findParentRoom(rooms) {
          return rooms.find(room =>
            room.linkedRoom.find(room => room.name === p.currentRoom.name)
          );
        }
        let room;
        let rooms = p.currentLocation.rooms;
        do {
          room = findParentRoom(rooms);
          rooms = rooms.flatMap(room => room.linkedRoom);
        } while (!room);
        if (where.toLowerCase() === room.name.toLowerCase()) {
          p.currentRoom = room;
          return [p.onMove(room), rollEncounter(p, 1)];
        }
      }
      return [`${where} is not a room I may go to.`];
    } else if (!p.currentRoom) {
      if (p.currentLocation.rooms && p.currentLocation.rooms.length) {
        const destination = p.currentLocation.rooms.find(
          room => room.name.toLowerCase() === where.toLowerCase()
        );
        if (destination) {
          p.currentRoom = destination;
          p.isInside = true;
          return [p.onMove(destination), rollEncounter(p, 1)];
        }
      }

      let destination = p.currentArea.locations.find(
        location => location.name.toLowerCase() === where.toLowerCase()
      );
      if (destination) {
        const results = [p.onMove(destination)];
        p.currentLocation = destination;
        if (destination.questGiver && destination.questGiver.canDoQuest(p)) {
          results.push(
            `${destination.questGiver.name} is here. ${
              destination.questGiver.description
            }`
          );
        }
        results.push(rollEncounter(p, 3));
        return results;
      }

      destination = p.currentWorld.areas.find(
        area => area.name.toLowerCase() === where.toLowerCase()
      );
      if (destination) {
        if (p.currentLocation.isExit) {
          p.currentArea = destination;
          p.currentLocation = destination.locations.find(area => area.isExit);
          return [p.onMove(destination)];
        }
        return [
          `${p.currentLocation} is not a location from which I can depart.`
        ];
      }
    }

    return [`I do not know where ${where} is.`];
  }

  function map(p, _params) {
    return p.currentWorld.areas.map(area => area.name);
  }

  function quest(p, start) {
    if (start && start.toLowerCase() === "start") {
      const cannotDo = ["There are no quest givers here."];
      if (!p.currentLocation.questGiver) {
        return cannotDo;
      }
      if (!p.currentLocation.questGiver.canDoQuest(p)) {
        return cannotDo;
      }
      const accepted = p.quests.quests.find(
        q => q.quest.title === p.currentLocation.questGiver.quest.title
      );
      if (accepted) {
        if (accepted.isComplete()) {
          return [`I have already completed ${accepted.quest.title}`];
        }
        return [`I have already accepted ${accepted.quest.title}`];
      }

      p.quests.quests.push(
        wop_playerQuestQuest({ quest: p.currentLocation.questGiver.quest })
      );
      return [
        `I accept ${p.currentLocation.questGiver.quest.title}`,
        p.currentLocation.questGiver.quest.description,
        p.currentLocation.questGiver.quest.instructions
      ];
    }

    const active = p.quests.quests
      .filter(q => !q.isComplete())
      .flatMap(q => [q.quest.title, q.quest.instructions]);

    return active.length
      ? active
      : [
          "I have not taken on any quests lately, am I a coward? Lazy? I think not! Forth I go to collect and complete quests!"
        ];
  }

  function rest(p, _params) {
    if (p.isInRoom || p.isInside) {
      return ["I cannot rest here."];
    }

    if (p.currentLocation.hasMarket) {
      p.attributes.resetStats();
      return [
        `Resting at the ${
          p.currentLocation.name
        } Inn. The bed was hard, the bread was hard, and my coin purse seems softer.`
      ];
    }
    return [
      `${
        p.currentLocation.name
      } does not have an Inn. I must find a place with a Market to find an Inn and rest.`
    ];
  }

  function unequip(p, what) {
    const armor = p.equipment.tryGetArmorFromName(what);
    if (armor) {
      return [p.unequipArmor(armor)];
    }

    if (
      p.equipment.weapon &&
      p.equipment.weapon.name.toLowerCase() === what.toLowerCase()
    ) {
      return [p.unequipWeapon(p.equipment.weapon)];
    }

    return [`I do not have a(n) ${what} to unequip`];
  }

  function use(p, what) {
    // Can only use potions at the moment
    const potion = p.inventory[INVENTORY_SLOTS.Potion].find(
      p => p.name.toLowerCase() === what.toLowerCase()
    );
    if (potion) {
      if (p.isInCombat) {
        return [
          p.usePotion(potion, p.savedTarget),
          ...postPlayerCombatAction(p, p.savedTarget)
        ];
      }
      return [p.usePotion(potion)];
    }
  }

  function whereami(p, _params) {
    if (p.currentRoom && p.isInRoom) {
      return [
        `I am in ${p.currentRoom.name} and I can go to the following rooms.`
      ]
        .concat(p.currentRoom.linkedRoom.map(r => r.name))
        .concat([
          p.currentRoom.isExit
            ? `I may also exit from this room to ${p.currentLocation.name}`
            : "I may not exit from this room."
        ]);
    }
    return [
      `I am in ${p.currentArea.name} and I may go to the following places.`,
      ...p.currentArea.locations.map(l => l.name),
      p.currentLocation.rooms && p.currentLocation.rooms.length
        ? `${p.currentLocation.name} also has an entrance at ${
            p.currentLocation.rooms.find(r => r.isExit).name
          }`
        : "There are no rooms to go to.",
      p.currentLocation.isExit
        ? "I may also travel to further areas. I should check my map"
        : "There is no other areas to which I can travel from here."
    ];
  }

  const ACTIONS = {
    attack,
    buy,
    cast,
    equip,
    exit,
    explore,
    go,
    map,
    quest,
    rest,
    unequip,
    use,
    whereami
  };

  function help(_p, _) {
    return ["Here is what I can possibly do.", ...Object.keys(ACTIONS)];
  }

  ACTIONS.help = help;

  function save({ Player }, slotName = "autosave") {
    const playerKey = `${slotName}:player`;

    localStorage.setItem(playerKey, JSON.stringify(Player));
  }

  function load(slotName = "autosave") {
    const playerKey = `${slotName}:player`;

    let PlayerObj = localStorage.getItem(playerKey);
    if (PlayerObj) {
      PlayerObj = JSON.parse(PlayerObj);

      const Player = wop_player({
        ...PlayerObj,
        spells: PlayerObj.spells.map(spell => allSpells[spell.name])
      });

      Player.inventory[INVENTORY_SLOTS.Potion] = Player.inventory[
        INVENTORY_SLOTS.Potion
      ].map(potion => allPotions[potion.name].clone());

      Player.savedTarget = Player.savedTarget
        ? Player.currentLocation.monsters.find(
            m => m.fullName === Player.savedTarget.fullName
          )
        : null;

      return { Player };
    }
    throw new Error(`No player for slot ${slotName}`);
  }

  function addNewSpell(spellName) {
    const spell = allSpells[spellName];
    if (spell) {
      const { Player } = load();
      Player.spells.push({ ...spell, name: spellName });
      save({ Player });
    }
  }

  function doCommand(parameters) {
    const { Player } = load();
    let messages = [];
    const originalParameters = parameters;


    try {
      const uncompletedQuests = Player.quests.quests.filter(q => !q.isComplete());

      if (parameters.includes(" ")) {
        const params = parameters.split(" ");
        parameters = params.splice(0, 1)[0];
        messages = messages.concat(
          ACTIONS[parameters](Player, params.join(" "))
        );
      } else {
        messages = messages.concat(
          ACTIONS[parameters](Player, null)
        );
      }

      const completedQuests = uncompletedQuests.filter(q => q.isComplete());
      const achievements = completedQuests.map(q => wop_achievement({
        name: 'Quest Completed',
        description: `Completed the quest: ${q.quest.title}. ${q.quest.description}. ${q.quest.instructions}`,
      }));

      Player.achievements = Player.achievements.concat(achievements);
    } catch (err) {
      messages = messages
        .concat([`I do not know how to ${originalParameters}`])
        .concat(help());
      console.error(err);
    } finally {
      save({ Player });
    }

    return JSON.stringify({
      player: playerBridge(Player),
      messages,
    });
  }

  function getPlayer(slotName = "autosave") {
    try {
      const { Player } = load(slotName);
      return JSON.stringify(playerBridge(Player));
    } catch (error) {
      return null;
    }
  }

  function createPlayer(playerName) {
    const currentWorld = createWorld();
    save({
      Player: wop_player({
        name: playerName,
        title: "Adventurer",
        description: "I am a mighty adventurer!",
        currentWorld,
        currentArea: currentWorld.areas[0],
        currentLocation: currentWorld.areas[0].locations[0],
        spells: [
          allSpells["Healing Touch"],
          allSpells["Fire Spit"],
        ],
      }),
    });
  }

  function getBuyList() {
    const { Player } = load();
    return JSON.stringify({
      player: playerBridge(Player),
      messages: Player.currentLocation.market
        ? Player.currentLocation.market.inventory
            .allItems()
            .map(({ name, value }) => `${name}&${value}`)
        : []
    });
  }

  return {
    getBuyList,
    save,
    load,
    doCommand,
    createPlayer,
    getPlayer,
    addNewSpell
  };
}
