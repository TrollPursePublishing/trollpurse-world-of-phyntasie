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
  } = wop_models();

  function heal(healthAmount, next = null) {
    return function (instigator, target) {
      let text = '';
      if (next) {
        text = next(instigator, target);
      }
      const oldHealth = instigator.attributes.currentHealth;
      instigator.attributes.currentHealth = Math.min(instigator.attributes.health, instigator.attributes.currentHealth + healthAmount);
      const amount = instigator.attributes.currentHealth - oldHealth;
      return text + `Healed ${amount} health.`;
    }
  }

  function damage(damageAmount, next = null) {
    return function (instigator, target) {
      let text = '';
      if (next) {
        text = next(instigator, target);
      }
      const oldHealth = target.attributes.currentHealth;
      target.attributes.currentHealth = Math.max(0, target.attributes.currentHealth - damageAmount);
      const amount = Math.abs(target.attributes.currentHealth - oldHealth);
      return text + `Caused ${amount} spell damage.`;
    }
  }

  function requiresCombat(next) {
    return function (instigator, target) {
      if (instigator.isInCombat && target) {
        return next(instigator, target);
      }
      return 'I am not in combat to use this spell!';
    }
  }

  const allSpells = {
    'Healing Touch': {
      description: 'With cold clammy hands I rest my hand upon my breast. I feel goosebumps and feel somewhat better',
      manaCost: 1,
      apply: heal(5),
    },
    'Fire Spit': {
      description: 'I open my mouth and small flecks of flaming spittle burst forth, consuming my foe in flickers of flame.',
      manaCost: 1,
      apply: requiresCombat(damage(3)),
    }
  }

  const allMonsters = {
    'Imp': wop_player({
      name: 'Imp',
      title: 'Pesky',
      description: 'A small creature with fangs and wings. It grins and drools. I find it ugly.',
    })
  };

  const defaultGameContext = () => {
    return {
      world: wop_world({
        name: 'Phyntasie',
        description: 'The world I love',
        areas: [
          wop_area({
            name: 'Buttleberry',
            description: 'A beautiful down upon the cliffs of an ocean.',
            locations: [
              wop_location({
                name: 'Town Square',
                description: 'A square, in the town. Duh.',
              }),
            ],
          }),
        ],
      }),
      relics: [],
    };
  }

  function wop_gameContext({
    world,
    relics,
  }) {
    const worldObj = wop_world(world);
    const relicsArr = relics.map(r => wop_relic(r));
    return {
      world: worldObj,
      relics: relicsArr,
    };
  }

  return {
    allSpells,
    allMonsters,
    defaultGameContext,
    wop_gameContext,
  };
}
