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
    QUEST_TYPE,
  } = wop_models();

  function restore(attribute, value, next = null) {
    return function (instigator, target) {
      let text = "";
      if (next) {
        text = next(instigator, target);
      }
      const captialized = attribute.charAt(0).toUpperCase() + attribute.substr(1);
      const oldAttribute = instigator.attributes[`current${captialized}`];
      instigator.attributes[`current${captialized}`] = Math.min(
        instigator.attributes[attribute],
        instigator.attributes[`current${captialized}`] + value
      );
      const amount = instigator.attributes[`current${captialized}`] - oldAttribute;
      return text + `Restored ${amount} ${attribute}. `;
    }
  }

  function heal(healthAmount, next = null) {
    return restore('health', healthAmount, next);
  }

  function damage(damageAmount, next = null) {
    return function(instigator, target) {
      let text = "";
      if (next) {
        text = next(instigator, target);
      }
      const oldHealth = target.attributes.currentHealth;
      target.attributes.currentHealth = Math.max(
        0,
        target.attributes.currentHealth - damageAmount
      );
      const amount = Math.abs(target.attributes.currentHealth - oldHealth);
      return text + `Caused ${amount} pain to ${target.fullName}! ${target.fullName} has ${
        target.attributes.currentHealth
      } health remaining. `;
    };
  }

  function requiresCombat(next) {
    return function(instigator, target) {
      if (instigator.isInCombat && target) {
        return next(instigator, target);
      }
      return "I used this outside of combat. It could have been more useful then.";
    };
  }

  const allSpells = {
    "Healing Touch": wop_spell({
      name: "Healing Touch",
      description:
        "With cold clammy hands I rest my hand upon my breast. I feel goosebumps and feel somewhat better",
      manaCost: 1,
      apply: heal(5)
    }),
    "Fire Spit": wop_spell({
      name: "Fire Spit",
      description:
        "I open my mouth and small flecks of flaming spittle burst forth, consuming my foe in flickers of flame.",
      manaCost: 1,
      apply: requiresCombat(damage(3))
    }),
    "Vampiric Bite": wop_spell({
      name: "Vampiric Bite",
      description: "I open my mouth, canines extending. I bite hard on my foe and suck deep the life force.",
      apply: requiresCombat(damage(4, heal(3))),
      manaCost: 3,
    }),
  };

  const allPotions = {
    "Potion of Painlessness": wop_potion({
      name: "Potion of Painlessness",
      description: "It bubbles red and smells of sriracha.",
      value: 5,
      apply: heal(5)
    }),
    "Potion of Mana Empowerment": wop_potion({
      name: "Potion of Mana Empowerment",
      description: "A blue potion that is thick and slimy. I assume that when I drink it, it will feel as though a family of slugs slide down my throat.",
      value: 8,
      apply: restore('mana', 3),
    }),
    "Flaming Jar of Shit": wop_potion({
      name: "Flaming Jar of Shit",
      description: "It smells bad and it burns - seems legit",
      value: 10,
      apply: requiresCombat(damage(3))
    })
  };

  const allMonsters = {
    Imp: wop_player({
      name: "Imp",
      title: "Pesky",
      description:
        "A small creature with fangs and wings. It grins and drools. I find it ugly."
    }),
    "Buffed Imp": wop_player({
      name: "Imp",
      title: "Buffed",
      description:
        "This dude is swoll! Still ugly as sin - but swoll none the less",
      attributes: {
        strength: 5,
        mana: 10,
        stanima: 10,
        toughness: 2,
        health: 12,
      },
    }),
    "Sewer Turtle": wop_player({
      name: "Turtle",
      title: "Sewer",
      description: "Small and hard... sounds familiar.",
      attributes: wop_playerAttribute({
        strength: 4,
        mana: 0,
        health: 15,
        toughness: 3,
        stanima: 0
      }),
    }),
    "Large Rat": wop_player({
      name: "Rat",
      title: "Large",
      description: "Of course this creature makes an appearance.",
      attributes: wop_playerAttribute({
        strength: 8,
        mana: 0,
        health: 20,
        toughness: 1,
        stanima: 0,
      }),
    }),
  };

  allMonsters["Buffed Imp"].attributes.levelUp();

  const questGivers = {
    ButtleberryHerald:
  }

  const createWorld = () => {
    return wop_world({
      name: "Phyntasie",
      description: "The world I love - or so they tell me.",
      areas: [
        wop_area({
          name: "Buttleberry",
          description: "A beautiful down upon the cliffs of an ocean.",
          locations: [
            wop_location({
              name: 'Tax Plaza',
              description: 'The place of one of the certian things in life.',
              questGiver:  wop_questGiver({
                name: 'Old Dirty Man',
                description: 'He sits there. Hunched. Smelly. Wrinkled.',
                quest: wop_quests({
                  countNeeded: 1,
                  description: "Imps are so Pesky! They must all DIE!",
                  instructions: 'Kill 1 Imp',
                  nameOfObject: 'Imp',
                  gold: 2000,
                  title: 'Pesky Imps Must Die',
                  type: QUEST_TYPE.Kill,
                }),
              }),
            }),
            wop_location({
              name: "Town Square",
              description: "A square in the town. I guess I should not have expected more than that.",
              monsters: [
                allMonsters["Imp"],
                allMonsters["Sewer Turtle"],
                allMonsters["Large Rat"],
                allMonsters["Buffed Imp"]
              ],
              questGiver:  wop_questGiver({
                name: 'Buttleberry Herald',
                description: 'He stands there, smug, with his uniform sporting a large orange berry. His myraid colours truly relay his job - a herald. Town crier, the easiest job of late. A true slacker. However, it seems he has a job for me.',
                quest: wop_quests({
                  title: 'The Imp Menace',
                  description: 'Hear ye! Hear ye, there are most abundant collections of nasty creatures within our dungeon that are of most import to remove from the vacinity. Rewards, a-plenty. Honor, a-plenty. All bestowed upon the completion of this boon from our most merciful Lord Buttleberry!',
                  gold: 3500,
                  instructions: 'Kill 3 Imps',
                  type: QUEST_TYPE.Kill,
                  nameOfObject: 'Imp',
                  countNeeded: 3,
                })
              }),
              rooms: [
                wop_room({
                  name: "Sewers",
                  description:
                    "It smells. Like shit. That is the long and short of it.",
                  isExit: true,
                  chanceForRelic: 0.05,
                  relics: [
                    wop_relic({
                      name: 'Silver Chalice',
                      description: 'A chalice made of silver. At least, it seems so.',
                      value: 10,
                    }),
                  ],
                  linkedRoom: [
                    wop_room({
                      name: "Round Sewer Room",
                      description:
                        "A large cavernous space within the sewers. There is no light. It still smells like shit.",
                      isExit: false,
                      chanceForRelic: 0.06
                    })
                  ]
                })
              ],
              market: wop_market({
                inventory: wop_inventory({
                  potions: [
                    allPotions["Flaming Jar of Shit"],
                    allPotions["Potion of Painlessness"],
                    allPotions["Potion of Mana Empowerment"],
                  ],
                  armors: [
                    wop_armor({
                      name: 'Sandals',
                      equipmentSlot: ARMOR_SLOTS.Feet,
                      durability: 100,
                      value: 50,
                      armorRating: 1,
                      description: "Thin, strappy, and pretty much useless. But they sure are trusty.",
                    }),
                    wop_armor({
                      name: 'Plate with Straps',
                      equipmentSlot: ARMOR_SLOTS.Torso,
                      durability: 10,
                      value: 50,
                      armorRating: 2,
                      description: 'A ceramic plate that covers my sternum. Seriously, this is armor.',
                    }),
                    wop_armor({
                      name: 'Clothe Cap',
                      equipmentSlot: ARMOR_SLOTS.Head,
                      durability: 100,
                      value: 50,
                      armorRating: 1,
                      description: "Yup, a cap. Yup, made of clothe. Keeps the sun off my face though.",
                    }),
                    wop_armor({
                      name: 'Canvas Pants',
                      equipmentSlot: ARMOR_SLOTS.Legs,
                      durability: 50,
                      value: 25,
                      armorRating: 1,
                      description: "They never say anything about no service without pants. But, they do keep prying eyes curious.",
                    }),
                    wop_armor({
                      name: 'Greiving Gauntlets',
                      equipmentSlot: ARMOR_SLOTS.Arm,
                      durability: 200,
                      value: 125,
                      armorRating: 2,
                      description: "This world was once cursed. When the curse was lifted, all that was left was an abundance of enchanted gauntlets. They weep, all day, all the time.",
                    }),
                  ],
                  weapons: [
                    wop_weapon({
                      name: "Dumb Ass Stick",
                      description: "A stupid peice of wood that has been sharpened.",
                      damage: 1,
                      criticalDamage: 2,
                      durability: 10,
                      stanimaCost: 0,
                      value: 50,
                    }),
                  ],
                }),
              }),
            }),
          ],
        }),
      ],
    });
  };

  return {
    allSpells,
    allMonsters,
    allPotions,
    createWorld,
  };
}
