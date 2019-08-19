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

  function wop_achievement({
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
    equipmentSlot,
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
      armorRating,
      durability,
      value,
      description,
      slot,
      equipmentSlot,
      clone: () =>
        wop_armor({
          name,
          armorRating,
          durability,
          value,
          description,
          slot,
          equipmentSlot
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
      arm: arm ? wop_armor(arm) : null,
      head: head ? wop_armor(head) : null,
      torso: torso ? wop_armor(torso) : null,
      legs: legs ? wop_armor(legs) : null,
      feet: feet ? wop_armor(feet) : null,
      weapon: weapon ? wop_weapon(weapon) : null
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
    strength = 5,
    mana = 10,
    stanima = 10,
    toughness = 2,
    health = 12,
    currentStrength = null,
    currentMana = null,
    currentStanima = null,
    currentToughness = null,
    currentHealth = null,
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
      currentStrength: currentStrength !== null ? currentStrength : strength,
      currentMana: currentMana !== null ? currentMana : mana,
      currentStanima: currentStanima !== null ? currentStanima : stanima,
      currentToughness:
        currentToughness !== null ? currentToughness : toughness,
      currentHealth: currentHealth !== null ? currentHealth : health,
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
      const experienceNeeded = cubic_polynomial(100, instance.level());
      if (experienceNeeded < instance.experience) {
        instance.levelUp();
      }
    };

    instance.levelUp = function() {
      instance.health = Math.floor(cubic_polynomial(instance.health, 0.3));
      instance.mana = Math.floor(cubic_polynomial(instance.mana, 0.25));
      instance.stanima = Math.floor(
        quadratic_polynomial(instance.stanima, 0.2)
      );
      instance.strength = Math.floor(
        quadratic_polynomial(instance.strength, 0.25)
      );
      instance.toughness = Math.floor(
        cubic_polynomial(instance.toughness, 0.1)
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

      const total = (power + potency + durability) / 30;

      return Math.floor(total);
    };

    return instance;
  }

  function wop_playerQuestQuest({ quest, count = 0 }) {
    const instance = {
      id: wop_id(),
      quest,
      count
    };
    instance.isComplete = function() {
      return instance.count >= instance.quest.countNeeded;
    };
    return instance;
  }

  function wop_playerQuests({ quests = [] }) {
    return {
      id: wop_id(),
      quests: quests.map(q => wop_playerQuestQuest(q))
    };
  }

  function wop_potion({
    name,
    description,
    value,
    slot = INVENTORY_SLOTS.Potion,
    apply = function(_instigator, _target) {
      return intlText.ActionResults.emptyBottle;
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
    return {
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
          .filter(q => q.isComplete())
          .map(q => q.name);
        if (completed) {
          return instance.questsToUnlockThisQuestGiver.every(q =>
            completed.includes(q.name)
          );
        }
        return false;
      }

      if (
        player.quests.quests.find(
          q => q.quest.title === instance.quest.title && q.isComplete()
        )
      ) {
        return false;
      }

      return true;
    };

    return instance;
  }

  function wop_player({
    name,
    title = intlText.Empty,
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
    description = intlText.Empty,
    id = wop_id(),
    joinDate = new Date(),
    monstersSlain = 0,
    achievements = []
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
      quests: wop_playerQuests(quests || []),
      myTurn,
      placesVisited,
      areasDiscovered,
      fullName: `${title} ${name}`,
      joinDate,
      monstersSlain,
      achievements
    };

    instance.onRevive = function() {
      instance.state = PLAYER_STATE.Alive;
      instance.attributes.resetStats();
      instance.inventory.gold = Math.floor(instance.inventory.gold / 2);
      if (instance.inventory.potions.length > 0) {
        const index = Math.floor(
          Math.random() * instance.inventory.potions.length
        );
        instance.inventory.potions.splice(index);
      }
      instance.attributes.addExperience(-5 * instance.attributes.level());
      instance.expireRoom = true;
      return intlText.ActionResults.reviveFmt(instance);
    };

    instance.onDeath = function() {
      instance.attributes.state = PLAYER_STATE.Dead;
      instance.isInCombat = false;
      instance.isInside = false;
      instance.myTurn = false;
      return intlText.ActionResults.deathFmt(instance);
    };

    instance.onMove = function(where) {
      if (instance.currentRoom != null) {
        const quest = instance.quests.quests.find(
          q =>
            !q.isComplete() &&
            q.quest.type === QUEST_TYPE.GoTo &&
            q.quest.nameOfObject.toLowerCase() ===
              instance.currentRoom.name.toLowerCase()
        );

        if (quest) {
          quest.count = quest.count + 1;
        }
      }

      let qq = instance.quests.quests.find(
        q =>
          !q.isComplete() &&
          q.quest.type === QUEST_TYPE.GoTo &&
          q.quest.nameOfObject === instance.currentLocation.name
      );
      if (!qq) {
        qq = instance.quests.quests.find(
          q =>
            !q.isComplete() &&
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

      return intlText.ActionResults.moveFmt({
        ...where,
        questComplete: qq && qq.isComplete(),
        questTitle: qq ? qq.quest.title : intlText.Empty,
      });
    };

    instance.addItemToInventory = function(item) {
      instance.inventory[item.slot].push(item);
      if (item.slot === INVENTORY_SLOTS.Relic) {
        const quest = instance.quests.quests.find(
          q =>
            !quest.isComplete() &&
            q.quest.type === QUEST_TYPE.Collect &&
            q.quest.nameOfObject === item.name
        );

        if (quest) {
          quest.count = quest.count + 1;
        }
      }
      return intlText.ActionResults.itemAddedToInventoryFmt(item);
    };

    instance.buyItem = function(item) {
      if (instance.inventory.gold >= item.value) {
        instance.inventory.gold = instance.inventory.gold - item.value;
        return intlText.ActionResults.itemBoughtFmt({
          ...item,
          inventoryGold: instance.inventory.gold,
        }) + instance.addItemToInventory(item);
      } else {
        return intlText.ActionResults.itemMoreGoldFmt({
          goldNeeded: item.value - instance.inventory.gold,
        });
      }
    };

    instance.removeItemFromInventory = function(item) {
      instance.inventory[item.slot] = instance.inventory[item.slot].filter(
        i => i.id !== item.id
      );
      if (item.slot === INVENTORY_SLOTS.Relic) {
        const quest = instance.quests.quests.find(
          q =>
            !quest.isComplete() &&
            q.quest.type === QUEST_TYPE.Collect &&
            q.quest.nameOfObject === item.name
        );

        if (quest) {
          quest.count = quest.count - 1;
        }
      }
      return intlText.ActionResults.itemRemovedFromInventoryFmt(item);
    };

    instance.equipWeapon = function(weapon) {
      const old = instance.equipment.weapon;
      instance.equipment.weapon = weapon;
      if (old) {
        return instance.addItemToInventory(old) +
          instance.removeItemFromInventory(weapon) +
          intlText.ActionResults.weaponEquippedFmt(weapon);
      }
      return instance.removeItemFromInventory(weapon) + intlText.ActionResults.weaponEquippedFmt(weapon);
    };

    instance.equipArmor = function(armor) {
      const old = instance.equipment[armor.equipmentSlot];
      instance.equipment[armor.equipmentSlot] = armor;
      if (old) {
        return instance.addItemToInventory(old) +
          instance.removeItemFromInventory(armor) +
          intlText.ActionResults.armorEquippedFmt(armor);
      }
      return instance.removeItemFromInventory(armor) + intlText.ActionResults.armorEquippedFmt(armor);
    };

    instance.unequipArmor = function(armor) {
      const old = instance.equipment[armor.equipmentSlot];
      instance.equipment[armor.equipmentSlot] = null;
      return instance.addItemToInventory(old) + intlText.ActionResults.armorUnequippedFmt(old);
    };

    instance.unequipWeapon = function(_weapon) {
      const old = instance.equipment.weapon;
      instance.equipment.weapon = null;
      return instance.addItemToInventory(old) + intlText.ActionResults.weaponUnequippedFmt(old);
    };

    instance.castSpell = function(spell, target) {
      if (instance.attributes.currentMana >= spell.manaCost) {
        instance.savedTarget = target;
        const spellText = spell.apply(instance, target);
        instance.attributes.currentMana = Math.max(
          0,
          instance.attributes.currentMana - spell.manaCost
        );
        return spellText;
      }
      return intlText.ActionResults.spellRequiresMoreManaFmt({
        currentMana: instance.attributes.currentMana,
        spellName: spell.name,
      });
    };

    instance.attack = function(target) {
      instance.savedTarget = target;

      if (
        instance.equipment.weapon &&
        instance.equipment.weapon.durability > 0 &&
        instance.attributes.currentStanima >
          instance.equipment.weapon.stanimaCost
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

      const brokens = [];

      ARMOR_SLOTS.VALUES.forEach(slotName => {
        const armor = instance.equipment[slotName];
        if (armor && armor.durability > 0) {
          armor.durability = armor.durability - 1;
          totalArmorRating = totalArmorRating + armor.armorRating;
          if (armor.durability <= 0) {
            instance.unequipArmor(armor);
            instance.removeItemFromInventory(armor);
            brokens.push(intlText.ActionResults.armorBrokenFmt(armor));
          }
        }
      });

      weaponDamage = Math.max(0, weaponDamage - totalArmorRating);
      physicalDamage = Math.max(
        1,
        physicalDamage -
          instance.attributes.currentToughness -
          Math.floor(totalArmorRating / 2)
      );
      const totalDamage = weaponDamage + physicalDamage;
      instance.attributes.currentHealth = Math.max(
        0,
        instance.attributes.currentHealth - totalDamage
      );

      return intlText.ActionResults.defendFmt({
        instigatorFullName: instigator.fullName,
        totalDamage,
        instanceFullName: instance.fullName,
        instanceCurrentHealth: instance.attributes.currentHealth,
        brokens,
      })
    };

    instance.usePotion = function(potion, target) {
      if (target) {
        instance.savedTarget = target;
      }
      return instance.removeItemFromInventory(potion) + potion.apply(this, target);
    };

    instance.onCombatOver = function(target) {
      instance.savedTarget = null;
      instance.isInCombat = false;
      return intlText.ActionResults.combatOverFmt({
        instanceFullName: instance.fullName,
        targetFullName: target.fullName,
      });
    };

    instance.engage = function(target) {
      instance.savedTarget = target;
      instance.isInCombat = true;
      return intlText.ActionResults.engageFmt({
        instanceFullName: instance.fullName,
        targetFullName: target.fullName,
        targetDescription: target.description,
      });
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
    relics = [],
    linkedRoom = [],
    id = wop_id()
  }) {
    return {
      name,
      description,
      isExit,
      chanceForRelic,
      relics: relics.map(r => wop_relic(r)),
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
    wop_achievement,
    wop_area,
    wop_armor,
    wop_weapon,
    wop_equipment,
    PLAYER_STATE,
    CARDINAL_POINTS,
    ARMOR_SLOTS,
    INVENTORY_SLOTS,
    QUEST_TYPE
  };
}
