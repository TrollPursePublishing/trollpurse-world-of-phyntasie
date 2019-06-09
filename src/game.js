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
  if(roll > oneThroughFive) {
    const index = Math.floor(Math.random() * Math.floor(p.currentLocation.monsters.length));
    const monster = p.currentLocation.monsters[index];
    return p.engage(monster);
  }
  return 'All seems quiet here.';
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
  return [
    'I am not in combat right now'
  ];
}

function buy(p, itemName, gameContext) {
  if (p.isInCombat || p.isInside) {
    return ['I cannot purchase anything at this time.'];
  }

  const market = gameContext.markets[p.navigation.currentLocation.id];

  if (market) {
    const item = market.inventory.getItem(itemName);
    if (item) {
      return [p.buyItem(item)];
    }
    return [
      'I can buy the following.',
      ...market.getAllItems().map(item => item.name),
    ];
  } else {
    return ['There is no market where I am at.'];
  }
}

function cast(p, spellName, gameContext) {
  const spell = p.spells.find(spell => spell.name.toLowerCase() === spellName.toLowerCase());
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
    return ['I cannot leave while in combat.'];
  }

  if (p.currentRoom) {
    if (p.currenRoom.isExit) {
      p.isInside = false;
      p.expireRoom = true;

      const result = [
        `Leaving ${p.currentRoom.name}.`,
        `Arriving at ${p.currentLocation.name}`,
        p.currentLocation.description,
      ];

      if (p.currentLocation.questGiver) {
        result.push(`${p.currentLocation.questGiver} is here.`);
        result.push(p.currentLocation.questGiver.description);
      }

      p.currentRoom = null;

      return result;
    }
    return ['There is no exit here. I must keep moving.'];
  }
}

function explore(p, _, gameContext) {
  if (p.isInCombat) {
    return ['I cannot explore while in combat.'];
  }

  if (p.isInside) {
    if (Math.random() <= p.currentRoom.chanceForRelic) {
      const index = Math.floor(Math.random() * Math.floor(gameContext.relics.length));
      return [p.addItemToInventory(gameContext.relics[index])];
    } else {
      const index = Math.floor(Math.random() * Math.floor(p.currentLocation.monsters.length));
      const monster = p.currentLocation.monsters[index];
      return [p.engage(monster)];
    }
  }

  return ['I can only explore in rooms.'];
}

function go(p, where, _gameContext) {
  if(p.isInCombat) {
    return ['I cannot go anywhere when in combat.'];
  }

  if (p.currentRoom && player.isInside) {
    if (p.currentRoom.linkedRoom && p.currentRoom.linkedRoom.length) {
      const destination = player.currentRoom
        .linkedRoom
        .find(room => room.name.toLowerCase() === where.toLowerCase());
      if(destination) {
        p.currentRoom = destination;
        return [ 
          p.onMove(destination),
          rollEncounter(p, 1),
        ];
      }
    }
    return [`${where} is not a room I may go to.`];
  } else if (!p.currentRoom) {
    if(p.currentLocation.rooms && p.currentLocation.rooms.length) {
      const destination = p.currentLocation.rooms
        .find(room => room.name.toLowerCase() === where.toLowerCase());
      if(destination) {
        p.currentRoom = destination;
        p.isInside = true;
        return [ 
          p.onMove(destination),
          rollEncounter(p, 1),
        ];
      }
    }

    let destination = p.currentArea.locations
      .find(location => location.name.toLowerCase() === where.toLowerCase());
    if(destination) {
      const results = [p.onMove(destination)];
      p.currentLocation = destination;
      if(destination.questGiver && destination.questGiver.canDoQuest(p)) {
        results.push(`${destination.questGiver.name} is here. ${destination.questGiver.description}`);
      }
      results.push(rollEncounter(p, 3));
      return results;
    }

    destination = p.currentWorld.areas
      .find(area => area.name.toLowerCase() === where.toLowerCase());
    if(destination) {
      if(p.currentLocation.isExit) {
        p.currentArea = destination;
        p.currentLocation = p.currentArea.find(area => area.isExit);
        return [p.onMove(destination)];
      }
      return [`${p.currentLocation} is not a location from which I can depart.`];
    }
  }

  return [`I do not know where ${where} is.`];
}

function map(p, _params, _gameContext) {
  return p.currentWorld.areas.map(area => area.name);
}

function quest(p, start, _gameContext) {
  if(start.toLowerCase() === 'start') {
    const cannotDo = ['There are no quest givers here.'];
    if(!p.currentLocation.questGiver) {
      return cannotDo;
    }
    if(!p.currentLocation.questGiver.canDoQuest(p)) {
      return cannotDo;
    }
    const accepted = p.quests.quests.find(q => q.quest.title === p.currentLocation.questGiver.quest.title);
    if(accepted) {
      if(accepted.isComplete) {
        return [`I have already completed ${accepted.title}`];
      }
      return [`I have already accepted ${accepted.title}`];
    }

    p.quests.quests.push(playerQuestQuest(player.currentLocation.questGiver.quest));
    return [
      `I accept ${p.currentLocation.questGiver.quest.title}`,
      p.currentLocation.questGiver.quest.description,
      p.currentLocation.questGiver.quest.instructions,
    ];
  }

  const active = p.quests.quests
    .filter(q => !q.isComplete)
    .flatMap(q => [q.quest.title, ...q.quest.instructions]);
  
  active.length ? active : 'I have not taken on any quests lately, am I a coward? Lazy? I think not! Forth I go to collect and complete quests!';
}

function rest(p, _params, _gameContext) {
  if(p.currentLocation.hasMarket) {
    p.attributes.resetStats();
    return [`Resting at the ${p.currentLocation.name} Inn. The bed was hard, the bread was hard, and my coin purse seems softer.`];
  }
  return [`${p.currentLocation.name} does not have an Inn. I must find a place with a Market to find an Inn and rest.`];
}

function unequip(p, what, gameContext) {

}

function use(p, what, gameContext) {

}

function whereAmI(p, _params, _gameContext) {

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
  whereAmI,
};

function help(_p, _, _gameContext) {
  return [
    'Here is what I can possibly do.',
    ...Object.keys(ACTIONS),
    'help',
  ];
}

ACTIONS.help = help;

function doCommand(parameters) {
  const GameContext = localStorage.getItem('gameContext')
  ? JSON.parse(localStorage.getItem('gameContext'))
  : defaultGameContext();

  const Player = localStorage.getItem('player')
    ? JSON.parse(localStorage.getItem('player'))
    : player({
      currentLocation: GameContext.area[0].location[0],
      currentArea: GameContext.area[0],
      currentWorld: GameContext.world,
    });

  let messages = [];
  try {
    if (parameters.includes(' ')) {
      parameters = parameters.split(' ');
    } else {
      messages = ACTIONS[parameters](Player, null, GameContext);
    }
    messages = ACTIONS[parameters[0]](Player, parameters[1], GameContext);
  } catch (_err) {
    return {
      player: Player,
      messages: [`I do not know how to ${parameters}`, ...help()],
    };
  }

  localStorage.setItem('player', Player);
  localStorage.setItem('gameContext', GameContext);

  return {
    player: Player,
    messages,
  };
}
