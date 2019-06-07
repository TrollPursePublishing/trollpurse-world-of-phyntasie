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

function equip(p, itemName, gameContext) {
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

function exit(p, _, gameContext) {
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

function go(p, where, gameContext) {

}

const ACTIONS = {
  attack,
  buy,
  cast,
  equip,
  exit,
  explore,
  go,
};

function doCommand(parameters) {
  const GameContext = localStorage.getItem('gameContext')
  ? JSON.parse(localStorage.getItem('gameContext'))
  : defaultGameContext();

const Player = localStorage.getItem('player')
  ? JSON.parse(localStorage.getItem('player'))
  : player();

  let messages = [];
  if (parameters.includes(' ')) {
    parameters = parameters.split(' ');
  } else {
    messages = ACTIONS[parameters](Player, null, GameContext);
  }
  messages = ACTIONS[parameters[0]](Player, parameters[1], GameContext);

  localStorage.setItem('player', Player);
  localStorage.setItem('gameContext', GameContext);

  return {
    player: Player,
    messages,
  };
}
