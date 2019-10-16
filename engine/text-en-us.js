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
    },
    failingFields: {
      title: 'Failing Fields',
      description: "\"Thank the spiritual entities that you are here adventurer! How do I know are one? Look at your garb! Enough idle talk. I am in the need of your assistance. It seems that the rivalry with Reedton has gone a too far this time! Some of our crops have gone bad and the farmers swear that the fields were poisoned. I need you to confront the Lord of Reedton, Alexander, about this and report to me the details. Hurry, go, Buttleberry will be most in your debt.\"",
      instructions: "Go to the Grand Hall in Reedton Castle",
      nameOfObject: "Grand Hall"
    },
    speakingOfFarmFields: {
      title: "Speaking of Farm Fields",
      description: "I confronted Lord Alexander Reedton about the poisoned farm fields in Buttleberry and Lord Buttleberry's concerns. His face nearly exploded as he exclaimed, \"You.. HE dares to accuse me! Just yesterday our farmers brought to me the same complaints! Do you challenge my authority!? Go, see for yourself.\"",
      instructions: "Go to the Farm Fields in Reedton Grassland",
      nameOfObject: "Farm Fields"
    },
    lostSouls: {
      title: "Lost Souls",
      description: "The only words I could hear from him were repeated, \"They were here, but not, then the rest were not, gone, like ghosts, gone, gone... gone\". Eerie to say the least.",
      instructions: "Go to a haunted place",
      nameOfObject: "The Tall Tree",
    },
    puttingSoulsToRest: {
      title: "Putting Souls to Rest",
      description: "It seems that the souls the farmer spoke of were here all along. They seem miserable, trapped. One, a small spectre, weeping, speaks in the faintest of whispers. From the sillhouette, I could tell it was once a small child. She whispers to me, \"Release us... defeat the Souls that... harm... pain\". After that she weeps with a mighty wail. Her small shoulders rapidly rising and falling twice with each sob.",
      instructions: "Slay ten Souls",
      nameOfObject: "Soul",
    },
    collectSoulsFmt: (fullName) => ({
      title: `Collect Souls: ${fullName}`,
      description: `Collect the soul of ${fullName} to redeem yourself.`,
      instructions: `Slay 1 ${fullName}`,
      nameOfObject: fullName,
    })
  },
  Characters: {
    soulCollector: {
      name: "The Soul Collector",
      description: "A thin gray creature with long limbs, oval almond eyes, and a smooth surface. I cannot tell if it is wearing armor, clothes, or is in the buff. It opens a scroll urging me to do what I must. While the paper is blank, I understand what it says. I must accept."
    },
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
    },
    agitatedFarmer: {
      name: "Agitated Farmer",
      description: "He looks... lost, as if he has no purpose left in life. His eyes look at I, but it is as if he does not see me.",
    }
  },
  Monsters: {
    alchemist: {
      key: "Old Alchemist",
      name: "Alchemist",
      title: "Old",
      description: "Once a human, now a hunched bag of wrinkles and metal.",
    },
    darkVampire: {
      key: "Lord Vampire",
      name: "Vampire",
      title: "Lord",
      description: "Classic, fangs, cape, widows peak... man or woman I cannot tell. Also - big bat wings and lots of screeching."
    },
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
    largeRat: {
      key: "Large Rat",
      name: "Rat",
      title: "Large",
      description: "Of course this creature makes an appearance."
    },
    groveGuardian: {
      key: "Grove Guardian",
      name: "Guardian",
      title: "Grove",
      description: "It exists there, willowy, green and brown mottled about the bark skin."
    },
    vengefulSouls: {
      key: "Vengeful Soul",
      name: "Soul",
      title: "Vengeful",
      description: "A sad creature filled with hatred. It takes revenge upon the living from the afterlife. It takes on all horrific forms.",
    },
    hunchedSheet: {
      key: "Hunched Sheet",
      name: "Sheet",
      title: "Hunched",
      description: "It really is just a bed sheet, but something is beneath it."
    },
    skinlessSkeleton: {
      key: "Skinless Skeleton",
      name: "Skeleton",
      title: "Skinless",
      description: "A pile of bones held together with sinew and muscle."
    },
    cryingBoy: {
      key: 'Crying Boy',
      name: "Boy",
      title: "Crying",
      description: "A boy that crys. However, I can see through this apparition. As I stare, his face contorts and becomes a row of fangs and pincers."
    },
    infinity: {
      key: 'The Infinity',
      name: "Infinity",
      title: "The",
      description: "I see nothing. I feel nothing. Am I nothing?",
    }
  },
  Spells: {
    healingTouch: {
      hint: 'restore,health',
      name: "Healing Touch",
      description:
        "With cold clammy hands I rest my hand upon my breast. I feel goosebumps and feel somewhat better"
    },
    fireSpit: {
      hint: 'damage,combat',
      name: "Fire Spit",
      description:
        "I open my mouth and small flecks of flaming spittle burst forth, consuming my foe in flickers of flame."
    },
    vampiricBite: {
      hint: 'damage,combat,restore,health',
      name: "Vampiric Bite",
      description:
        "I open my mouth, canines extending. I bite hard on my foe and suck deep the life force."
    },
    alphaOmegaLight: {
      hint: 'damage,combat,restore,health,stanima,strength,toughness',
      name: "Light of the Alpha, Night of the Omega",
      description: "Heed the words as they resonate within your mind as light dims and the depths of your mind begin to form within the world."
    },
  },
  Potions: {
    potionOfPainlessness: {
      hint: "restore,health",
      name: "Potion of Painlessness",
      description: "It bubbles red and smells of sriracha."
    },
    potionOfManaEmpowerment: {
      hint: "restore,mana",
      name: "Potion of Mana Empowerment",
      description:
        "A blue potion that is thick and slimy. I assume that when I drink it, it will feel as though a family of slugs slide down my throat."
    },
    flamingJarOfShit: {
      hint: "damage,combat",
      name: "Flaming Jar of Shit",
      description: "It smells bad and it burns - seems legit"
    }
  },
  Places: {
    theVoid: {
      name: "The Void",
      description: "A place where only the dead can see",
    },
    eventHorizon: {
      name: "The Event Horizon",
      description: "The edge of space and time."
    },
    theBlackhole: {
      name: "The Black Hole",
      description: "A swirling miasma of space, time, and light",
    },
    phyntasieWorld: {
      name: "Phyntasie",
      description: "The world I love - or so they tell me."
    },
    buttleberryArea: {
      name: "Buttleberry",
      description: "A beautiful town upon the cliffs of an ocean."
    },
    marbleManorLocation: {
      name: "The Marble Manor",
      description: "Within Buttleberry is a large manor. Its walls are carved from a solid mammoth cut of marble. How such was acheived is only known by the original owners, long passed away. Although impressive, the building resembles a block with holes cut into it for windows and doors. Guards partrol the area, looking for nefarious individuals.",
    },
    groveOfTheElderLocation: {
      name: "Grove of the Elder",
      description: "These woods contain many mysteries. This is one of them. It is said that child sacrifice and the birth of demons took place here. The rituals too unspeakable to speak anymore of. It looks peacefull now, with the exception of the blood stained stone table resting in the middle of the grove. It speaks to me, calling my name.",
    },
    tallTreeLocation: {
      name: "The Tall Tree",
      description: "Of all the trees in this forest, this particular specimen seems to know the most. Its presence unsettles me. Sweat begins dripping down my eyes, stinging. However, I can't help but feel that it is this wooden creature before me, crying through my soul.",
    },
    widowerColossusLocation: {
      name: "The Widower Colossus",
      description: "Being the only sentitent being left in these wastes, I cannot help but feel a sense of lonliness emanate from the statue. It looks across the desert, peering, waiting for it's lover's return.",
    },
    cityGateLocation: {
      name: "City Gate",
      description: "Two large stone griffins peer into my eyes as I approach the iron-wrought gates of Buttleberry. They promise swift vengeance to evil-doers.",
    },
    dungeonLocation: {
      name: "Dungeons",
      description: "Well, it looks frightening enough. I wonder if there are any dragons. Yeah, what an adventure - dragons in dungeons.",
    },
    marketLocation: {
      name: "Market",
      description: "A bustling venue filled with various shops and treats. To the left are some amazing artists of puppetry and to the right more sweet shops. Children run up to me in awe, while mothers wink from a distance.",
    },
    castleLocation: {
      name: "Castle Reedton",
      description: "Large and forboding, this castle overlooks the town and surrounding oceaon. Flags whip about as the wind vicously strikes them. These standards signal the occupancy of the royalty. Perhaps paying them a visit will prove worthwhile.",
    },
    grasslandsLocation: {
      name: "Grasslands",
      description: "From coast to coast of this small island, outside the walls of the town of Reedton, there is the Grasslands. They stretch far. Where farmer has not settled, creatures have. Who knows what has been lost in this vast ocean of green fertile land.",
    },
    wharfLocation: {
      name: "Wharf",
      description: "The only way on or off this island legally. It controls the imports and exports of this island. It is said that one woman owns it all, and thus owns the island.",
    },
    sewersLocation: {
      name: "Sewers",
      description: "All the waste, and who knows what else, runs into these large caverns and into the ocean from the other side of the island. An engineering miracle.",
    },
    sewersRoom: {
      name: "Sewers",
      description: "It smells. That is the long and short of it."
    },
    roundSewerRoom: {
      name: "Round Sewer Room",
      description:
        "A large cavernous space within the sewers. There is no light. It still smells."
    },
    baronWastesArea: {
      name: "The Baron Wastes",
      description: "The moans of the dead ride the howling wind in this arid plane. Naught but my soul and those of the perished remain here. For miles, nothing can be seen. This is what remains of the Great War. The result of the combined wrath of the Lords and Ladies of Reedton and Buttleberry. Together they crushed the Baron of Lightwatch. Wasted by dark magic - nothing will grow here for millenia. Of Lightwatch itself - gone. Not even my map shows its final resting place.",
    },
    hauntedForestArea: {
      name: "Haunted Forest",
      description: "As always, this forest is haunted, filled with the nightmares born of the surrounding villagers suuperstitions and fears. It looms ahead, gaping, a maw ready to devour my soul. Have any ever made it through alive? Have any ever even attempted such a trail? Why not take the path?",
    },
    reedtonArea: {
      name: "Reedton",
      description: "A small town precariously nestled above the cliffs of a small island. It looks fragile, as if the first gust will take it - and it's inhabitants - into the deep blue. There seems to be more here and they share a friendly rivalry with Buttleberry."
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
    entranceRoom: {
      name: "Entrance",
      description: "A dank, smelly, cold room filled with other rooms. Oddly enough, entrances are also exits.",
    },
    sewerEntranceRoom: {
      name: "Sewer Entrance",
      description: "A hole in the ground covered by a large copper plate. Easily set aside. Down I go!",
    },
    sewerHallwayRoom: {
      name: "Sewer Hallway",
      description: "A long, dank, smelly, place. What could possibly be here?",
    },
    sewerCavern: {
      name: "Sewer Cavern",
      description: "Chunks of the sewer has fallen away and something has burrowed in. Dare I see who is home?",
    },
    sewerCrossroads: {
      name: "Sewer Crossroads",
      description: "Many other sewer hallways connect here, making for one large cesspool. Blech! What drove me here?",
    },
    castleEntranceRoom: {
      name: "Castle Entrance",
      description: "Majestic gates stand before me and wary guards' eyes wander over my exteriior, best stow the weapons... for now.",
    },
    grandHallRoom: {
      name: "Grand Hall",
      description: "Large, ornate, and full of loot. Best get started.",
    },
    farmFieldsRoom: {
      name: "Farm Fields",
      description: "The wind lazily pushes the large strands of wheat around. They sway as if drunk on the sunlight. The only menacing feeling I have is the wonder of what could hide beneath the stalks.",
    },
    burnedHomeRoom: {
      name: "Burned Home",
      description: "I gather this buliding used to house a family. Now, telling by the sorcerous scortches upon the skeletons and foundation, it houses only the souls of the deceased.",
    },
    overlookHillRoom: {
      name: "Overlook Hill",
      description: "Looming in the distance the opposite of the island, I can see Reedton. So interesting, a bustling city, diminished to such a puny size by something as simple as distance. I look down and note: This hill... it does not seem natural."
    },
  },
  Items: {
    infinityShardRelic: {
      name: 'Infinity Shard',
      description: 'Made from pure time. I cannot comprehend any other thing this is made of.'
    },
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
      description: "A stupid piece of wood that has been sharpened."
    },
    silverChalice: {
      name: "Silver Chalice",
      description: "A chalice made of silver. At least, it seems so."
    },
    boots: {
      name: "Boots",
      description: "Leather knee high boots, fit for combat. At least, more so that sandals."
    },
    cuirass: {
      name: "Cuirass",
      description: "A plate of metal made to wrap arround my chest and back. It is a snug fit, but a safe fit."
    },
    corinthianHelmet: {
      name: "Corinthian Helmet",
      description: `I am not sure who this "Corinthian" is, but her helmet sure is a beauty. It has nice metal cheek and nose guards. The mane is a bit osentatious, but I like it.`
    },
    greaves: {
      name: "Greaves",
      description: "Metal plates that strap to my bulky calves."
    },
    gauntlets: {
      name: "Gauntlets",
      description: "Metal gloves. Simple as that."
    },
    lance: {
      name: "Lance",
      description: "A one time use tree sharpened to a point. It causes massive damage."
    },
    spikedWoodClub: {
      name: 'Spiked Wood Club',
      description: "A stump of wood with old nails pounded through to the other side. Brutally effective.",
    },
    sharpenedMetalPole: {
      name: "Sharpened Metal Pole",
      description: "An old peice of building support, weaponized.",
    },
    infinityPlate: {
      name: "Infinity Plate",
      description: "A plate of armor made from solid rainbows.",
    },
    infinityGloves: {
      name: "Gloves of the Infinite Grasping",
      description: "Gloves that enable the ability to grasp what does not exsist."
    },
    infinityBoots: {
      name: "Boots of the Void Walker",
      description: "Pure light that fuses upon the soles of feet. Flight is now possible."
    },
    infinityHelmet: {
      name: "Hat of Omniscience",
      description: "42",
    },
    infinityPants: {
      name: "Overalls of the Traveler",
      description: "Pants and straps made from the dreams of toddlers and the nightmares of dogs."
    },
    infinityWeapon: {
      name: "U1dOb0lHSnBiaUJrYVdVZ1JYaHBjM1JsYm5vZ1pHVnlJRlZ1Wlc1a2JHbGphR3RsYVhRZ2RXNWtJSFpsY25OMVkyaGxMQ0JrWVhNc0lIZGhjeUJwWTJnZ1oyVmliM0psYmlCb1lXSmxMQ0I2ZFhMRHZHTnJlblZuWlhkcGJtNWxiZz09",
      description: "U1dOb0lHSnBiaUJrYVdVZ1JYaHBjM1JsYm5vZ1pHVnlJRlZ1Wlc1a2JHbGphR3RsYVhRZ2RXNWtJSFpsY25OMVkyaGxMQ0JrWVhNc0lIZGhjeUJwWTJnZ1oyVmliM0psYmlCb1lXSmxMQ0I2ZFhMRHZHTnJlblZuWlhkcGJtNWxiZz09",
    },
  },
  GameMessages: {
    nothing: "All seems quiet here.",
    notInCombat: "I am not in combat right now.",
    cannotLeaveInCombat: "I cannot leave while in combat",
    cannotPurchase: "I cannot purchase anything at this time.",
    canBuyTheFollowing: "I can buy the following.",
    noMarket: "There is no market where I am at.",
    cannotEquipFmt: (itemName) => `I cannot equip ${itemName}. It is not possible to do so.`,
    cannotCastFmt: (spellName) => `I do not know how to cast ${spellName}`,
    questCompleteFmt: ({ title }) => `Completed ${title}!`,
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
    moveFmt: function({ name, description, questComplete, questTitle, triggeredQuests }) {
      return `I move forth to ${name}. ${description}. ${
        questComplete ? `Completed ${questTitle}! ` : intlText.Empty
      }${triggeredQuests.join('. ')}`;
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
