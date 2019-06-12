"use strict";

function wop_models() {
  function wop_id() {
    return (
      "id" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  function wop_acheivement({
    name,
    description,
    player,
    id = name + wop_id()
  }) {
    return {
      id,
      name,
      description,
      time: new Date(),
      player
    };
  }

  function wop_area({
    name,
    description,
    locations = [],
    imagePath = "none",
    id = name + wop_id()
  }) {
    return {
      id,
      name,
      description,
      locations: locations.map(l => wop_location(l)),
      imagePath
    };
  }

  const ARMOR_TYPES = {
    Head: 0,
    Torso: 1,
    Arm: 2,
    Legs: 3,
    Feet: 4
  };

  ARMOR_TYPES.VALUES = Object.keys(ARMOR_TYPES).map(function(key) {
    return ARMOR_TYPES[key];
  });

  const ARMOR_SLOTS = {
    Head: "head",
    Torso: "torso",
    Arm: "arm",
    Legs: "legs",
    Feet: "feet"
  };

  ARMOR_SLOTS.VALUES = Object.keys(ARMOR_SLOTS).map(function(key) {
    return ARMOR_SLOTS[key];
  });

  function wop_armor({
    name,
    type,
    armorRating,
    durability,
    value,
    description,
    slot = INVENTORY_SLOTS.Armor,
    id = name + wop_id()
  }) {
    return {
      id,
      name,
      type,
      armorRating,
      durability,
      value,
      description,
      slot,
      clone: () =>
        wop_armor({
          name,
          type,
          armorRating,
          durability,
          value,
          description,
          slot
        })
    };
  }

  function wop_weapon({
    name,
    description,
    damage,
    criticalDamage,
    durability,
    stanimaCost,
    value,
    slot = INVENTORY_SLOTS.Weapon,
    id = name + wop_id()
  }) {
    return {
      id,
      name,
      damage,
      description,
      criticalDamage,
      durability,
      stanimaCost,
      value,
      slot,
      clone: () =>
        wop_weapon({
          name,
          damage,
          description,
          criticalDamage,
          durability,
          stanimaCost,
          value,
          slot
        })
    };
  }

  function wop_equipment({
    arm = null,
    head = null,
    torso = null,
    legs = null,
    feet = null,
    weapon = null,
    id = wop_id()
  }) {
    const instance = {
      id,
      arm: wop_armor(arm || {}),
      head: wop_armor(head || {}),
      torso: wop_armor(torso || {}),
      legs: wop_armor(legs || {}),
      feet: wop_armor(feet || {}),
      weapon: wop_weapon(weapon || {})
    };

    instance.tryGetArmorFromName = function(armorName) {
      const match = armorName.toLowerCase();
      function m(field) {
        return field && field.name.toLowerCase() === match ? field : null;
      }
      return (
        m(instance.arm) ||
        m(instance.head) ||
        m(instance.torso) ||
        m(instance.legs) ||
        m(instance.feet)
      );
    };

    return instance;
  }

  function wop_event({ title, description }) {
    return {
      Id: title + wop_id(),
      when: new Date(),
      title,
      description
    };
  }

  const INVENTORY_SLOTS = {
    Armor: "armors",
    Potion: "potions",
    Weapon: "weapons",
    Relic: "relics"
  };

  INVENTORY_SLOTS.VALUES = Object.keys(INVENTORY_SLOTS).map(function(key) {
    return INVENTORY_SLOTS[key];
  });

  function wop_inventory({
    armors = [],
    potions = [],
    weapons = [],
    relics = [],
    gold = 1000
  }) {
    const instance = {
      [INVENTORY_SLOTS.Armor]: armors.map(a => wop_armor(a)),
      [INVENTORY_SLOTS.Potion]: potions.map(p => wop_potion(p)),
      [INVENTORY_SLOTS.Weapon]: weapons.map(w => wop_weapon(w)),
      [INVENTORY_SLOTS.Relic]: relics.map(r => wop_relic(r)),
      gold
    };

    instance.getItem = function(itemName) {
      return instance
        .allItems()
        .find(item => item.name.toLowerCase() === itemName.toLowerCase());
    };

    instance.allItems = function() {
      return [
        ...instance[INVENTORY_SLOTS.Armor],
        ...instance[INVENTORY_SLOTS.Potion],
        ...instance[INVENTORY_SLOTS.Weapon]
      ];
    };
    return instance;
  }

  function wop_location({
    name,
    description,
    rooms = [],
    monsters = [],
    isExit = false,
    questGiver = null,
    id = name + wop_id(),
    market = null
  }) {
    return {
      id,
      name,
      description,
      rooms: rooms.map(r => wop_room(r)),
      monsters: monsters.map(m => wop_player(m)),
      isExit,
      market: market ? wop_market(market) : null,
      hasMarket: market !== null && market !== undefined,
      questGiver: questGiver ? wop_questGiver(questGiver) : null
    };
  }

  function wop_market({ inventory, locationIAmIn }) {
    return {
      inventory: wop_inventory(inventory || {}),
      locationIAmIn
    };
  }

  const QUEST_TYPE = {
    GoTo: 0,
    Collect: 1,
    Kill: 2
  };

  QUEST_TYPE.VALUES = Object.keys(QUEST_TYPE).map(function(key) {
    return QUEST_TYPE[key];
  });

  const PLAYER_STATE = {
    Dead: 0,
    Alive: 1
  };

  PLAYER_STATE.VALUES = Object.keys(PLAYER_STATE).map(function(key) {
    PLAYER_STATE[key];
  });

  function wop_playerAttribute({
    currentStrength = 5,
    currentMana = 10,
    currentStamina = 10,
    currentToughness = 2,
    currentHealth = 12,
    strength = 5,
    mana = 10,
    stanima = 10,
    toughness = 2,
    health = 12,
    state = PLAYER_STATE.Alive,
    experience = 0
  }) {
    const instance = {
      Id: wop_id(),
      strength,
      mana,
      stanima,
      toughness,
      health,
      state,
      currentStrength,
      currentMana,
      currentStamina,
      currentToughness,
      currentHealth,
      experience
    };

    function quadratic_polynomial(a, x) {
      return a * Math.pow(x, 2) + a * x + a;
    }

    function cubic_polynomial(a, x) {
      return a + Math.pow(x, 3) + a * Math.pow(x, 2) + a * x + a;
    }

    instance.resetStats = function() {
      instance.currentHealth = instance.health;
      instance.currentMana = instance.mana;
      instance.currentStanima = instance.stanima;
      instance.currentStrength = instance.strength;
      instance.currentToughness = instance.toughness;
    };

    instance.addExperience = function(value) {
      instance.experience = Math.max(0, instance.experience + value);
      console.log(
        `Power Level: ${instance.level()} / Experience: ${instance.experience}`
      );
      const experienceNeeded = cubic_polynomial(100, instance.level());
      console.log(`Experience Needed for Level Up: ${experienceNeeded}`);
      if (experienceNeeded < instance.experience) {
        instance.levelUp();
      }
    };

    instance.levelUp = function() {
      console.log(
        `Old Stats: ${instance.health}/${instance.mana}/${instance.strength}/${
          instance.toughness
        }`
      );

      instance.health = cubic_polynomial(12, instance.health);
      instance.mana = cubic_polynomial(10, instance.mana);
      instance.stanima = quadratic_polynomial(10, instance.stanima);
      instance.strength = quadratic_polynomial(5, instance.strength);
      instance.toughness = cubic_polynomial(2, instance.toughness);

      console.log(
        `New Stats: ${instance.health}/${instance.mana}/${instance.strength}/${
          instance.toughness
        }`
      );
      instance.resetStats();
    };

    instance.level = function() {
      function magnitude(vector2) {
        return Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1]);
      }

      const power = magnitude([instance.strength, instance.stanima]);
      const potency = magnitude([instance.mana, instance.strength]);
      const durability = magnitude([instance.toughness, instance.health]);

      return Math.floor(
        magnitude([magnitude([power, potency]), durability]) / 10
      );
    };

    return instance;
  }

  function wop_playerQuestQuest({ quest, count = 0, complete = false }) {
    return {
      id: wop_id(),
      quest,
      count,
      complete
    };
  }

  function wop_playerQuests({ quests = [] }) {
    return {
      id: wop_id(),
      quests
    };
  }

  function wop_potion({
    name,
    description,
    value,
    slot = INVENTORY_SLOTS.Potion,
    apply = function(_instigator, _target) {
      return "An empty bottle!";
    },
    id = wop_id()
  }) {
    return {
      id,
      name,
      description,
      value,
      slot,
      apply,
      clone: () => wop_potion({ name, description, value, slot, apply })
    };
  }

  function wop_quests({
    title,
    description,
    gold,
    instructions,
    type,
    nameOfObject,
    countNeeded,
    nextQuest = null,
    id = wop_id()
  }) {
    const instance = {
      title,
      description,
      gold,
      instructions,
      type,
      nameOfObject,
      countNeeded,
      nextQuest,
      id
    };

    instance.isComplete = function(currentCount) {
      return currentCount >= instance.countNeeded;
    };
  }

  function wop_questGiver({
    quest,
    name,
    description,
    questsToUnlockThisQuestGiver = null,
    id = wop_id()
  }) {
    const instance = {
      id,
      quest,
      name,
      description,
      questsToUnlockThisQuestGiver
    };

    instance.canDoQuest = function(player) {
      if (instance.questsToUnlockThisQuestGiver) {
        const completed = player.quests.quests
          .filter(q => q.complete)
          .map(q => q.name);
        if (completed) {
          return instance.questsToUnlockThisQuestGiver.every(q =>
            completed.includes(q.name)
          );
        }
        return false;
      }
      return true;
    };
  }

  function wop_player({
    name,
    title = "",
    isInRoom = false,
    currentLocation = null,
    currentArea = null,
    currentRoom = null,
    currentWorld = null,
    inventory = null,
    spells = [],
    attributes = null,
    equipment = null,
    savedTarget = null,
    isInCombat = false,
    isInside = false,
    expireRoom = false,
    quests = null,
    myTurn = false,
    placesVisited = [],
    areasDiscovered = 0,
    description = "",
    id = wop_id(),
    joinDate = new Date(),
    monstersSlain = 0
  }) {
    const instance = {
      id,
      name,
      title,
      isInRoom,
      currentLocation: currentLocation ? wop_location(currentLocation) : null,
      currentArea: currentArea ? wop_area(currentArea) : null,
      currentRoom: currentRoom ? wop_room(currentRoom) : null,
      currentWorld: currentWorld ? wop_world(currentWorld) : null,
      description,
      inventory: wop_inventory(inventory || {}),
      spells,
      attributes: wop_playerAttribute(attributes || {}),
      equipment: wop_equipment(equipment || {}),
      savedTarget,
      isInCombat,
      isInside,
      expireRoom,
      quests: wop_playerQuests(quests || {}),
      myTurn,
      placesVisited,
      areasDiscovered,
      fullName: `${title} ${name}`,
      joinDate,
      monstersSlain
    };

    instance.onRevive = function() {
      instance.state = PLAYER_STATE.Alive;
      instance.attributes.resetStats();
      instance.inventory.gold = instance.inventory.gold / 2;
      instance.inventory.relics = [];
      instance.inventory.potions = [];
      instance.attributes.addExperience(-10 * instance.attributes.level());
      instance.expireRoom = true;
      return `${instance.fullName} has been revived by the magic of the world.`;
    };

    instance.onDeath = function() {
      instance.attributes.state = PLAYER_STATE.Dead;
      instance.isInCombat = false;
      instance.isInside = false;
      instance.myTurn = false;
      return `${
        instance.fullName
      } has been slain by the misfortunes of this world`;
    };

    instance.onMove = function(where) {
      if (instance.currentRoom != null) {
        const quest = instance.quests.quests.find(
          q =>
            !q.complete &&
            q.quest.type === QUEST_TYPE.GoTo &&
            q.quest.nameOfObject === instance.currentRoom.name
        );

        if (quest) {
          quest.count = quest.count + 1;
        }
      }

      let qq = instance.quests.quests.find(
        q =>
          !q.complete &&
          q.quest.type === QUEST_TYPE.GoTo &&
          q.quest.nameOfObject === instance.currentLocation.name
      );
      if (!qq) {
        qq = instance.quests.quests.find(
          q =>
            !q.complete &&
            q.quest.type === QUEST_TYPE.GoTo &&
            q.quest.nameOfObject === instance.currentArea.name
        );
      }

      if (qq) {
        qq.count = qq.count + 1;
      }

      if (!instance.placesVisited.includes(where.name)) {
        instance.areasDiscovered = instance.placesVisited.push(where.name);
      }

      return `I move forth to ${where.name}. ${where.description}`;
    };

    instance.addItemToInventory = function(item) {
      instance.inventory[item.slot].push(item);
      if (item.slot === INVENTORY_SLOTS.Relic) {
        const quest = instance.quests.quests.find(
          q =>
            !quest.complete &&
            q.quest.type === QUEST_TYPE.Collect &&
            q.quest.nameOfObject === item.name
        );

        if (quest) {
          quest.count = quest.count + 1;
        }
      }
      return `${item.name} added to inventory. ${item.description}`;
    };

    instance.buyItem = function(item) {
      if (instance.inventory.gold >= item.value) {
        instance.inventory.gold = instance.inventory.gold - item.value;
        instance.addItemToInventory(item);
        return `Purchased ${item.name} for ${item.value}. I have ${
          instance.inventory.gold
        } gold left.`;
      } else {
        return `I cannot afford this! I need ${item.value -
          instance.inventory.gold} more gold.`;
      }
    };

    instance.removeItemFromInventory = function(item) {
      instance.inventory[item.slot] = instance.inventory[item.slot].filter(
        i => i.id !== item.id
      );
      if (item.slot === INVENTORY_SLOTS.Relic) {
        const quest = instance.quests.quests.find(
          q =>
            !quest.complete &&
            q.quest.type === QUEST_TYPE.Collect &&
            q.quest.nameOfObject === item.name
        );

        if (quest) {
          quest.count = quest.count - 1;
        }
      }
      return `${item.name} removed from inventory.`;
    };

    instance.equipWeapon = function(weapon) {
      const old = instance.equipment.weapon;
      instance.equipment.weapon = weapon;
      instance.addItemToInventory(old);
      instance.removeItemFromInventory(weapon);
      return `${
        old ? instance.addItemToInventory(old) : ""
      } ${instance.removeItemFromInventory(weapon)} Equipped weapon ${
        weapon.name
      }.`;
    };

    instance.equipArmor = function(armor) {
      const old = instance.equipment[armor.slot];
      instance.equipment[armor.slot] = armor;
      return `${
        old ? instance.addItemToInventory(old) : ""
      } ${instance.removeItemFromInventory(armor)} Equipped armor ${old.name}`;
    };

    instance.unequipArmor = function(armor) {
      const old = instance.equipment[armor.slot];
      instance.equipment[armor.slot] = null;
      return `${instance.addItemToInventory(old)} Unequipped armor ${old.name}`;
    };

    instance.unequipWeapon = function(_weapon) {
      const old = instance.equipment.weapon;
      instance.equipment.weapon = null;
      return `${instance.addItemToInventory(old)} Unequipped weapon ${
        old.name
      }`;
    };

    instance.castSpell = function(spell, target) {
      if (instance.attributes.currentMana >= spell.manaCost) {
        instance.savedTarget = target;
        const spellText = spell.apply(instance, target);
        instance.attributes.currentMana =
          instance.attributes.currentMana - spell.manaCost;
        return spellText;
      }
      return `${instance.attributes.currentMana} is not enough mana to cast ${
        spell.name
      }.`;
    };

    instance.attack = function(target) {
      instance.savedTarget = target;

      if (
        instance.equipment.weapon &&
        instance.equipment.weapon.durability > 0 &&
        instance.attributes.currentStanima > instance.equipment.weapon.stanimaCost
      ) {
        instance.equipment.weapon.durability =
          instance.equipment.weapon.durability - 1;
        instance.attributes.currentStanima =
          instance.attributes.currentStanima -
          instance.equipment.weapon.stanimaCost;
        return target.defend(
          instance,
          instance.attributes.currentStrength,
          instance.equipment.weapon.damage
        );
      } else {
        return target.defend(instance, instance.attributes.currentStrength);
      }
    };

    instance.defend = function(
      instigator,
      physicalDamage = 1,
      weaponDamage = 0
    ) {
      instance.savedTarget = instigator;
      let totalArmorRating = 0;

      ARMOR_SLOTS.VALUES.forEach(slotName => {
        const armor = instance.equipment[slotName];
        if (armor && armor.durability > 0) {
          armor.durability = armor.durability - 1;
          totalArmorRating = totalArmorRating + armor.armorRating;
        }
      });

      weaponDamage = Math.max(0, weaponDamage - totalArmorRating);
      physicalDamage = Math.max(
        1,
        physicalDamage - instance.attributes.currentToughness
      );
      const totalDamage = weaponDamage + physicalDamage;
      instance.attributes.currentHealth =
        instance.attributes.currentHealth - totalDamage;

      return `${instigator.fullName} has caused ${totalDamage} pain to ${
        instance.fullName
      }. ${instance.fullName} has ${
        instance.attributes.currentHealth
      } health remaining.`;
    };

    instance.usePotion = function(potion, target) {
      if (target) {
        instance.savedTarget = target;
      }
      const potionText = potion.apply(this, target);
      return instance.removeItemFromInventory(potion) + " " + potionText;
    };

    instance.onCombatOver = function(target) {
      instance.savedTarget = null;
      instance.isInCombat = false;
      return `${instance.fullName} has disengaged combat from ${
        target.fullName
      }`;
    };

    instance.engage = function(target) {
      instance.savedTarget = target;
      instance.isInCombat = true;
      return `${instance.fullName} has engaged combat with ${target.fullName}. ${target.description}`;
    };

    return instance;
  }

  function wop_relic({
    name,
    description,
    value,
    slot = INVENTORY_SLOTS.Relic,
    id = wop_id()
  }) {
    return {
      name,
      description,
      value,
      slot,
      id
    };
  }

  const CARDINAL_POINTS = {
    North: 0,
    South: 1,
    East: 2,
    West: 3
  };

  CARDINAL_POINTS.VALUES = Object.keys(CARDINAL_POINTS).map(function(key) {
    return CARDINAL_POINTS[key];
  });

  function wop_room({
    name,
    description,
    isExit,
    chanceForRelic,
    linkedRoom = [],
    id = wop_id()
  }) {
    return {
      name,
      description,
      isExit,
      chanceForRelic,
      linkedRoom: linkedRoom.map(r => wop_room(r)),
      id
    };
  }

  function wop_spell({ name, description, manaCost, apply = null }) {
    return {
      name,
      description,
      manaCost,
      apply
    };
  }

  function wop_world({ name, description, areas = [], id = name + wop_id() }) {
    return {
      id,
      name,
      description,
      areas: areas.map(a => wop_area(a))
    };
  }

  return {
    wop_world,
    wop_spell,
    wop_room,
    wop_relic,
    wop_questGiver,
    wop_quests,
    wop_potion,
    wop_playerQuests,
    wop_playerQuestQuest,
    wop_playerAttribute,
    wop_player,
    wop_market,
    wop_location,
    wop_inventory,
    wop_event,
    wop_acheivement,
    wop_area,
    wop_armor,
    wop_weapon,
    wop_equipment,
    PLAYER_STATE,
    CARDINAL_POINTS,
    ARMOR_SLOTS,
    ARMOR_TYPES,
    INVENTORY_SLOTS
  };
}
