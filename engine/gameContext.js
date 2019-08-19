"use strict";

function gameContext() {
  const {
    wop_world,
    wop_relic,
    wop_player,
    wop_area,
    wop_market,
    wop_location,
    wop_room,
    wop_inventory,
    wop_potion,
    wop_spell,
    wop_playerAttribute,
    wop_armor,
    wop_weapon,
    wop_questGiver,
    wop_quests,
    ARMOR_SLOTS,
    QUEST_TYPE
  } = wop_models();

  function restore(attribute, value, next = null) {
    return function(instigator, target) {
      let text = "";
      if (next) {
        text = next(instigator, target);
      }
      const captialized =
        attribute.charAt(0).toUpperCase() + attribute.substr(1);
      const oldAttribute = instigator.attributes[`current${captialized}`];
      instigator.attributes[`current${captialized}`] = Math.min(
        instigator.attributes[attribute],
        instigator.attributes[`current${captialized}`] + value
      );
      const amount =
        instigator.attributes[`current${captialized}`] - oldAttribute;
      return text + intlText.ActionResults.restoreFmt({ amount, attribute });
    };
  }

  function heal(healthAmount, next = null) {
    return restore("health", healthAmount, next);
  }

  function damage(damageAmount, next = null) {
    return function(instigator, target) {
      let text = intlText.Empty;
      if (next) {
        text = next(instigator, target);
      }
      const oldHealth = target.attributes.currentHealth;
      target.attributes.currentHealth = Math.max(
        0,
        target.attributes.currentHealth - damageAmount
      );
      const amount = Math.abs(target.attributes.currentHealth - oldHealth);
      return (
        text +
        intlText.ActionResults.damageFmt({
          amount,
          targetFullName: target.fullName,
          targetCurrentHealth: target.attributes.currentHealth
        })
      );
    };
  }

  function requiresCombat(next) {
    return function(instigator, target) {
      if (instigator.isInCombat && target) {
        return next(instigator, target);
      }
      return intlText.ActionResults.requiresCombat;
    };
  }

  const allSpells = {
    [intlText.Spells.healingTouch.name]: wop_spell({
      ...intlText.Spells.healingTouch,
      manaCost: 1,
      apply: heal(5)
    }),
    [intlText.Spells.fireSpit.name]: wop_spell({
      ...intlText.Spells.fireSpit,
      manaCost: 1,
      apply: requiresCombat(damage(3))
    }),
    [intlText.Spells.vampiricBite.name]: wop_spell({
      ...intlText.Spells.vampiricBite,
      apply: requiresCombat(damage(4, heal(3))),
      manaCost: 3
    })
  };

  const allPotions = {
    [intlText.Potions.potionOfPainlessness.name]: wop_potion({
      ...intlText.Potions.potionOfPainlessness,
      value: 5,
      apply: heal(5)
    }),
    [intlText.Potions.potionOfManaEmpowerment.name]: wop_potion({
      ...intlText.Potions.potionOfManaEmpowerment,
      value: 8,
      apply: restore("mana", 3)
    }),
    [intlText.Potions.flamingJarOfShit.name]: wop_potion({
      ...intlText.Potions.flamingJarOfShit,
      value: 10,
      apply: requiresCombat(damage(3))
    })
  };

  const allMonsters = {
    [intlText.Monsters.peskyImp.key]: wop_player(intlText.Monsters.peskyImp),
    [intlText.Monsters.buffedImp.key]: wop_player({
      ...intlText.Monsters.buffedImp,
      attributes: {
        strength: 5,
        mana: 10,
        stanima: 10,
        toughness: 2,
        health: 12
      }
    }),
    [intlText.Monsters.sewerTurtle.key]: wop_player({
      ...intlText.Monsters.sewerTurtle,
      attributes: wop_playerAttribute({
        strength: 4,
        mana: 0,
        health: 15,
        toughness: 3,
        stanima: 0
      })
    }),
    [intlText.Monsters.largeRate.key]: wop_player({
      ...intlText.Monsters.largeRate,
      attributes: wop_playerAttribute({
        strength: 8,
        mana: 0,
        health: 20,
        toughness: 1,
        stanima: 0
      })
    })
  };

  allMonsters[intlText.Monsters.buffedImp.key].attributes.levelUp();

  const questGivers = {
    ButtleberryHerald: wop_questGiver({
      ...intlText.Characters.buttleberryHerald,
      quest: wop_quests({
        ...intlText.Quests.theImpMenace,
        countNeeded: 1,
        gold: 4500,
        type: QUEST_TYPE.Kill
      })
    }),
    OldDirtyMan: wop_questGiver({
      ...intlText.Characters.oldDirtyMan,
      quest: wop_quests({
        ...intlText.Quests.peskyImpsMustDie,
        countNeeded: 1,
        gold: 2000,
        type: QUEST_TYPE.Kill
      })
    }),
    DyingGentleman: wop_questGiver({
      ...intlText.Characters.dyingGentleman,
      quest: wop_quests({
        ... intlText.Quests.oneLastGlimpse,
        type: QUEST_TYPE.Collect,
        countNeeded: 1,
        gold: 0,
        nextQuest: wop_quests({
          ...intlText.Quests.oneFinalTreasure,
          type: QUEST_TYPE.GoTo,
          gold: 1000,
          countNeeded: 1
        })
      })
    }),
    LordButtleberry: wop_questGiver({
      ...intlText.Characters.lordButtleberry
    })
  };

  const createWorld = () => {
    return wop_world({
      ...intlText.Places.phyntasieWorld,
      areas: [
        wop_area({
          ...intlText.Places.buttleberryArea,
          locations: [
            wop_location({
              ...intlText.Places.taxPlazaLocation,
              questGiver: questGivers.OldDirtyMan
            }),
            wop_location({
              ...intlText.Places.townSquareLocation,
              monsters: [
                allMonsters[intlText.Monsters.peskyImp.key],
                allMonsters[intlText.Monsters.sewerTurtle.key],
                allMonsters[intlText.Monsters.largeRate.key],
                allMonsters[intlText.Monsters.buffedImp.key]
              ],
              questGiver: questGivers.ButtleberryHerald,
              rooms: [
                wop_room({
                  ...intlText.Places.sewersRoom,
                  isExit: true,
                  chanceForRelic: 0.05,
                  relics: [
                    wop_relic({
                      ...intlText.Items.silverChalice,
                      value: 10
                    })
                  ],
                  linkedRoom: [
                    wop_room({
                      ...intlText.Places.roundSewerRoom,
                      isExit: false,
                      chanceForRelic: 0.06
                    })
                  ]
                })
              ],
              market: wop_market({
                inventory: wop_inventory({
                  potions: [
                    allPotions[intlText.Potions.flamingJarOfShit.name],
                    allPotions[intlText.Potions.potionOfPainlessness.name],
                    allPotions[intlText.Potions.potionOfManaEmpowerment.name],
                  ],
                  armors: [
                    wop_armor({
                      ...intlText.Items.sandals,
                      equipmentSlot: ARMOR_SLOTS.Feet,
                      durability: 100,
                      value: 50,
                      armorRating: 1,
                    }),
                    wop_armor({
                      ...intlText.Items.plateWithStraps,
                      equipmentSlot: ARMOR_SLOTS.Torso,
                      durability: 10,
                      value: 50,
                      armorRating: 2,
                    }),
                    wop_armor({
                      ...intlText.Items.clotheCap,
                      equipmentSlot: ARMOR_SLOTS.Head,
                      durability: 100,
                      value: 50,
                      armorRating: 1,
                    }),
                    wop_armor({
                      ...intlText.Items.canvasPants,
                      equipmentSlot: ARMOR_SLOTS.Legs,
                      durability: 50,
                      value: 25,
                      armorRating: 1,
                    }),
                    wop_armor({
                      ...intlText.Items.greivingGauntlets,
                      equipmentSlot: ARMOR_SLOTS.Arm,
                      durability: 200,
                      value: 125,
                      armorRating: 2,
                    })
                  ],
                  weapons: [
                    wop_weapon({
                      ...intlText.Items.dumbAssStick,
                      damage: 1,
                      criticalDamage: 2,
                      durability: 10,
                      stanimaCost: 0,
                      value: 50
                    })
                  ]
                })
              })
            })
          ]
        })
      ]
    });
  };

  return {
    allSpells,
    allMonsters,
    allPotions,
    createWorld
  };
}
