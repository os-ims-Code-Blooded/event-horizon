import database from "../../database";

async function seed() {

  try {

    const cards = [
      {
          "name": "Plasma Torpedo",
          "description": "standard issue ordinance",
          "damage": 20,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 0,
          "points": 0
      },
      {
          "name": "Plasma Shield",
          "description": "adds 20 to armor",
          "damage": 0,
          "armor": 20,
          "image_url": "",
          "duration": 1,
          "effect": "",
          "score_required": 0,
          "points": 0
      },
      {
          "name": "BFG Cannon",
          "description": "*Doom music intensifies*",
          "damage": 40,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 0,
          "points": 0
      },
      {
          "name": "Repair Drone",
          "description": "repairs 10 armor for 2 turns",
          "damage": 0,
          "armor": 10,
          "image_url": "",
          "duration": 2,
          "effect": "",
          "score_required": 0,
          "points": 0
      },
      {
          "name": "Phaser Charge",
          "description": "shield-to-phaser power conversion",
          "damage": 10,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 0,
          "points": 0
      },
      {
          "name": "Nano Machines",
          "description": "Armstrong-class repair fleet",
          "damage": 0,
          "armor": 5,
          "image_url": "",
          "duration": 10,
          "effect": "",
          "score_required": 1000,
          "points": 0
      },
      {
          "name": "Auxiliary Laser",
          "description": "Too hot, hot ****",
          "damage": 30,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 25,
          "points": 0
      },
      {
          "name": "Tortoise Shell",
          "description": "It's a lot of armor",
          "damage": 0,
          "armor": 40,
          "image_url": "",
          "duration": 1,
          "effect": "",
          "score_required": 250,
          "points": 0
      },
      {
          "name": "Hullbreaker",
          "description": "Persistent laser for penetrating shields",
          "damage": 5,
          "armor": 0,
          "image_url": "",
          "duration": 4,
          "effect": "",
          "score_required": 250,
          "points": 0
      },
      {
          "name": "Gorlakx Quasar Slime Cannon",
          "description": "Alien slime tech",
          "damage": 25,
          "armor": 0,
          "image_url": "",
          "duration": 2,
          "effect": "",
          "score_required": 100,
          "points": 0
      },
      {
          "name": "Grav Gun",
          "description": "Emits 2 gravitational pulses",
          "damage": 15,
          "armor": 0,
          "image_url": "",
          "duration": 1,
          "effect": "",
          "score_required": 100,
          "points": 0
      },
      {
          "name": "Photon Torpedo",
          "description": "Like the plasma torp, but slightly better",
          "damage": 25,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 50,
          "points": 0
      },
      {
          "name": "Cluster Bomb",
          "description": "10 damage over three rounds",
          "damage": 10,
          "armor": 0,
          "image_url": "",
          "duration": 2,
          "effect": "",
          "score_required": 75,
          "points": 0
      },
      {
          "name": "Stealth Screening",
          "description": "Slow, persistent evasion",
          "damage": 0,
          "armor": 3,
          "image_url": "",
          "duration": 5,
          "effect": "",
          "score_required": 750,
          "points": 0
      },
      {
          "name": "Tsar Bomba",
          "description": "Who needs SALT treaties?",
          "damage": 75,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 1500,
          "points": 0
      },
      {
          "name": "Plutonium Barrage",
          "description": "Pluto isn't a planet...",
          "damage": 2,
          "armor": 0,
          "image_url": "",
          "duration": 19,
          "effect": "",
          "score_required": 300,
          "points": 0
      },
      {
          "name": "RPG",
          "description": "It's old, but it works",
          "damage": 35,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 150,
          "points": 0
      },
      {
          "name": "Space Mines",
          "description": "floating explosive charges",
          "damage": 10,
          "armor": 0,
          "image_url": "",
          "duration": 1,
          "effect": "",
          "score_required": 750,
          "points": 0
      },
      {
          "name": "Kamehameha Wave",
          "description": "I'm just Saiyan...",
          "damage": 35,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 500,
          "points": 0
      },
      {
          "name": "Deflector Shield",
          "description": "For dings and scratches",
          "damage": 0,
          "armor": 10,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 25,
          "points": 0
      },
      {
          "name": "Another Plasma Torpedo",
          "description": "Gotta bring a backup",
          "damage": 20,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 500,
          "points": 0
      },
      {
          "name": "Dark Matter Phaser",
          "description": "uses space crystals or something",
          "damage": 0,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 1250,
          "points": 0
      },
      {
          "name": "Missle Battery",
          "description": "Threefer payload",
          "damage": 20,
          "armor": 0,
          "image_url": "",
          "duration": 2,
          "effect": "",
          "score_required": 800,
          "points": 0
      },
      {
          "name": "Space Gun",
          "description": "A gun, but in space",
          "damage": 10,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 0,
          "points": 0
      },
      {
          "name": "Boarding Crew",
          "description": "Send your crew on a lil vacay",
          "damage": 50,
          "armor": 0,
          "image_url": "",
          "duration": 1,
          "effect": "",
          "score_required": 5000,
          "points": 0
      },
      {
          "name": "Hack the Mainframe",
          "description": "cyberattack",
          "damage": 4,
          "armor": 0,
          "image_url": "",
          "duration": 7,
          "effect": "",
          "score_required": 1250,
          "points": 0
      },
      {
          "name": "Bomba",
          "description": "bread and butter ordinance",
          "damage": 15,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 150,
          "points": 0
      },
      {
          "name": "Red Shirt Sacrifice",
          "description": "\"we didn't need that engineer anyway\"",
          "damage": 0,
          "armor": 15,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 350,
          "points": 0
      },
      {
          "name": "Third Plasma Torpedo",
          "description": "Why not",
          "damage": 20,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 2500,
          "points": 0
      },
      {
          "name": "Antimatter Beam",
          "description": "On the contrary",
          "damage": 45,
          "armor": 0,
          "image_url": "",
          "duration": 0,
          "effect": "",
          "score_required": 3000,
          "points": 0
      },
      {
          "name": "Tractor Beam",
          "description": "grab on for two turns",
          "damage": 5,
          "armor": 0,
          "image_url": "",
          "duration": 2,
          "effect": "",
          "score_required": 50,
          "points": 0
      }
    ]

    await database.$connect();

    await database.cards.deleteMany();

    await database.cards.createMany({ data: cards });

    console.log(`
    +=====================================================================================+
    | Database seed successful; several cards have been populated in the database...      |
    +-------------------------------------------------------------------------------------+
    | Please remember the following and consider them as you create new cards:            |
    |                                                                                     |
    | 1) Due to the nature of how damage is calculated, a damage card may only do damage. |
    | 2) For damage cards, subtract -1 from any damage effect duration.                   |
    | 3) For defensive cards, must have a duration of at least 1.                         |
    | These considerations are due to how our algorithms process these cards.             |
    +=====================================================================================+
    `);

  } catch (error) {
    console.error(`Error on running database seed command...`)
  }

}

seed();