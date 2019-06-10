// Begin Utility functions
function postPlayerCombatAction(p, targetPlayer, gameContext) {
  const result = [];
  if (targetPlayer.currentHealth > 0) {
    result.push(targetPlayer.attack(p));
    if (p.currentHealth <= 0) {
      results.push(p.onDeath());
      results.push(p.onCombatOver(targetPlayer));
      results.push(p.onRevive());
      p.currentWorld = gameContext.world;
      p.currentArea = p.currentWorld.areas[0];
      p.currentLocation = p.currentArea.locations[0];
    }
  } else {
    result.push(targetPlayer.onDeath());
    targetPlayer.onRevive(); //Do not post this message.
    result.push(p.onCombatOver(targetPlayer));
  }
  result;
}

function rollEncounter(p, oneThroughFive) {
  const roll = Math.floor(Math.random() * Math.floor(5));
  if (roll > oneThroughFive) {
    const index = Math.floor(
      Math.random() * Math.floor(p.currentLocation.monsters.length)
    );
    const monster = p.currentLocation.monsters[index];
    return p.engage(monster);
  }
  return "All seems quiet here.";
}
// End Utility functions

function attack(p, _, gameContext) {
  if (p.isInCombat) {
    const targetPlayer = p.savedTarget;
    const result = [];
    result.push(p.attack(targetPlayer));
    result.concat(postPlayerCombatAction(p, targetPlayer, gameContext));
    return result;
  }
  return ["I am not in combat right now"];
}

function buy(p, itemName, gameContext) {
  if (p.isInCombat || p.isInside) {
    return ["I cannot purchase anything at this time."];
  }

  const market = gameContext.markets[p.navigation.currentLocation.id];

  if (market) {
    const item = market.inventory.getItem(itemName);
    if (item) {
      return [p.buyItem(item)];
    }
    return [
      "I can buy the following.",
      ...market.getAllItems().map(item => item.name)
    ];
  } else {
    return ["There is no market where I am at."];
  }
}

function cast(p, spellName, gameContext) {
  const spell = p.spells.find(
    spell => spell.name.toLowerCase() === spellName.toLowerCase()
  );
  if (spell) {
    const result = [];
    if (p.isInCombat) {
      const targetPlayer = p.savedTarget;
      result.push(p.castSpell(spell, targetPlayer));
      result.concat(postPlayerCombatAction(p, targetPlayer, gameContext));
    } else {
      result.push(p.castSpell(spell));
    }
    return result;
  }
  return [`I do not know how to cast ${spellName}`];
}

function equip(p, itemName, _gameContext) {
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

function exit(p, _params, _gameContext) {
  if (p.isInCombat) {
    return ["I cannot leave while in combat."];
  }

  if (p.currentRoom) {
    if (p.currenRoom.isExit) {
      p.isInside = false;
      p.expireRoom = true;

      const result = [
        `Leaving ${p.currentRoom.name}.`,
        `Arriving at ${p.currentLocation.name}`,
        p.currentLocation.description
      ];

      if (p.currentLocation.questGiver) {
        result.push(`${p.currentLocation.questGiver} is here.`);
        result.push(p.currentLocation.questGiver.description);
      }

      p.currentRoom = null;

      return result;
    }
    return ["There is no exit here. I must keep moving."];
  }
}

function explore(p, _, gameContext) {
  if (p.isInCombat) {
    return ["I cannot explore while in combat."];
  }

  if (p.isInside) {
    if (Math.random() <= p.currentRoom.chanceForRelic) {
      const index = Math.floor(
        Math.random() * Math.floor(gameContext.relics.length)
      );
      return [p.addItemToInventory(gameContext.relics[index])];
    } else {
      const index = Math.floor(
        Math.random() * Math.floor(p.currentLocation.monsters.length)
      );
      const monster = p.currentLocation.monsters[index];
      return [p.engage(monster)];
    }
  }

  return ["I can only explore in rooms."];
}

function go(p, where, _gameContext) {
  if (p.isInCombat) {
    return ["I cannot go anywhere when in combat."];
  }

  if (p.currentRoom && player.isInside) {
    if (p.currentRoom.linkedRoom && p.currentRoom.linkedRoom.length) {
      const destination = player.currentRoom.linkedRoom.find(
        room => room.name.toLowerCase() === where.toLowerCase()
      );
      if (destination) {
        p.currentRoom = destination;
        return [p.onMove(destination), rollEncounter(p, 1)];
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
        p.currentLocation = p.currentArea.find(area => area.isExit);
        return [p.onMove(destination)];
      }
      return [
        `${p.currentLocation} is not a location from which I can depart.`
      ];
    }
  }

  return [`I do not know where ${where} is.`];
}

function map(p, _params, _gameContext) {
  return p.currentWorld.areas.map(area => area.name);
}

function quest(p, start, _gameContext) {
  if (start.toLowerCase() === "start") {
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
      if (accepted.isComplete) {
        return [`I have already completed ${accepted.title}`];
      }
      return [`I have already accepted ${accepted.title}`];
    }

    p.quests.quests.push(
      playerQuestQuest(player.currentLocation.questGiver.quest)
    );
    return [
      `I accept ${p.currentLocation.questGiver.quest.title}`,
      p.currentLocation.questGiver.quest.description,
      p.currentLocation.questGiver.quest.instructions
    ];
  }

  const active = p.quests.quests
    .filter(q => !q.isComplete)
    .flatMap(q => [q.quest.title, ...q.quest.instructions]);

  active.length
    ? active
    : "I have not taken on any quests lately, am I a coward? Lazy? I think not! Forth I go to collect and complete quests!";
}

function rest(p, _params, _gameContext) {
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

function unequip(p, what, _gameContext) {
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

function use(p, what, gameContext) {
  // Can only use potions at the moment
  const potion = p.inventory[INVENTORY_SLOTS.Potion].find(
    p => p.name.toLowerCase() === what.toLowerCase()
  );
  if (potion) {
    if (p.isInCombat) {
      return [
        p.usePotion(potion, p.savedTarget),
        postPlayerCombatAction(p, p.savedTarget, gameContext)
      ];
    }
    return [p.usePotion(potion)];
  }
}

function whereami(p, _params, _gameContext) {
  if (p.currentRoom && p.isInRoom) {
    return [`I am in ${p.currentRoom.name} and I can go to the following rooms.`]
      .concat(p.currentRoom.linkedRoom.map(r => r.name))
      .concat([
        p.currentRoom.isExit
          ? `I may also exit from this room to ${p.currentLocation.name}`
          : 'I may not exit from this room.'
      ])
  }
  return [
    `I am in ${p.currentArea.name} and I may go to the following places.`,
    ...p.currentArea.locations.map(l => l.name),
    p.currentLocation.rooms && p.currentLocation.rooms.length
      ? `${p.currentLocation} also has an entrance at ${p.currentLocation.rooms.find(r => r.isExit).name}`
      : 'There are no rooms to go to.',
    p.currentLocation.isExit
      ? 'I may also travel to further areas. I should check my map'
      : 'There is no other areas to which I can travel from here.',
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

function help(_p, _, _gameContext) {
  return ["Here is what I can possibly do.", ...Object.keys(ACTIONS), "help"];
}

ACTIONS.help = help;

function save({ Player, GameContext }, slotName = 'autosave') {
  const contextKey = `${slotName}:gameContext`;
  const playerKey = `${slotName}:player`;

  localStorage.setItem(playerKey, JSON.stringify(Player));
  localStorage.setItem(contextKey, JSON.stringify(GameContext));
}

function load(slotName = 'autosave') {
  const contextKey = `${slotName}:gameContext`;
  const playerKey = `${slotName}:player`;

  const GameContext = localStorage.getItem(contextKey)
    ? JSON.parse(localStorage.getItem(contextKey))
    : defaultGameContext();

  const Player = localStorage.getItem(playerKey)
    ? JSON.parse(localStorage.getItem(playerKey))
    : player({
        name: "Newb Porax",
        currentLocation: GameContext.areas[0].locations[0],
        currentArea: GameContext.areas[0],
        currentWorld: GameContext.world
    });

  return { GameContext, Player };
}

function doCommand(parameters) {
  const { GameContext, Player } = load();
  const messages = [];

  try {
    if (parameters.includes(" ")) {
      parameters = parameters.split(" ");
    } else {
      messages.concat(ACTIONS[parameters](Player, null, GameContext));
    }
    messages.concat(ACTIONS[parameters[0]](Player, parameters[1], GameContext));
  } catch (_err) {
    messages.push(`I do not know how to ${parameters}`).concat(help());
  } finally {
    save({ GameContext, Player });
  }

  return {
    player: Player,
    messages
  };
}
