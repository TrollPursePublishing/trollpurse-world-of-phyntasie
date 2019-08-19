const intlText = {
  Empty: "",
  Quests: {
    theImpMenace: {
      description:
        "Hear ye! Hear ye, there are most abundant collections of nasty creatures within our dungeon that are of most import to remove from the vacinity. Rewards, a-plenty. Honor, a-plenty. All bestowed upon the completion of this boon from our most merciful Lord Buttleberry!",
      instructions: "Slay three Imps",
      nameOfObject: "Imp",
      title: "The Imp Menace"
    },
    peskyImpsMustDie: {
      description: "Imps are so Pesky! They must all DIE!",
      instructions: "Kill 1 Imp",
      nameOfObject: "Imp",
      title: "Pesky Imps Must Die"
    },
    oneLastGlimpse: {
      title: "One Last Glimpse...",
      description:
        "Dear Adventurer, will you aid a foolish old man? Like you, I used to adventure, until I took a bolt to the hip. I have seen many things, marvelous things: creatures you cannot imagine, dungeons deeper than the earth itself, and treasures beyond mortal comprehension. Alas, I have never laid my eyes upon on object of which I could never find. Will you assist me... with my dying wish? I wish to lay eyes upon the Basket of Rock, go forth and find it, please, afore I waste to nothing.",
      instructions: "Explore and find one Basket of Rock",
      nameOfObject: "Basket of Rock"
    },
    oneFinalTreasure: {
      title: "One Final Treasure",
      description: "The old man wanted to see this back at Reedton Wharf.",
      instructions: "Go to Reedton Wharf",
      nameOfObject: "Reedton Wharf"
    }
  },
  Characters: {
    buttleberryHerald: {
      name: "Town Herald",
      description:
        "He stands there, smug, with his uniform sporting a large orange berry. His myraid colours truly relay his job - a herald. Town crier, the easiest job of late. A true slacker. However, it seems he has a job for me."
    },
    oldDirtyMan: {
      name: "Old Dirty Man",
      description: "He sits there. Hunched. Smelly. Wrinkled."
    },
    dyingGentleman: {
      name: "Dying Gentleman",
      description:
        "The Dying Gentleman is sitting there, hands folded. His eyes wander to me, looking hopefully. I feel drawn to him, as if I share a brotherhood. It seems he has something to request of me."
    },
    lordButtleberry: {
      name: "Lord Buttleberry",
      description:
        "Lord Buttleberry stands at his Manor, clearly agitated. He paces, his leather boots echo across the manor grounds"
    }
  },
  Monsters: {
    peskyImp: {
      key: "Pesky Imp",
      name: "Imp",
      title: "Pesky",
      description:
        "A small creature with fangs and wings. It grins and drools. I find it ugly."
    },
    buffedImp: {
      key: "Buffed Imp",
      name: "Imp",
      title: "Buffed",
      description:
        "This dude is swoll! Still ugly as sin - but swoll none the less"
    },
    sewerTurtle: {
      key: "Sewer Turtle",
      name: "Turtle",
      title: "Sewer",
      description: "Small and hard... sounds familiar."
    },
    largeRate: {
      key: "Large Rat",
      name: "Rat",
      title: "Large",
      description: "Of course this creature makes an appearance."
    }
  },
  Spells: {
    healingTouch: {
      name: "Healing Touch",
      description:
        "With cold clammy hands I rest my hand upon my breast. I feel goosebumps and feel somewhat better"
    },
    fireSpit: {
      name: "Fire Spit",
      description:
        "I open my mouth and small flecks of flaming spittle burst forth, consuming my foe in flickers of flame."
    },
    vampiricBite: {
      name: "Vampiric Bite",
      description:
        "I open my mouth, canines extending. I bite hard on my foe and suck deep the life force."
    }
  },
  Potions: {
    potionOfPainlessness: {
      name: "Potion of Painlessness",
      description: "It bubbles red and smells of sriracha."
    },
    potionOfManaEmpowerment: {
      name: "Potion of Mana Empowerment",
      description:
        "A blue potion that is thick and slimy. I assume that when I drink it, it will feel as though a family of slugs slide down my throat."
    },
    flamingJarOfShit: {
      name: "Flaming Jar of Shit",
      description: "It smells bad and it burns - seems legit"
    }
  },
  Places: {
    phyntasieWorld: {
      name: "Phyntasie",
      description: "The world I love - or so they tell me."
    },
    buttleberryArea: {
      name: "Buttleberry",
      description: "A beautiful town upon the cliffs of an ocean."
    },
    taxPlazaLocation: {
      name: "Tax Plaza",
      description: "The place of one of the certian things in life."
    },
    townSquareLocation: {
      name: "Town Square",
      description:
        "A square in the town. I guess I should not have expected more than that."
    },
    sewersRoom: {
      name: "Sewers",
      description: "It smells. Like shit. That is the long and short of it."
    },
    roundSewerRoom: {
      name: "Round Sewer Room",
      description:
        "A large cavernous space within the sewers. There is no light. It still smells like shit."
    }
  },
  Items: {
    sandals: {
      name: "Sandals",
      description:
        "Thin, strappy, and pretty much useless. But they sure are trusty."
    },
    plateWithStraps: {
      name: "Plate with Straps",
      description:
        "A ceramic plate that covers my sternum. Seriously, this is armor."
    },
    clotheCap: {
      name: "Clothe Cap",
      description:
        "Yup, a cap. Yup, made of clothe. Keeps the sun off my face though."
    },
    canvasPants: {
      name: "Canvas Pants",
      description:
        "They never say anything about no service without pants. But, they do keep prying eyes curious."
    },
    greivingGauntlets: {
      name: "Greiving Gauntlets",
      description:
        "This world was once cursed. When the curse was lifted, all that was left was an abundance of enchanted gauntlets. They weep, all day, all the time."
    },
    dumbAssStick: {
      name: "Dumb Ass Stick",
      description: "A stupid peice of wood that has been sharpened."
    },
    silverChalice: {
      name: "Silver Chalice",
      description: "A chalice made of silver. At least, it seems so."
    }
  },
  ActionResults: {
    reviveFmt: function({ fullName }) {
      return `${fullName} has been revived by the magic of the world.`;
    },
    emptyBottle: "An empty bottle!",
    restoreFmt: function({ amount, attribute }) {
      return `Restored ${amount} ${attribute}. `;
    },
    damageFmt: function({ amount, targetFullName, targetCurrentHealth }) {
      return `Caused ${amount} pain to ${targetFullName}! ${targetFullName} has ${targetCurrentHealth} health remaining. `;
    },
    requiresCombat:
      "I used this outside of combat. It could have been more useful then.",
    deathFmt: function({ fullName }) {
      return `${fullName} has been slain by the misfortunes of this world`;
    },
    moveFmt: function({ name, description, questComplete, questTitle }) {
      return `I move forth to ${name}. ${description}. ${
        questComplete ? `Completed ${questTitle}!` : intlText.Empty
      }`;
    },
    itemAddedToInventoryFmt: function({ name, description }) {
      return `${name} added to inventory. ${description}`;
    },
    itemRemovedFromInventoryFmt: function({ name }) {
      return `${name} removed from inventory.`;
    },
    itemBoughtFmt: function({ name, value, inventoryGold }) {
      return `Purchased ${name} for ${value}. I have ${inventoryGold} gold left.`;
    },
    itemMoreGoldFmt: function({ goldNeeded }) {
      return `I cannot afford this! I need ${goldNeeded} more gold.`;
    },
    weaponEquippedFmt: function({ name }) {
      return `Equipped weapon ${name}.`;
    },
    armorEquippedFmt: function({ name }) {
      return `Equipped armor ${name}`;
    },
    armorUnequippedFmt: function({ name }) {
      return `Unequipped armor ${name}`;
    },
    weaponUnequippedFmt: function({ name }) {
      return `Unequipped weapon ${name}`;
    },
    spellRequiresMoreManaFmt: function({ currentMana, spellName }) {
      return `${currentMana} is not enought mana to cast ${spellName}`;
    },
    armorBrokenFmt: function({ name }) {
      return `${name} has broken!`;
    },
    defendFmt: function({
      instigatorFullName,
      totalDamage,
      instanceFullName,
      instanceCurrentHealth,
      brokens
    }) {
      return `${instigatorFullName} has caused ${totalDamage} pain to ${
        instanceFullName
      }. ${instanceFullName} has ${instanceCurrentHealth} health remaining. ${brokens.join(
        " "
      )}`;
    },
    combatOverFmt: function({ instanceFullName, targetFullName }) {
      return `${instanceFullName} has disengaged combat from ${targetFullName}`;
    },
    engageFmt: function({
      instanceFullName,
      targetFullName,
      targetDescription
    }) {
      return `${instanceFullName} has engaged combat with ${
        targetFullName
      }. ${targetDescription}`;
    }
  }
};
