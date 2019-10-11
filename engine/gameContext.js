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
    wop_equipment,
    ARMOR_SLOTS,
    QUEST_TYPE
  } = wop_models();

//Spells
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

// Equipment
  const tierOneArmor = [
    wop_armor({
      ...intlText.Items.sandals,
      equipmentSlot: ARMOR_SLOTS.Feet,
      durability: 100,
      value: 50,
      armorRating: 1
    }),
    wop_armor({
      ...intlText.Items.plateWithStraps,
      equipmentSlot: ARMOR_SLOTS.Torso,
      durability: 10,
      value: 50,
      armorRating: 2
    }),
    wop_armor({
      ...intlText.Items.clotheCap,
      equipmentSlot: ARMOR_SLOTS.Head,
      durability: 100,
      value: 50,
      armorRating: 1
    }),
    wop_armor({
      ...intlText.Items.canvasPants,
      equipmentSlot: ARMOR_SLOTS.Legs,
      durability: 50,
      value: 25,
      armorRating: 1
    }),
    wop_armor({
      ...intlText.Items.greivingGauntlets,
      equipmentSlot: ARMOR_SLOTS.Arm,
      durability: 200,
      value: 125,
      armorRating: 2
    })
  ];

  const tierTwoArmor = [
    wop_armor({
      ...intlText.Items.boots,
      equipmentSlot: ARMOR_SLOTS.Feet,
      durability: 120,
      value: 120,
      armorRating: 2
    }),
    wop_armor({
      ...intlText.Items.cuirass,
      equipmentSlot: ARMOR_SLOTS.Torso,
      durability: 15,
      value: 220,
      armorRating: 4
    }),
    wop_armor({
      ...intlText.Items.corinthianHelmet,
      equipmentSlot: ARMOR_SLOTS.Head,
      durability: 120,
      value: 120,
      armorRating: 2
    }),
    wop_armor({
      ...intlText.Items.greaves,
      equipmentSlot: ARMOR_SLOTS.Legs,
      durability: 60,
      value: 55,
      armorRating: 2
    }),
    wop_armor({
      ...intlText.Items.gauntlets,
      equipmentSlot: ARMOR_SLOTS.Arm,
      durability: 300,
      value: 200,
      armorRating: 3
    })
  ];

  const tierOneWeapons = [
    wop_weapon({
      ...intlText.Items.dumbAssStick,
      damage: 1,
      criticalDamage: 2,
      durability: 10,
      stanimaCost: 0,
      value: 50
    })
  ];

  const tierTwoWeapons = [
    wop_weapon({
      ...intlText.Items.spikedWoodClub,
      damage: 3,
      criticalDamage: 5,
      durability: 20,
      stanimaCost: 1,
      value: 75,
    }),
    wop_weapon({
      ...intlTest.Items.sharpenedMetalPole,
      damage: 2,
      criticalDamage: 3,
      durability: 15,
      stanimaCost: 0,
      value: 65,
    })
  ];
// Actors
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
    [intlText.Monsters.largeRat.key]: wop_player({
      ...intlText.Monsters.largeRat,
      attributes: wop_playerAttribute({
        strength: 8,
        mana: 0,
        health: 20,
        toughness: 1,
        stanima: 0
      })
    }),
    [intlText.Monsters.groveGuardian.key]: wop_player({
      ...intlText.Monsters.groveGuardian,
      attributes: wop_playerAttribute({
        strength: 2,
        mana: 0,
        health: 30,
        toughness: 4,
        stanima: 0,
      }),
    }),
    [intlText.Monsters.vengefulSouls.key]: wop_player({
      ...intlText.Monsters.vengefulSouls,
      attributes: wop_playerAttribute({
        strength: 1,
        mana: 100,
        health: 10,
        toughness: 1,
        stanima: 0,
      })
    }),
    [intlText.Monsters.hunchedSheet.key]: wop_player({
      ...intlText.Monsters.hunchedSheet,
      attributes: wop_playerAttribute({
        strength: 1,
        mana: 120,
        health: 12,
        toughness: 3,
        stanima: 0,
      })
    }),
    [intlText.Monsters.skinlessSkeleton.key]: wop_player({
      ...intlText.Monsters.skinlessSkeleton,
      attributes: wop_playerAttribute({
        strength: 8,
        mana: 20,
        health: 25,
        toughness: 3,
        stanima: 40,
      }),
      equipment: wop_equipment({
        head: wop_equipment(tierOneArmor[2]),
        weapon: wop_weapon(tierTwoWeapons[1]),
      })
    }),
    [intlText.Monsters.cryingBoy]: wop_player({
      ...intlText.Monsters.cryingBoy,
      attributes: wop_playerAttribute({
        strength: 12,
        mana: 0,
        health: 30,
        toughness: 5,
        stanima: 0,
      }),
    }),
  };

  allMonsters[intlText.Monsters.buffedImp.key].attributes.levelUp();

  const questGivers = {
    ButtleberryHerald: wop_questGiver({
      ...intlText.Characters.buttleberryHerald,
      quest: wop_quests({
        ...intlText.Quests.theImpMenace,
        countNeeded: 1,
        gold: 450,
        type: QUEST_TYPE.Kill
      })
    }),
    OldDirtyMan: wop_questGiver({
      ...intlText.Characters.oldDirtyMan,
      quest: wop_quests({
        ...intlText.Quests.peskyImpsMustDie,
        countNeeded: 1,
        gold: 5,
        type: QUEST_TYPE.Kill
      })
    }),
    DyingGentleman: wop_questGiver({
      ...intlText.Characters.dyingGentleman,
      quest: wop_quests({
        ...intlText.Quests.oneLastGlimpse,
        type: QUEST_TYPE.Collect,
        countNeeded: 1,
        gold: 0,
        nextQuest: wop_quests({
          ...intlText.Quests.oneFinalTreasure,
          type: QUEST_TYPE.GoTo,
          gold: 100,
          countNeeded: 1
        })
      })
    }),
    LordButtleberry: wop_questGiver({
      ...intlText.Characters.lordButtleberry,
      quest: wop_quests({
        ...intlText.Quests.failingFields,
        type: QUEST_TYPE.GoTo,
        gold: 150,
        countNeeded: 1,
        nextQuest: wop_quests({
          ...intlText.Quests.speakingOfFarmFields,
          type: QUEST_TYPE.GoTo,
          gold: 100,
          countNeeded: 1
        })
      })
    })
  };

  questGivers.CrazedFarmer = wop_questGiver({
    ...intlText.Characters.agitatedFarmer,
    questsToUnlockThisQuestGiver: [questGivers.LordButtleberry.quest.nextQuest],
    quest: wop_quests({
      ...intlText.Quests.lostSouls,
      type: QUEST_TYPE.GoTo,
      gold: 10,
      countNeeded: 1,
      nextQuest: wop_quests({
        ...intlText.Quests.puttingSoulsToRest,
        type: QUEST_TYPE.Kill,
        gold: 100,
        countNeeded: 1
      })
    })
  });

  const HauntedForest = wop_area({
    ...intlText.Places.hauntedForestArea,
    locations: [
      wop_location({
        ...intlText.Places.groveOfTheElderLocation,
        isExit: true,
        monsters: [
          allMonsters[intlText.Monsters.groveGuardian.key],
        ]
      }),
      wop_location({
        ...intlText.Places.tallTreeLocation,
        monsters: [
          allMonsters[intlText.Monsters.vengefulSouls.key],
          allMonsters[intlText.Monsters.hunchedSheet.key],
          allMonsters[intlText.Monsters.skinlessSkeleton.key],
          allMonsters[intlText.Monsters.cryingBoy.key],
        ],
      })
    ]
  });

  const TheBarrenWastes = wop_area({
    ...intlText.Places.baronWastesArea,
    locations: [
      wop_location({
        ...intlText.Places.widowerColossusLocation,
        isExit: true,
        monsters: [
          allMonsters[intlText.Monsters.largeRat.key],
        ]
      })
    ]
  });

  const Reedton = wop_area({
    ...intlText.Places.reedtonArea,
    locations: [
      wop_location({
        ...intlText.Places.wharfLocation,
        isExit: true,
        questGiver: questGivers.DyingGentleman,
      }),
      wop_location({
        ...intlText.Places.marketLocation,
        market: wop_market({
          inventory: wop_inventory({
            potions: Object.keys(allPotions).map(key => allPotions[key]),
            armors: [
              ...tierOneArmor,
              ...tierTwoArmor,
            ],
            weapons: [
              ...tierOneWeapons,
              ...tierTwoWeapons,
            ],
          }),
        }),
      }),
      wop_location({
        ...intlText.Places.grasslandsLocation,
        monsters: [
          allMonsters[intlText.Monsters.largeRat.key],
        ],
        questGiver: questGivers.CrazedFarmer,
        rooms: [
          wop_room({
            ...intlText.Places.farmFieldsRoom,
            isExit: true,
            linkedRoom: [
              wop_room({
                ...intlText.Places.burnedHomeRoom
              }),
              wop_room({
                ...intlText.Places.overlookHillRoom
              })
            ]
          })
        ]
      }),
      wop_location({
        ...intlText.Places.castleLocation,
        rooms: [
          wop_room({
            ...intlText.Places.castleEntranceRoom,
            isExit: true,
            linkedRoom: [
              wop_room({
                ...intlText.Places.grandHallRoom
              })
            ]
          })
        ]
      }),
      wop_location({
        ...intlText.Places.sewersLocation,
        monsters: [
          allMonsters[intlText.Monsters.largeRat.key],
          allMonsters[intlText.Monsters.buffedImp.key],
        ],
        rooms: [
          wop_room({
            ...intlText.Places.sewerEntranceRoom,
            isExit: true,
            linkedRoom: [
              wop_room({
                ...intlText.Places.sewerHallwayRoom,
                linkedRoom: [
                  wop_room({
                    ...intlText.Places.sewerCrossroads,
                    linkedRoom: [
                      wop_room({
                        ...intlText.Places.sewerCavern
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  const Buttleberry = wop_area({
    ...intlText.Places.buttleberryArea,
    locations: [
      wop_location({
        ...intlText.Places.marbleManorLocation,
        questGiver: questGivers.LordButtleberry
      }),
      wop_location({
        ...intlText.Places.taxPlazaLocation,
        questGiver: questGivers.OldDirtyMan
      }),
      wop_location({
        ...intlText.Places.cityGateLocation,
        isExit: true
      }),
      wop_location({
        ...intlText.Places.dungeonLocation,
        monsters: [
          allMonsters[intlText.Monsters.peskyImp.key],
          allMonsters[intlText.Monsters.largeRat.key]
        ],
        rooms: [
          wop_room({
            ...intlText.Places.entranceRoom,
            isExit: true
          })
        ]
      }),
      wop_location({
        ...intlText.Places.townSquareLocation,
        monsters: [
          allMonsters[intlText.Monsters.peskyImp.key],
          allMonsters[intlText.Monsters.sewerTurtle.key],
          allMonsters[intlText.Monsters.largeRat.key],
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
                chanceForRelic: 0.06,
                relics: [
                  wop_relic({
                    ...intlText.Items.silverChalice,
                    value: 10
                  })
                ]
              })
            ]
          })
        ],
        market: wop_market({
          inventory: wop_inventory({
            potions: [
              allPotions[intlText.Potions.flamingJarOfShit.name],
              allPotions[intlText.Potions.potionOfPainlessness.name],
              allPotions[intlText.Potions.potionOfManaEmpowerment.name]
            ],
            armors: tierOneArmor,
            weapons: tierOneWeapons,
          })
        })
      })
    ]
  });

  const createWorld = () => {
    return wop_world({
      ...intlText.Places.phyntasieWorld,
      areas: [
        HauntedForest,
        Reedton,
        Buttleberry,
        TheBarrenWastes,
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
