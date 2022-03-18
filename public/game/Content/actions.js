window.Actions = {
  ATTACK1: {
    name: "Slash",
    description: "Take out your weapon and slash your opponent.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 13 }
    ]
  },
  ATTACK2: {
    name: "Stab",
    description: "Stab your opponent with a poison-soaked blade.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10 }
    ]
  },
  ATTACK3: {
    name: "Sleep dart",
    description: "Send your opponent straight to his bed.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 5 }
    ]
  },
  ATTACK4: {
    name: "Furious Attack",
    description: "Attack in quick successions.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 12 }
    ]
  },
  ATTACK5: {
    name: "Quick Strike",
    description: "A strike that lands before others.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10 }
    ]
  },
  ATTACK6: {
    name: "Rugpull",
    description: "Funds are not SAFU.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 15}
    ]
  },
  ATTACK7: {
    name: "Bull Flag",
    description: "Uppercut with Bullish conviction.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 15 }
    ]
  },
  ATTACK8: {
    name: "Bear Market Swipe",
    description: "Buy the dip.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 9 }
    ]
  },
  ATTACK9: {
    name: "Floor Sweep",
    description: "Sweep the Floor.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 7 }
    ]
  },
  ATTACK10: {
    name: "Shill",
    description: "To the moon.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 7 }
    ]
  },
  ATTACK11: {
    name: "Paperhands",
    description: "Take out a napkin and hit smack your opponent with it.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 2 }
    ]
  },
  ATTACK12: {
    name: "Diamondhands",
    description: "A strong attack with the fierce power of diamonds behind it.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 17 }
    ]
  },
  ATTACK13: {
    name: "HODL",
    description: "A mighty attack using memecoins.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 12 }
    ]
  },
  ATTACK14: {
    name: "MAD Strike",
    description: "Originally from the burrow, this fighting technique is super effective against FUD.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 13 }
    ]
  },
  ATTACK15: {
    name: "Headbutt",
    description: "Hit your opponent with your huge forehead.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 8 }
    ]
  },
  FIRE_ATTACK1: {
    name: "Kindle",
    description: "A weak fire attack.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 6 }
    ]
  },
  FIRE_ATTACK2: {
    name: "Fire Fist",
    description: "A fist imbued with fire.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10 }
    ]
  },
  FIRE_ATTACK3: {
    name: "Dragon Breath",
    description: "The warrior channels his inner dragon and exhales.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 13 }
    ]
  },
  FIRE_ATTACK4: {
    name: "Fire Storm",
    description: "A fiery blaze.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 15 }
    ]
  },
  FIRE_ATTACK5: {
    name: "Inner Fire",
    description: "Become pure flame.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 17 }
    ]
  },
  MOON_ATTACK1: {
    name: "Meteor Strike",
    description: "Harness the power of the Lunar Eclipse.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 15 }
    ]
  },
  MOON_ATTACK2: {
    name: "Lunar Eclipse",
    description: "",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 13 }
    ]
  },
  MOON_ATTACK3: {
    name: "Blood Moon",
    description: "A blood moon rises.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10 }
    ]
  },
  MOON_ATTACK4: {
    name: "Luna",
    description: "Moonlight strikes the opponent.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 13 }
    ]
  },
  MOON_ATTACK5: {
    name: "Moon fall",
    description: "Heavy moonlight strikes the opponent.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 16 }
    ]
  },
  WATER_ATTACK1: {
    name: "Splash attack",
    description: "Throw a water bomb.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 4 }
    ]
  },
  WATER_ATTACK2: {
    name: "Submerged",
    description: "Submerge your opponent in water.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 9 }
    ]
  },
  WATER_ATTACK3: {
    name: "Water Sword",
    description: "Imbue your sword with the power of water.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 13 }
    ]
  },
  WATER_ATTACK4: {
    name: "Scatter shot",
    description: "Form icicles and throw them.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 15 }
    ]
  },
  WATER_ATTACK5: {
    name: "Tsunami",
    description: "A colossal tidal wave.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 15 }
    ]
  },
  THUNDER_ATTACK1: {
    name: "Electric shock",
    description: "Electricity flows through you.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 12 }
    ]
  },
  THUNDER_ATTACK2: {
    name: "Electrified Surface",
    description: "The surface below you becomes electrified.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 8 }
    ]
  },
  THUNDER_ATTACK3: {
    name: "Precise Lighting",
    description: "Pinpoint accurate Lighting strike.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 13 }
    ]
  },
  THUNDER_ATTACK4: {
    name: "High Voltage",
    description: "Overload to cause extra damage.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 17 }
    ]
  },
  THUNDER_ATTACK5: {
    name: "Thunder Slap",
    description: "Weak thunder attack.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 9 }
    ]
  },
  WIND_ATTACK1: {
    name: "Razor Wind",
    description: "A razor sharp wind.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 7 }
    ]
  },
  WIND_ATTACK2: {
    name: "Tornado Blast",
    description: "Tornado comes crashing down.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 13 }
    ]
  },
  WIND_ATTACK3: {
    name: "Emperor’s Breath",
    description: "The Emperor’s Will flows through you.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 18 }
    ]
  },
  WIND_ATTACK4: {
    name: "Fleeting wind",
    description: "A mischevious wind attack.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 15 }
    ]
  },
  WIND_ATTACK5: {
    name: "Coup de Burst",
    description: "A dangerous attack that combines technology and the power of the wind.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 17 }
    ]
  },
  SPECIAL_WIND_ATTACK1: {
    name: "Air Exoskeleton",
    description: "Surround yourself with a armor of wind.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", status: { type: "saucy", expiresIn: 1 } }
    ]
  },
  SPECIAL_WIND_ATTACK2: {
    name: "Sonic Kick",
    description: "Use the wind to catch flight come crashing down on your enemy at sonic.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 18 }
    ]
  },
  SPECIAL_WIND_ATTACK3: {
    name: "Airbendind",
    description: "Aerokinetic ability to control and manipulate air.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 22 }
    ]
  },
  SPECIAL_FIRE_ATTACK1: {
    name: "Ash Resurrection",
    description: "Heal from the ashes of battle.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", status: { type: "saucy", expiresIn: 1 }  }
    ]
  },
  SPECIAL_FIRE_ATTACK2: {
    name: "Flame Mimicry",
    description: "Generate a flaming doppelgänger to fight by your side.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 21 }
    ]
  },
  SPECIAL_FIRE_ATTACK3: {
    name: "Super Nova",
    description: "Transform into a blaze as hot as the sun.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 22 }
    ]
  },
  SPECIAL_WATER_ATTACK1: {
    name: "Water Core",
    description: "Manipulate the water in your body to heal yourself.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", status: { type: "saucy", expiresIn: 1 }  }
    ]
  },
  SPECIAL_WATER_ATTACK2: {
    name: "Hydro Surf",
    description: "Create a wave and surf dash around the enemy relentlessly.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 17 }
    ]
  },
  SPECIAL_WATER_ATTACK3: {
    name: "Ice-Cutioner",
    description: "Freeze your enemy to the core.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 22 }
    ]
  },
  SPECIAL_MOON_ATTACK1: {
    name: "Susanô",
    description: "Awaken the power of Mangekyou Sharingan.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 23 }
    ]
  },
  SPECIAL_MOON_ATTACK2: {
    name: "Full moon",
    description: "Use the power of the full moon to heal.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", status: { type: "saucy", expiresIn: 1 }  }
    ]
  },
  SPECIAL_MOON_ATTACK3: {
    name: "Moon gate",
    description: "Release warriors from another realm to aid you.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 17 }
    ]
  },
  SPECIAL_THUNDER_ATTACK1: {
    name: "Thunder Dome",
    description: "Generate a thunder dome around the battlefield, lightning strikes periodically at the enemy.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 21 }
    ]
  },
  SPECIAL_THUNDER_ATTACK2: {
    name: "Seismic Storm",
    description: "Manipulate the loudest thunderstorm that vibrates the earth.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 23 }
    ]
  },
  SPECIAL_THUNDER_ATTACK3: {
    name: "Turbo Shock",
    description: "A direct electric shot to your heart, hopefully it doesn’t explode.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 23  }
    ]
  },
  // ATTACK16: {
  //   name: "DEGEN",
  //   description: "A risky powerup either will hurt you or favour you.",
  //   success: [
  //     { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
  //     { type: "animation", animation: "spin"},
  //     { type: "stateChange", damage: }
  //   ]
  // },
  damage1: {
    name: "Rug pull!",
    description: "NOT SAFU",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
       { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10}
    ]
  },
  damage2: {
    name: "Shuriken",
    description: "Throw a shuriken on your opponent",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10}
    ]
  },
  damage4: {
    name: "Rugpull!",
    description: "NOT SAFU",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 50}
    ]
  },
  damage3: {
    name: "Shuriken",
    description: "Throw a shuriken on your opponent",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 20}
    ]
  },
  saucyStatus: {
    name: "Senzu",
    description: "Take the power of the beans",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "stateChange", status: { type: "saucy", expiresIn: 3 } }
    ]
  },
  clumsyStatus: {
    name: "Spit",
    description: "Spit on your opponent",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "clumsy", expiresIn: 3 }, damage:15 },
      { type: "textMessage", text: "{TARGET} is slipping all around!"},
    ]
  },
  //Items
  // item_recoverStatus: {
  //   name: "Bandage",
  //   description: "Feeling fresh and warm",
  //   targetType: "friendly",
  //   success: [
  //     { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
  //     { type: "stateChange", status: null },
  //     { type: "textMessage", text: "Feeling fresh!", },
  //   ]
  // },
  item_recoverHp: {
    name: "Bandage",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} sprinkles on some {ACTION}!", },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: "{CASTER} recovers HP!", },
    ]
  },
}