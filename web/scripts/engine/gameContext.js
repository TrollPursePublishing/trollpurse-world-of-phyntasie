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
  } = wop_models();

  function heal(healthAmount, next = null) {
    return function(instigator, target) {
      let text = "";
      if (next) {
        text = next(instigator, target);
      }
      const oldHealth = instigator.attributes.currentHealth;
      instigator.attributes.currentHealth = Math.min(
        instigator.attributes.health,
        instigator.attributes.currentHealth + healthAmount
      );
      const amount = instigator.attributes.currentHealth - oldHealth;
      return text + `Healed ${amount} health. `;
    };
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
      return text + `Caused ${amount} pain to ${target.fullName}! `;
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
    "Potion of Healing": wop_potion({
      name: "Potion of Healing",
      description: "It bubbles green and smells of kale.",
      value: 5,
      apply: heal(5)
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
      })
    })
  };

  const defaultGameContext = () => {
    return {
      world: wop_world({
        name: "Phyntasie",
        description: "The world I love",
        areas: [
          wop_area({
            name: "Buttleberry",
            description: "A beautiful down upon the cliffs of an ocean.",
            locations: [
              wop_location({
                name: "Town Square",
                description: "A square, in the town. Duh.",
                monsters: [allMonsters["Imp"], allMonsters["Sewer Turtle"]],
                rooms: [
                  wop_room({
                    name: "Sewers",
                    description:
                      "It smells. Like shit. That is the long and short of it.",
                    isExit: true,
                    chanceForRelic: 0.05,
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
                      allPotions["Potion of Healing"]
                    ]
                  })
                })
              })
            ]
          })
        ]
      }),
      relics: []
    };
  };

  function wop_gameContext({ world, relics }) {
    const worldObj = wop_world(world);
    const relicsArr = relics.map(r => wop_relic(r));
    return {
      world: worldObj,
      relics: relicsArr
    };
  }

  return {
    allSpells,
    allMonsters,
    allPotions,
    defaultGameContext,
    wop_gameContext
  };
}
