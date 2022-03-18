class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      }
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior (if they are standing)
    Object.values(this.gameObjects).forEach(object => {
      const current = object.behaviorLoop[object.behaviorLoopIndex];
      if (current && current.type === "stand") {
        object.doBehaviorEvent(this);
      }
    })

  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {

      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    id: "DemoRoom",
    lowerSrc: "/images/maps/PXL_Lower3.png",
    upperSrc: "/images/maps/PXL_Highier3.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(28),
        y: utils.withGrid(26),
      }),
      // npcA: new Person({
      //   x: utils.withGrid(9),
      //   y: utils.withGrid(9),
      //   src: "/images/characters/people/npc1.png",
      //   behaviorLoop: [
      //     { type: "walk", direction: "left", },
      //     { type: "walk", direction: "down", },
      //     { type: "walk", direction: "right", },
      //     { type: "walk", direction: "up", },
      //     //{ type: "stand", direction: "up", time: 400, },
      //   ],
      //   talking: [
      //     {
      //       required: ["TALKED_TO_ERIO"],
      //       events: [
      //         { type: "textMessage", text: "Isn't Erio the coolest?", faceHero: "npcA" },
      //       ]
      //     },
      //     {
      //       events: [
      //         { type: "textMessage", text: "I'm going to crush you!", faceHero: "npcA" },
      //         { type: "battle", enemyId: "beth" },
      //         { type: "addStoryFlag", flag: "DEFEATED_BETH"},
      //         { type: "textMessage", text: "You crushed me like weak pepper.", faceHero: "npcA" },
      //         { type: "textMessage", text: "Go away!"},
      //         { who: "npcB", type: "walk",  direction: "up" },
      //       ]
      //     }
      //   ]
      // }),
      // npcC: new Person({
      //   x: utils.withGrid(4),
      //   y: utils.withGrid(8),
      //   src: "/images/characters/people/npc1.png",
      //   behaviorLoop: [
      //     { type: "stand", direction: "left", time: 500, },
      //     { type: "stand", direction: "down", time: 500, },
      //     { type: "stand", direction: "right", time: 500, },
      //     { type: "stand", direction: "up", time: 500, },
      //   ],
      // }),
      // npcB: new Person({
      //   x: utils.withGrid(8),
      //   y: utils.withGrid(5),
      //   src: "/images/characters/people/erio.png",
      //   talking: [
      //     {
      //       events: [
      //         { type: "textMessage", text: "Bahaha!", faceHero: "npcB" },
      //         { type: "addStoryFlag", flag: "TALKED_TO_ERIO"}
      //         //{ type: "battle", enemyId: "erio" }
      //       ]
      //     }
      //   ]
      //   // behaviorLoop: [
      //   //   { type: "walk",  direction: "left" },
      //   //   { type: "stand",  direction: "up", time: 800 },
      //   //   { type: "walk",  direction: "up" },
      //   //   { type: "walk",  direction: "right" },
      //   //   { type: "walk",  direction: "down" },
      //   // ]
      // }),
      // pizzaStone: new PizzaStone({
      //   x: utils.withGrid(2),
      //   y: utils.withGrid(7),
      //   storyFlag: "USED_PIZZA_STONE",
      //   pizzas: ["v001", "f001"],
      // }),
    },
    walls: {
      [utils.asGridCoord(60,24)] : true,
      [utils.asGridCoord(63,23)] : true,
      [utils.asGridCoord(64,23)] : true,
      [utils.asGridCoord(67,22)] : true,
      [utils.asGridCoord(68,23)] : true,
      [utils.asGridCoord(69,23)] : true,
      [utils.asGridCoord(70,23)] : true,
      [utils.asGridCoord(71,23)] : true,
      [utils.asGridCoord(72,23)] : true,
      [utils.asGridCoord(72,24)] : true,
      [utils.asGridCoord(72,25)] : true,
      [utils.asGridCoord(72,26)] : true,
      [utils.asGridCoord(72,27)] : true,
      [utils.asGridCoord(72,28)] : true,
      [utils.asGridCoord(72,29)] : true,
      [utils.asGridCoord(72,30)] : true,
      [utils.asGridCoord(72,31)] : true,
      [utils.asGridCoord(72,32)] : true,
      [utils.asGridCoord(72,33)] : true,
      [utils.asGridCoord(72,34)] : true,
      [utils.asGridCoord(72,35)] : true,
      [utils.asGridCoord(71,35)] : true,
      [utils.asGridCoord(70,35)] : true,
      [utils.asGridCoord(69,35)] : true,
      [utils.asGridCoord(68,35)] : true,
      [utils.asGridCoord(68,36)] : true,
      [utils.asGridCoord(68,37)] : true,
      [utils.asGridCoord(67,37)] : true,
      [utils.asGridCoord(66,37)] : true,
      [utils.asGridCoord(65,37)] : true,
      [utils.asGridCoord(64,37)] : true,
      [utils.asGridCoord(63,37)] : true,
      [utils.asGridCoord(63,38)] : true,
      [utils.asGridCoord(63,39)] : true,
      [utils.asGridCoord(63,40)] : true,
      [utils.asGridCoord(62,40)] : true,
      [utils.asGridCoord(61,40)] : true,
      [utils.asGridCoord(60,40)] : true,
      [utils.asGridCoord(59,40)] : true,
      [utils.asGridCoord(59,41)] : true,
      [utils.asGridCoord(58,41)] : true,
      [utils.asGridCoord(57,41)] : true,
      [utils.asGridCoord(56,41)] : true,
      [utils.asGridCoord(55,41)] : true,
      [utils.asGridCoord(55,42)] : true,
      [utils.asGridCoord(55,43)] : true,
      [utils.asGridCoord(54,43)] : true,
      [utils.asGridCoord(53,43)] : true,
      [utils.asGridCoord(52,43)] : true,
      [utils.asGridCoord(51,43)] : true,
      [utils.asGridCoord(50,43)] : true,
      [utils.asGridCoord(49,43)] : true,
      [utils.asGridCoord(48,43)] : true,
      [utils.asGridCoord(48,42)] : true,
      [utils.asGridCoord(48,41)] : true,
      [utils.asGridCoord(47,41)] : true,
      [utils.asGridCoord(46,41)] : true,
      [utils.asGridCoord(46,42)] : true,
      [utils.asGridCoord(46,43)] : true,
      [utils.asGridCoord(46,44)] : true,
      [utils.asGridCoord(46,45)] : true,
      [utils.asGridCoord(46,46)] : true,
      [utils.asGridCoord(46,47)] : true,
      [utils.asGridCoord(45,47)] : true,
      [utils.asGridCoord(44,47)] : true,
      [utils.asGridCoord(43,47)] : true,
      [utils.asGridCoord(42,47)] : true,
      [utils.asGridCoord(41,47)] : true,
      [utils.asGridCoord(40,47)] : true,
      [utils.asGridCoord(39,47)] : true,
      [utils.asGridCoord(38,47)] : true,
      [utils.asGridCoord(37,47)] : true,
      [utils.asGridCoord(36,47)] : true,
      [utils.asGridCoord(35,47)] : true,
      [utils.asGridCoord(34,47)] : true,
      [utils.asGridCoord(33,47)] : true,
      [utils.asGridCoord(32,46)] : true,
      [utils.asGridCoord(31,45)] : true,
      [utils.asGridCoord(30,45)] : true,
      [utils.asGridCoord(29,44)] : true,
      [utils.asGridCoord(28,44)] : true,
      [utils.asGridCoord(27,45)] : true,
      [utils.asGridCoord(26,45)] : true,
      [utils.asGridCoord(25,45)] : true,
      [utils.asGridCoord(25,44)] : true,
      [utils.asGridCoord(25,43)] : true,
      [utils.asGridCoord(23,42)] : true,
      [utils.asGridCoord(24,42)] : true,
      [utils.asGridCoord(22,43)] : true,
      [utils.asGridCoord(21,42)] : true,
      [utils.asGridCoord(20,41)] : true,
      [utils.asGridCoord(19,40)] : true,
      [utils.asGridCoord(19,39)] : true,
      [utils.asGridCoord(19,38)] : true,
      [utils.asGridCoord(19,37)] : true,
      [utils.asGridCoord(19,36)] : true,
      [utils.asGridCoord(20,35)] : true,
      [utils.asGridCoord(21,35)] : true,
      [utils.asGridCoord(23,35)] : true,
      [utils.asGridCoord(24,35)] : true,
      [utils.asGridCoord(25,35)] : true,
      [utils.asGridCoord(26,34)] : true,
      [utils.asGridCoord(26,33)] : true,
      [utils.asGridCoord(26,32)] : true,
      [utils.asGridCoord(26,31)] : true,
      [utils.asGridCoord(25,31)] : true,
      [utils.asGridCoord(24,31)] : true,
      [utils.asGridCoord(23,30)] : true,
      [utils.asGridCoord(22,29)] : true,
      [utils.asGridCoord(21,28)] : true,
      [utils.asGridCoord(20,29)] : true,
      [utils.asGridCoord(19,29)] : true,
      [utils.asGridCoord(18,28)] : true,
      [utils.asGridCoord(17,27)] : true,
      [utils.asGridCoord(18,26)] : true,
      [utils.asGridCoord(19,26)] : true,
      [utils.asGridCoord(20,26)] : true,
      [utils.asGridCoord(21,26)] : true,
      [utils.asGridCoord(22,25)] : true,
      [utils.asGridCoord(22,24)] : true,
      [utils.asGridCoord(22,23)] : true,
      [utils.asGridCoord(22,22)] : true,
      [utils.asGridCoord(22,21)] : true,
      [utils.asGridCoord(23,20)] : true,
      [utils.asGridCoord(23,19)] : true,
      [utils.asGridCoord(23,18)] : true,
      [utils.asGridCoord(23,17)] : true,
      [utils.asGridCoord(23,16)] : true,
      [utils.asGridCoord(23,15)] : true,
      [utils.asGridCoord(22,14)] : true,
      [utils.asGridCoord(21,13)] : true,
      [utils.asGridCoord(20,12)] : true,
      [utils.asGridCoord(20,11)] : true,
      [utils.asGridCoord(21,10)] : true,
      [utils.asGridCoord(22,11)] : true,
      [utils.asGridCoord(23,10)] : true,
      [utils.asGridCoord(24,10)] : true,
      [utils.asGridCoord(25,10)] : true,
      [utils.asGridCoord(26,11)] : true,
      [utils.asGridCoord(27,10)] : true,
      [utils.asGridCoord(28,10)] : true,
      [utils.asGridCoord(29,10)] : true,
      [utils.asGridCoord(30,10)] : true,
      [utils.asGridCoord(31,11)] : true,
      [utils.asGridCoord(31,12)] : true,
      [utils.asGridCoord(31,13)] : true,
      [utils.asGridCoord(31,14)] : true,
      [utils.asGridCoord(30,15)] : true,
      [utils.asGridCoord(31,15)] : true,
      [utils.asGridCoord(32,15)] : true,
      [utils.asGridCoord(33,14)] : true,
      [utils.asGridCoord(34,14)] : true,
      [utils.asGridCoord(35,14)] : true,
      [utils.asGridCoord(36,15)] : true,
      [utils.asGridCoord(37,15)] : true,
      [utils.asGridCoord(38,15)] : true,
      [utils.asGridCoord(38,14)] : true,
      [utils.asGridCoord(38,13)] : true,
      [utils.asGridCoord(38,12)] : true,
      [utils.asGridCoord(38,11)] : true,
      [utils.asGridCoord(39,10)] : true,
      [utils.asGridCoord(40,11)] : true,
      [utils.asGridCoord(40,12)] : true,
      [utils.asGridCoord(41,12)] : true,
      [utils.asGridCoord(42,12)] : true,
      [utils.asGridCoord(43,11)] : true,
      [utils.asGridCoord(44,10)] : true,
      [utils.asGridCoord(45,10)] : true,
      [utils.asGridCoord(46,10)] : true,
      [utils.asGridCoord(47,10)] : true,
      [utils.asGridCoord(48,10)] : true,
      [utils.asGridCoord(49,10)] : true,
      [utils.asGridCoord(50,10)] : true,
      [utils.asGridCoord(51,10)] : true,
      [utils.asGridCoord(52,10)] : true,
      [utils.asGridCoord(53,11)] : true,
      [utils.asGridCoord(53,12)] : true,
      [utils.asGridCoord(52,13)] : true,
      [utils.asGridCoord(52,14)] : true,
      [utils.asGridCoord(51,15)] : true,
      [utils.asGridCoord(50,16)] : true,
      [utils.asGridCoord(49,17)] : true,
      [utils.asGridCoord(48,18)] : true,
      [utils.asGridCoord(47,18)] : true,
      [utils.asGridCoord(46,18)] : true,
      [utils.asGridCoord(45,18)] : true,
      [utils.asGridCoord(44,17)] : true,
      [utils.asGridCoord(43,18)] : true,
      [utils.asGridCoord(42,18)] : true,
      [utils.asGridCoord(41,17)] : true,
      [utils.asGridCoord(40,17)] : true,
      [utils.asGridCoord(39,18)] : true,
      [utils.asGridCoord(38,18)] : true,
      [utils.asGridCoord(37,19)] : true,
      [utils.asGridCoord(38,20)] : true,
      [utils.asGridCoord(38,21)] : true,
      [utils.asGridCoord(39,22)] : true,
      [utils.asGridCoord(38,23)] : true,
      [utils.asGridCoord(39,23)] : true,
      [utils.asGridCoord(40,23)] : true,
      [utils.asGridCoord(41,22)] : true,
      [utils.asGridCoord(42,21)] : true,
      [utils.asGridCoord(43,21)] : true,
      [utils.asGridCoord(44,21)] : true,
      [utils.asGridCoord(45,21)] : true,
      [utils.asGridCoord(46,20)] : true,
      [utils.asGridCoord(47,20)] : true,
      [utils.asGridCoord(48,19)] : true,
      [utils.asGridCoord(49,20)] : true,
      [utils.asGridCoord(50,21)] : true,
      [utils.asGridCoord(51,22)] : true,
      [utils.asGridCoord(50,23)] : true,
      [utils.asGridCoord(49,24)] : true,
      [utils.asGridCoord(49,25)] : true,
      [utils.asGridCoord(49,26)] : true,
      [utils.asGridCoord(49,27)] : true,
      [utils.asGridCoord(49,28)] : true,
      [utils.asGridCoord(49,29)] : true,
      [utils.asGridCoord(49,30)] : true,
      [utils.asGridCoord(49,31)] : true,
      [utils.asGridCoord(48,26)] : true,
      [utils.asGridCoord(48,27)] : true,
      [utils.asGridCoord(50,31)] : true,
      [utils.asGridCoord(51,31)] : true,
      [utils.asGridCoord(52,31)] : true,
      [utils.asGridCoord(53,31)] : true,
      [utils.asGridCoord(54,31)] : true,
      [utils.asGridCoord(53,32)] : true,
      [utils.asGridCoord(55,30)] : true,
      [utils.asGridCoord(56,30)] : true,
      [utils.asGridCoord(57,29)] : true,
      [utils.asGridCoord(56,28)] : true,
      [utils.asGridCoord(56,27)] : true,
      [utils.asGridCoord(56,26)] : true,
      [utils.asGridCoord(57,25)] : true,
      [utils.asGridCoord(58,24)] : true,
      [utils.asGridCoord(58,23)] : true,
      [utils.asGridCoord(58,22)] : true,
      [utils.asGridCoord(57,21)] : true,
      [utils.asGridCoord(56,20)] : true,
      [utils.asGridCoord(55,19)] : true,
      [utils.asGridCoord(55,18)] : true,
      [utils.asGridCoord(55,17)] : true,
      [utils.asGridCoord(56,16)] : true,
      [utils.asGridCoord(57,17)] : true,
      [utils.asGridCoord(58,16)] : true,
      [utils.asGridCoord(59,16)] : true,
      [utils.asGridCoord(60,17)] : true,
      [utils.asGridCoord(61,17)] : true,
      [utils.asGridCoord(62,17)] : true,
      [utils.asGridCoord(63,17)] : true,
      [utils.asGridCoord(64,18)] : true,
      [utils.asGridCoord(65,19)] : true,
      [utils.asGridCoord(66,20)] : true,
      [utils.asGridCoord(66,21)] : true,
      [utils.asGridCoord(44,41)] : true,
      [utils.asGridCoord(44,42)] : true,
      [utils.asGridCoord(43,41)] : true,
      [utils.asGridCoord(43,42)] : true,
      [utils.asGridCoord(43,44)] : true,
      [utils.asGridCoord(43,45)] : true,
      [utils.asGridCoord(44,44)] : true,
      [utils.asGridCoord(44,45)] : true,
      [utils.asGridCoord(40,44)] : true,
      [utils.asGridCoord(40,45)] : true,
      [utils.asGridCoord(36,44)] : true,
      [utils.asGridCoord(36,45)] : true,
      [utils.asGridCoord(35,45)] : true,
      [utils.asGridCoord(32,23)] : true,
      [utils.asGridCoord(33,23)] : true,
      [utils.asGridCoord(34,23)] : true,
      [utils.asGridCoord(35,22)] : true,
      [utils.asGridCoord(36,23)] : true,
      [utils.asGridCoord(32,24)] : true,
      [utils.asGridCoord(37,24)] : true,
      [utils.asGridCoord(37,25)] : true,
      [utils.asGridCoord(38,26)] : true,
      [utils.asGridCoord(39,26)] : true,
      [utils.asGridCoord(40,26)] : true,
      [utils.asGridCoord(41,26)] : true,
      [utils.asGridCoord(42,27)] : true,
      [utils.asGridCoord(41,28)] : true,
      [utils.asGridCoord(40,28)] : true,
      [utils.asGridCoord(39,29)] : true,
      [utils.asGridCoord(40,30)] : true,
      [utils.asGridCoord(41,31)] : true,
      [utils.asGridCoord(42,31)] : true,
      [utils.asGridCoord(43,31)] : true,
      [utils.asGridCoord(44,31)] : true,
      [utils.asGridCoord(45,31)] : true,
      [utils.asGridCoord(44,32)] : true,
      [utils.asGridCoord(44,33)] : true,
      [utils.asGridCoord(43,34)] : true,
      [utils.asGridCoord(42,35)] : true,
      [utils.asGridCoord(41,34)] : true,
      [utils.asGridCoord(40,33)] : true,
      [utils.asGridCoord(39,32)] : true,
      [utils.asGridCoord(38,31)] : true,
      [utils.asGridCoord(37,30)] : true,
      [utils.asGridCoord(36,29)] : true,
      [utils.asGridCoord(35,28)] : true,
      [utils.asGridCoord(34,27)] : true,
      [utils.asGridCoord(33,25)] : true,

//DALOS


 

    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,4)]: [
        {
          events: [
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "stand",  direction: "up", time: 500 },
            { type: "textMessage", text:"You can't be in there!"},
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "walk",  direction: "left" },
          ]
        }
      ],
      [utils.asGridCoord(34,15)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "Kitchen",
              x: utils.withGrid(9),
              y: utils.withGrid(11), 
              direction: "down"
            }
          ]
        }
      ]
    }
    
  },
  Kitchen: {
    id: "Kitchen",
    lowerSrc: "/images/maps/KitchenLower.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(9),
        y: utils.withGrid(11),
      }),
      npcB: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(5),
        src: "/images/characters/people/npc3.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "We finally meet, Black Bunny! Let's end it once and for all", faceHero: "npcB" },
              { type: "battle", enemyId: "Bushi" },
              // { type: "addStoryFlag", flag: "DEFEATED_Bushi"},
              // { type: "textMessage", text: "You won the battle but the war isn't over.", faceHero: "npcB" },
              // { type: "textMessage", text: "Go away!"},
            ]
          }
        ]
      })
    },
    walls:{
      [utils.asGridCoord(0,3)] : true,
      [utils.asGridCoord(1,3)] : true,
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,3)] : true,
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,3)] : true,
      [utils.asGridCoord(7,3)] : true,
      [utils.asGridCoord(8,3)] : true,
      [utils.asGridCoord(9,3)] : true,
      [utils.asGridCoord(10,3)] : true,
      [utils.asGridCoord(11,3)] : true,
      [utils.asGridCoord(12,3)] : true,
      [utils.asGridCoord(13,3)] : true,
      [utils.asGridCoord(14,3)] : true,
      [utils.asGridCoord(15,3)] : true,
      [utils.asGridCoord(16,3)] : true,
      [utils.asGridCoord(17,3)] : true,
      [utils.asGridCoord(18,3)] : true,
      [utils.asGridCoord(19,3)] : true,
      [utils.asGridCoord(20,3)] : true,
      [utils.asGridCoord(20,4)] : true,
      [utils.asGridCoord(20,5)] : true,
      [utils.asGridCoord(20,6)] : true,
      [utils.asGridCoord(20,7)] : true,
      [utils.asGridCoord(20,8)] : true,
      [utils.asGridCoord(20,9)] : true,
      [utils.asGridCoord(20,10)] : true,
      [utils.asGridCoord(20,11)] : true,
      [utils.asGridCoord(19,11)] : true,
      [utils.asGridCoord(18,11)] : true,
      [utils.asGridCoord(17,11)] : true,
      [utils.asGridCoord(16,11)] : true,
      [utils.asGridCoord(15,11)] : true,
      [utils.asGridCoord(14,11)] : true,
      [utils.asGridCoord(13,11)] : true,
      [utils.asGridCoord(12,11)] : true,
      [utils.asGridCoord(11,11)] : true,
      [utils.asGridCoord(11,12)] : true,
      [utils.asGridCoord(11,13)] : true,
      [utils.asGridCoord(11,13)] : true,
      [utils.asGridCoord(10,13)] : true,
      [utils.asGridCoord(9,13)] : true,
      [utils.asGridCoord(8,13)] : true,
      [utils.asGridCoord(7,12)] : true,
      [utils.asGridCoord(7,11)] : true,
      [utils.asGridCoord(6,11)] : true,
      [utils.asGridCoord(5,11)] : true,
      [utils.asGridCoord(4,11)] : true,
      [utils.asGridCoord(3,11)] : true,
      [utils.asGridCoord(2,11)] : true,
      [utils.asGridCoord(1,11)] : true,
      [utils.asGridCoord(0,11)] : true,
      [utils.asGridCoord(-1,11)] : true,
      [utils.asGridCoord(-1,10)] : true,
      [utils.asGridCoord(-1,9)] : true,
      [utils.asGridCoord(-1,8)] : true,
      [utils.asGridCoord(-1,7)] : true,
      [utils.asGridCoord(-1,6)] : true,
      [utils.asGridCoord(-1,5)] : true,
      [utils.asGridCoord(-1,4)] : true,
      [utils.asGridCoord(-1,3)] : true,
      [utils.asGridCoord(-1,2)] : true,
      [utils.asGridCoord(-1,1)] : true,
     
     
     
     
    },
    cutsceneSpaces: {
      [utils.asGridCoord(9,12)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "DemoRoom",
              x: utils.withGrid(34),
              y: utils.withGrid(16), 
              direction: "down"
            }
          ]
        }
      ]
    }
  },
  Street: {
    id: "Street",
    lowerSrc: "/images/maps/StreetLower.png",
    upperSrc: "/images/maps/StreetUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(29,9)]: [
        {
          events: [
            { 
              type: "changeMap",
              map: "DemoRoom",
              x: utils.withGrid(5),
              y: utils.withGrid(10), 
              direction: "up"
            }
          ]
        }
      ]
    }
  }
}