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
    wop_npcPlayerDecorator,
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
    }),
    [intlText.Spells.alphaOmegaLight.name]: wop_spell({
      ...intlText.Spells.alphaOmegaLight,
      apply: requiresCombat(
        damage(
          500,
          heal(
            100,
            restore(
              "stanima",
              10,
              restore("strength", 10, restore("toughness", 10))
            )
          )
        )
      )
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
      armorRating: 1
    }),
    wop_armor({
      ...intlText.Items.plateWithStraps,
      equipmentSlot: ARMOR_SLOTS.Torso,
      durability: 10,
      armorRating: 2
    }),
    wop_armor({
      ...intlText.Items.clotheCap,
      equipmentSlot: ARMOR_SLOTS.Head,
      durability: 100,
      armorRating: 1
    }),
    wop_armor({
      ...intlText.Items.canvasPants,
      equipmentSlot: ARMOR_SLOTS.Legs,
      durability: 50,
      armorRating: 1
    }),
    wop_armor({
      ...intlText.Items.greivingGauntlets,
      equipmentSlot: ARMOR_SLOTS.Arm,
      durability: 200,
      armorRating: 2
    })
  ];

  const tierTwoArmor = [
    wop_armor({
      ...intlText.Items.boots,
      equipmentSlot: ARMOR_SLOTS.Feet,
      durability: 120,
      armorRating: 2
    }),
    wop_armor({
      ...intlText.Items.cuirass,
      equipmentSlot: ARMOR_SLOTS.Torso,
      durability: 15,
      armorRating: 4
    }),
    wop_armor({
      ...intlText.Items.corinthianHelmet,
      equipmentSlot: ARMOR_SLOTS.Head,
      durability: 120,
      armorRating: 2
    }),
    wop_armor({
      ...intlText.Items.greaves,
      equipmentSlot: ARMOR_SLOTS.Legs,
      durability: 60,
      armorRating: 2
    }),
    wop_armor({
      ...intlText.Items.gauntlets,
      equipmentSlot: ARMOR_SLOTS.Arm,
      durability: 300,
      armorRating: 3
    })
  ];

  const tierOneWeapons = [
    wop_weapon({
      ...intlText.Items.dumbAssStick,
      damage: 1,
      criticalDamage: 2,
      durability: 10,
      stanimaCost: 0
    })
  ];

  const tierTwoWeapons = [
    wop_weapon({
      ...intlText.Items.spikedWoodClub,
      damage: 3,
      criticalDamage: 5,
      durability: 20,
      stanimaCost: 1
    }),
    wop_weapon({
      ...intlText.Items.sharpenedMetalPole,
      damage: 2,
      criticalDamage: 3,
      durability: 15,
      stanimaCost: 0
    }),
    wop_weapon({
      ...intlText.Items.lance,
      damage: 15,
      criticalDamage: 25,
      durability: 1,
      stanimaCost: 5
    })
  ];

  // Actors
  const allMonsters = {
    [intlText.Monsters.alchemist.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.alchemist,
        spells: [
          allSpells[intlText.Spells.healingTouch.name],
          allSpells[intlText.Spells.fireSpit.name]
        ],
        attributes: wop_playerAttribute({
          strength: 1,
          mana: 20,
          health: 10,
          toughness: 0,
          stanima: 0
        }),
        inventory: wop_inventory({
          potions: [
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone(),
            allPotions[intlText.Potions.flamingJarOfShit.name].clone()
          ]
        })
      })
    ),
    [intlText.Monsters.infinity.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.infinity,
        spells: Object.keys(allSpells).map(key => allSpells[key]),
        attributes: wop_playerAttribute({
          strength: 500,
          mana: 1000,
          health: 1500,
          toughness: 200,
          stanima: 1000
        }),
        equipment: wop_equipment({
          arm: wop_armor({
            ...intlText.Items.infinityGloves,
            equipmentSlot: ARMOR_SLOTS.Arm,
            armorRating: 100,
            durability: 10000,
            value: -1
          }),
          head: wop_armor({
            ...intlText.Items.infinityHelmet,
            equipmentSlot: ARMOR_SLOTS.Arm,
            armorRating: 100,
            durability: 10000,
            value: -1
          }),
          torso: wop_armor({
            ...intlText.Items.infinityPlate,
            equipmentSlot: ARMOR_SLOTS.Arm,
            armorRating: 100,
            durability: 10000,
            value: -1
          }),
          legs: wop_armor({
            ...intlText.Items.infinityPants,
            equipmentSlot: ARMOR_SLOTS.Arm,
            armorRating: 100,
            durability: 10000,
            value: -1
          }),
          feet: wop_armor({
            ...intlText.Items.infinityBoots,
            equipmentSlot: ARMOR_SLOTS.Arm,
            armorRating: 100,
            durability: 10000,
            value: -1
          }),
          weapon: wop_weapon({
            ...intlText.Items.infinityWeapon,
            criticalDamage: 100000000,
            damage: 250,
            durability: 10000,
            stanimaCost: -20,
            value: -1
          })
        })
      })
    ),
    [intlText.Monsters.darkVampire.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.darkVampire,
        spells: [allSpells[intlText.Spells.vampiricBite.name]],
        attributes: wop_playerAttribute({
          strength: 1,
          mana: 20,
          health: 15,
          toughness: 2,
          stanima: 0
        })
      }),
      {
        spellCastingWeight: 1.0
      }
    ),
    [intlText.Monsters.peskyImp.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.peskyImp,
        spells: [allSpells[intlText.Spells.fireSpit.name]]
      }),
      {
        spellCastingWeight: 0.9
      }
    ),
    [intlText.Monsters.buffedImp.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.buffedImp,
        spells: [allSpells[intlText.Spells.fireSpit.name]],
        attributes: {
          strength: 5,
          mana: 10,
          stanima: 10,
          toughness: 2,
          health: 12
        }
      }),
      {
        spellCastingWeight: 0.8
      }
    ),
    [intlText.Monsters.sewerTurtle.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.sewerTurtle,
        attributes: wop_playerAttribute({
          strength: 4,
          mana: 0,
          health: 15,
          toughness: 3,
          stanima: 0
        })
      })
    ),
    [intlText.Monsters.largeRat.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.largeRat,
        attributes: wop_playerAttribute({
          strength: 8,
          mana: 0,
          health: 20,
          toughness: 1,
          stanima: 0
        })
      })
    ),
    [intlText.Monsters.groveGuardian.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.groveGuardian,
        attributes: wop_playerAttribute({
          strength: 2,
          mana: 0,
          health: 30,
          toughness: 4,
          stanima: 0
        })
      })
    ),
    [intlText.Monsters.vengefulSouls.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.vengefulSouls,
        attributes: wop_playerAttribute({
          strength: 1,
          mana: 100,
          health: 10,
          toughness: 1,
          stanima: 0
        })
      })
    ),
    [intlText.Monsters.hunchedSheet.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.hunchedSheet,
        attributes: wop_playerAttribute({
          strength: 1,
          mana: 120,
          health: 12,
          toughness: 3,
          stanima: 0
        })
      })
    ),
    [intlText.Monsters.skinlessSkeleton.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.skinlessSkeleton,
        attributes: wop_playerAttribute({
          strength: 8,
          mana: 20,
          health: 25,
          toughness: 3,
          stanima: 40
        }),
        equipment: wop_equipment({
          head: wop_equipment(tierOneArmor[2]),
          weapon: wop_weapon(tierTwoWeapons[1])
        })
      })
    ),
    [intlText.Monsters.cryingBoy.key]: wop_npcPlayerDecorator(
      wop_player({
        ...intlText.Monsters.cryingBoy,
        attributes: wop_playerAttribute({
          strength: 12,
          mana: 0,
          health: 30,
          toughness: 5,
          stanima: 0
        })
      })
    )
  };

  allMonsters[intlText.Monsters.buffedImp.key].attributes.levelUp();

  //Log as last
  Object.keys(allMonsters).forEach(monster =>
    console.log(
      `${allMonsters[monster].fullName} is level ${allMonsters[
        monster
      ].attributes.level()}`
    )
  );

  const questGivers = {
    SoulCollector: wop_questGiver({
      ...intlText.Characters.soulCollector,
      quest: Object.keys(allMonsters)
        .map(key => allMonsters[key])
        .sort((a, b) => {
          if (a.attributes.level() < b.attributes.level()) return -1;
          if (a.attributes.level() === b.attributes.level()) return 0;
          if (a.attributes.level() > b.attributes.level()) return 1;
        })
        .map(monster => monster.fullName)
        .reduce((quest, monster) => {
          if (!quest.nameOfObject) {
            const {
              title,
              description,
              instructions,
              nameOfObject
            } = intlText.Quests.collectSoulsFmt(monster);
            quest.title = title;
            quest.description = description;
            quest.instructions = instructions;
            quest.nameOfObject = nameOfObject;
            quest.countNeeded = 1;
            quest.gold = 100;
            quest.type = QUEST_TYPE.Kill;
          } else {
            let nextQuest = wop_quests({
              ...intlText.Quests.collectSoulsFmt(monster),
              countNeeded: 1,
              gold: 100,
              type: QUEST_TYPE.Kill
            });
            let q = quest;
            while (q.nextQuest) {
              q = q.nextQuest;
            }
            q.nextQuest = nextQuest;
          }
          return quest;
        }, wop_quests({}))
    }),
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
        monsters: [allMonsters[intlText.Monsters.groveGuardian.key]]
      }),
      wop_location({
        ...intlText.Places.tallTreeLocation,
        monsters: [
          allMonsters[intlText.Monsters.vengefulSouls.key],
          allMonsters[intlText.Monsters.hunchedSheet.key],
          allMonsters[intlText.Monsters.skinlessSkeleton.key],
          allMonsters[intlText.Monsters.cryingBoy.key]
        ]
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
          allMonsters[intlText.Monsters.darkVampire.key]
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
        questGiver: questGivers.DyingGentleman
      }),
      wop_location({
        ...intlText.Places.marketLocation,
        market: wop_market({
          inventory: wop_inventory({
            potions: Object.keys(allPotions).map(key => allPotions[key]),
            armors: [...tierOneArmor, ...tierTwoArmor],
            weapons: [...tierOneWeapons, ...tierTwoWeapons]
          })
        })
      }),
      wop_location({
        ...intlText.Places.grasslandsLocation,
        monsters: [allMonsters[intlText.Monsters.largeRat.key]],
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
        monsters: [
          allMonsters[intlText.Monsters.largeRat.key],
          allMonsters[intlText.Monsters.alchemist.key]
        ],
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
          allMonsters[intlText.Monsters.buffedImp.key]
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

  const TheVoid = wop_area({
    ...intlText.Places.theVoid,
    locations: [
      wop_location({
        ...intlText.Places.eventHorizon,
        questGiver: questGivers.SoulCollector,
        isExit: true,
        monsters: [allMonsters[intlText.Monsters.infinity.key]],
        rooms: [
          wop_room({
            relics: [
              wop_relic({
                ...intlText.Items.infinityShardRelic,
                value: 1000000
              })
            ],
            isExit: true,
            ...intlText.Places.theBlackhole,
            chanceForRelic: 0.001
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
          allMonsters[intlText.Monsters.buffedImp.key]
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
            weapons: tierOneWeapons
          })
        })
      })
    ]
  });

  const createWorld = () => {
    return wop_world({
      ...intlText.Places.phyntasieWorld,
      areas: [HauntedForest, Reedton, Buttleberry, TheBarrenWastes]
    });
  };

  return {
    allSpells,
    allMonsters,
    allPotions,
    createWorld,
    TheVoid
  };
}
