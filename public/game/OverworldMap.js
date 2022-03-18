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
    upperSrc: "/images/maps/PXL_Highier.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(22),
        y: utils.withGrid(16),
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
      [utils.asGridCoord(0,0)] : true,
      [utils.asGridCoord(72,35)] : true,
      [utils.asGridCoord(72,34)] : true,
      [utils.asGridCoord(71,34)] : true,
      [utils.asGridCoord(71,33)] : true,
      [utils.asGridCoord(71,32)] : true,
      [utils.asGridCoord(71,31)] : true,
      [utils.asGridCoord(71,30)] : true,
      [utils.asGridCoord(71,29)] : true,
      [utils.asGridCoord(71,28)] : true,
      [utils.asGridCoord(71,27)] : true,
      [utils.asGridCoord(71,26)] : true,
      [utils.asGridCoord(71,25)] : true,
      [utils.asGridCoord(71,24)] : true,
      [utils.asGridCoord(70,24)] : true,
      [utils.asGridCoord(69,24)] : true,
      [utils.asGridCoord(68,24)] : true,
      [utils.asGridCoord(68,23)] : true,
      [utils.asGridCoord(68,22)] : true,
      [utils.asGridCoord(67,22)] : true,
      [utils.asGridCoord(66,22)] : true,
      [utils.asGridCoord(76,35)] : true,
      [utils.asGridCoord(75,35)] : true,
      [utils.asGridCoord(74,35)] : true,
      [utils.asGridCoord(73,35)] : true,
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
      [utils.asGridCoord(62,39)] : true,
      [utils.asGridCoord(62,40)] : true,
      [utils.asGridCoord(61,40)] : true,
      [utils.asGridCoord(60,40)] : true,
      [utils.asGridCoord(59,40)] : true,
      [utils.asGridCoord(58,40)] : true,
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
      [utils.asGridCoord(49,41)] : true,
      [utils.asGridCoord(49,42)] : true,
      [utils.asGridCoord(48,41)] : true,
      [utils.asGridCoord(47,41)] : true,
      [utils.asGridCoord(46,41)] : true,
      [utils.asGridCoord(45,42)] : true,
      [utils.asGridCoord(46,42)] : true,
      [utils.asGridCoord(45,45)] : true,
      [utils.asGridCoord(44,45)] : true,
      [utils.asGridCoord(43,45)] : true,
      [utils.asGridCoord(43,46)] : true,
      [utils.asGridCoord(43,47)] : true,
      [utils.asGridCoord(42,47)] : true,
      [utils.asGridCoord(41,47)] : true,
      [utils.asGridCoord(41,46)] : true,
      [utils.asGridCoord(41,45)] : true,
      [utils.asGridCoord(40,45)] : true,
      [utils.asGridCoord(40,46)] : true,
      [utils.asGridCoord(40,47)] : true,
      [utils.asGridCoord(39,47)] : true,
      [utils.asGridCoord(38,47)] : true,
      [utils.asGridCoord(37,47)] : true,
      [utils.asGridCoord(37,46)] : true,
      [utils.asGridCoord(37,45)] : true,
      [utils.asGridCoord(36,45)] : true,
      [utils.asGridCoord(36,46)] : true,
      [utils.asGridCoord(36,47)] : true,
      [utils.asGridCoord(35,47)] : true,
      [utils.asGridCoord(34,47)] : true,
      [utils.asGridCoord(33,47)] : true,
      [utils.asGridCoord(33,46)] : true,
      [utils.asGridCoord(33,45)] : true,
      [utils.asGridCoord(33,44)] : true,
      [utils.asGridCoord(32,44)] : true,
      [utils.asGridCoord(31,44)] : true,
      [utils.asGridCoord(31,43)] : true,
      [utils.asGridCoord(30,43)] : true,
      [utils.asGridCoord(29,43)] : true,
      [utils.asGridCoord(28,43)] : true,
      [utils.asGridCoord(27,43)] : true,
      [utils.asGridCoord(26,43)] : true,
      [utils.asGridCoord(25,43)] : true,
      [utils.asGridCoord(25,42)] : true,
      [utils.asGridCoord(23,42)] : true,
      [utils.asGridCoord(24,42)] : true,
      [utils.asGridCoord(23,43)] : true,
      [utils.asGridCoord(22,43)] : true,
      [utils.asGridCoord(21,43)] : true,
      [utils.asGridCoord(21,42)] : true,
      [utils.asGridCoord(21,41)] : true,
      [utils.asGridCoord(21,40)] : true,
      [utils.asGridCoord(20,40)] : true,
      [utils.asGridCoord(20,39)] : true,
      [utils.asGridCoord(20,38)] : true,
      [utils.asGridCoord(20,37)] : true,
      [utils.asGridCoord(20,36)] : true,
      [utils.asGridCoord(21,36)] : true,
      [utils.asGridCoord(22,36)] : true,
      [utils.asGridCoord(23,36)] : true,
      [utils.asGridCoord(24,36)] : true,
      [utils.asGridCoord(25,36)] : true,
      [utils.asGridCoord(26,36)] : true,
      [utils.asGridCoord(26,35)] : true,
      [utils.asGridCoord(20,36)] : true,
      [utils.asGridCoord(27,35)] : true,
      [utils.asGridCoord(27,34)] : true,
      [utils.asGridCoord(27,33)] : true,
      [utils.asGridCoord(27,32)] : true,
      [utils.asGridCoord(27,31)] : true,
      [utils.asGridCoord(26,31)] : true,
      [utils.asGridCoord(25,31)] : true,
      [utils.asGridCoord(24,31)] : true,
      [utils.asGridCoord(24,30)] : true,
      [utils.asGridCoord(23,30)] : true,
      [utils.asGridCoord(23,29)] : true,
      [utils.asGridCoord(23,28)] : true,
      [utils.asGridCoord(23,27)] : true,
      [utils.asGridCoord(23,26)] : true,
      [utils.asGridCoord(22,27)] : true,
      [utils.asGridCoord(22,26)] : true,
      [utils.asGridCoord(23,25)] : true,
      [utils.asGridCoord(23,24)] : true,
      [utils.asGridCoord(23,23)] : true,
      [utils.asGridCoord(23,22)] : true,
      [utils.asGridCoord(23,21)] : true,
      [utils.asGridCoord(24,21)] : true,
      [utils.asGridCoord(24,20)] : true,
      [utils.asGridCoord(24,19)] : true,
      [utils.asGridCoord(24,18)] : true,
      [utils.asGridCoord(24,17)] : true,
      [utils.asGridCoord(24,16)] : true,
      [utils.asGridCoord(23,16)] : true,
      [utils.asGridCoord(22,16)] : true,
      [utils.asGridCoord(22,15)] : true,
      [utils.asGridCoord(22,14)] : true,
      [utils.asGridCoord(22,13)] : true,
      [utils.asGridCoord(21,13)] : true,
      [utils.asGridCoord(21,12)] : true,
      [utils.asGridCoord(22,12)] : true,
      [utils.asGridCoord(23,12)] : true,
      [utils.asGridCoord(24,12)] : true,
      [utils.asGridCoord(25,12)] : true,
      [utils.asGridCoord(26,12)] : true,
      [utils.asGridCoord(27,12)] : true,
      [utils.asGridCoord(28,12)] : true,
      [utils.asGridCoord(29,12)] : true,
      [utils.asGridCoord(30,12)] : true,
      [utils.asGridCoord(31,12)] : true,
      [utils.asGridCoord(32,12)] : true,
      [utils.asGridCoord(33,12)] : true,
      [utils.asGridCoord(34,12)] : true,
      [utils.asGridCoord(35,12)] : true,
      [utils.asGridCoord(36,12)] : true,
      [utils.asGridCoord(37,12)] : true,
      [utils.asGridCoord(38,12)] : true,
      [utils.asGridCoord(39,12)] : true,
      [utils.asGridCoord(40,12)] : true,
      [utils.asGridCoord(40,13)] : true,
      [utils.asGridCoord(41,13)] : true,
      [utils.asGridCoord(43,14)] : true,
      [utils.asGridCoord(43,13)] : true,
      [utils.asGridCoord(43,12)] : true,
      [utils.asGridCoord(44,12)] : true,
      [utils.asGridCoord(45,12)] : true,
      [utils.asGridCoord(46,12)] : true,
      [utils.asGridCoord(47,12)] : true,
      [utils.asGridCoord(48,12)] : true,
      [utils.asGridCoord(49,12)] : true,
      [utils.asGridCoord(50,12)] : true,
      [utils.asGridCoord(51,12)] : true,
      [utils.asGridCoord(52,12)] : true,
      [utils.asGridCoord(53,12)] : true,
      [utils.asGridCoord(53,13)] : true,
      [utils.asGridCoord(53,14)] : true,
      [utils.asGridCoord(52,14)] : true,
      [utils.asGridCoord(52,15)] : true,
      [utils.asGridCoord(52,16)] : true,
      [utils.asGridCoord(51,16)] : true,
      [utils.asGridCoord(50,16)] : true,
      [utils.asGridCoord(50,17)] : true,
      [utils.asGridCoord(49,17)] : true,
      [utils.asGridCoord(49,18)] : true,
      [utils.asGridCoord(48,18)] : true,
      [utils.asGridCoord(47,18)] : true,
      [utils.asGridCoord(46,18)] : true,
      [utils.asGridCoord(45,18)] : true,
      [utils.asGridCoord(45,17)] : true,
      [utils.asGridCoord(44,17)] : true,
      [utils.asGridCoord(43,17)] : true,
      [utils.asGridCoord(43,18)] : true,
      [utils.asGridCoord(42,18)] : true,
      [utils.asGridCoord(42,17)] : true,
      [utils.asGridCoord(41,17)] : true,
      [utils.asGridCoord(40,17)] : true,
      [utils.asGridCoord(40,18)] : true,
      [utils.asGridCoord(39,18)] : true,
      [utils.asGridCoord(38,18)] : true,
      [utils.asGridCoord(37,18)] : true,
      [utils.asGridCoord(37,19)] : true,
      [utils.asGridCoord(37,20)] : true,
      [utils.asGridCoord(37,21)] : true,
      [utils.asGridCoord(37,22)] : true,
      [utils.asGridCoord(38,22)] : true,
      [utils.asGridCoord(38,23)] : true,
      [utils.asGridCoord(38,24)] : true,
      [utils.asGridCoord(39,24)] : true,
      [utils.asGridCoord(39,25)] : true,
      [utils.asGridCoord(39,26)] : true,
      [utils.asGridCoord(40,26)] : true,
      [utils.asGridCoord(41,26)] : true,
      [utils.asGridCoord(42,26)] : true,
      [utils.asGridCoord(43,26)] : true,
      [utils.asGridCoord(43,27)] : true,
      [utils.asGridCoord(43,28)] : true,
      [utils.asGridCoord(43,29)] : true,
      [utils.asGridCoord(42,29)] : true,
      [utils.asGridCoord(42,30)] : true,
      [utils.asGridCoord(41,30)] : true,
      [utils.asGridCoord(40,30)] : true,
      [utils.asGridCoord(39,30)] : true,
      [utils.asGridCoord(38,30)] : true,
      [utils.asGridCoord(37,30)] : true,
      [utils.asGridCoord(36,30)] : true,
      [utils.asGridCoord(35,30)] : true,
      [utils.asGridCoord(35,29)] : true,
      [utils.asGridCoord(34,29)] : true,
      [utils.asGridCoord(34,28)] : true,
      [utils.asGridCoord(34,27)] : true,
      [utils.asGridCoord(34,26)] : true,
      [utils.asGridCoord(34,25)] : true,
      [utils.asGridCoord(33,25)] : true,
      [utils.asGridCoord(32,25)] : true,
      [utils.asGridCoord(32,24)] : true,
      [utils.asGridCoord(32,23)] : true,
      [utils.asGridCoord(33,23)] : true,
      [utils.asGridCoord(34,23)] : true,
      [utils.asGridCoord(35,22)] : true,
      [utils.asGridCoord(36,22)] : true,
      [utils.asGridCoord(36,23)] : true,
      [utils.asGridCoord(37,23)] : true,
      [utils.asGridCoord(37,24)] : true,
      [utils.asGridCoord(38,24)] : true,
      [utils.asGridCoord(40,25)] : true,
      [utils.asGridCoord(40,24)] : true,
      [utils.asGridCoord(41,24)] : true,
      [utils.asGridCoord(42,24)] : true,
      [utils.asGridCoord(43,24)] : true,
      [utils.asGridCoord(43,23)] : true,
      [utils.asGridCoord(44,23)] : true,
      [utils.asGridCoord(45,23)] : true,
      [utils.asGridCoord(45,22)] : true,
      [utils.asGridCoord(46,22)] : true,
      [utils.asGridCoord(47,22)] : true,
      [utils.asGridCoord(48,22)] : true,
      [utils.asGridCoord(48,21)] : true,
      [utils.asGridCoord(49,21)] : true,
      [utils.asGridCoord(50,21)] : true,
      [utils.asGridCoord(50,22)] : true,
      [utils.asGridCoord(51,22)] : true,
      [utils.asGridCoord(51,23)] : true,
      [utils.asGridCoord(50,23)] : true,
      [utils.asGridCoord(49,23)] : true,
      [utils.asGridCoord(48,23)] : true,
      [utils.asGridCoord(48,25)] : true,
      [utils.asGridCoord(48,24)] : true,
      [utils.asGridCoord(49,25)] : true,
      [utils.asGridCoord(49,26)] : true,
      [utils.asGridCoord(48,26)] : true,
      [utils.asGridCoord(48,27)] : true,
      [utils.asGridCoord(48,28)] : true,
      [utils.asGridCoord(48,29)] : true,
      [utils.asGridCoord(48,30)] : true,
      [utils.asGridCoord(48,31)] : true,
      [utils.asGridCoord(48,32)] : true,
      [utils.asGridCoord(49,32)] : true,
      [utils.asGridCoord(50,32)] : true,
      [utils.asGridCoord(51,32)] : true,
      [utils.asGridCoord(52,32)] : true,
      [utils.asGridCoord(52,33)] : true,
      [utils.asGridCoord(53,33)] : true,
      [utils.asGridCoord(54,33)] : true,
      [utils.asGridCoord(55,33)] : true,
      [utils.asGridCoord(55,32)] : true,
      [utils.asGridCoord(56,32)] : true,
      [utils.asGridCoord(57,32)] : true,
      [utils.asGridCoord(57,31)] : true,
      [utils.asGridCoord(58,31)] : true,
      [utils.asGridCoord(58,30)] : true,
      [utils.asGridCoord(58,29)] : true,
      [utils.asGridCoord(58,28)] : true,
      [utils.asGridCoord(57,28)] : true,
      [utils.asGridCoord(57,27)] : true,
      [utils.asGridCoord(58,27)] : true,
      [utils.asGridCoord(58,26)] : true,
      [utils.asGridCoord(59,26)] : true,
      [utils.asGridCoord(59,25)] : true,
      [utils.asGridCoord(59,24)] : true,
      [utils.asGridCoord(59,23)] : true,
      [utils.asGridCoord(59,22)] : true,
      [utils.asGridCoord(58,22)] : true,
      [utils.asGridCoord(58,21)] : true,
      [utils.asGridCoord(57,21)] : true,
      [utils.asGridCoord(56,21)] : true,
      [utils.asGridCoord(56,21)] : true,
      [utils.asGridCoord(56,20)] : true,
      [utils.asGridCoord(56,19)] : true,
      [utils.asGridCoord(56,18)] : true,
      [utils.asGridCoord(56,17)] : true,
      [utils.asGridCoord(57,17)] : true,
      [utils.asGridCoord(57,18)] : true,
      [utils.asGridCoord(58,18)] : true,
      [utils.asGridCoord(59,18)] : true,
      [utils.asGridCoord(59,17)] : true,
      [utils.asGridCoord(60,17)] : true,
      [utils.asGridCoord(60,18)] : true,
      [utils.asGridCoord(61,18)] : true,
      [utils.asGridCoord(62,18)] : true,
      [utils.asGridCoord(63,18)] : true,
      [utils.asGridCoord(63,19)] : true,
      [utils.asGridCoord(64,19)] : true,
      [utils.asGridCoord(64,20)] : true,
      [utils.asGridCoord(31,12)] : true,
      [utils.asGridCoord(31,13)] : true,
      [utils.asGridCoord(31,14)] : true,
      [utils.asGridCoord(31,15)] : true,
      [utils.asGridCoord(31,16)] : true,
      [utils.asGridCoord(65,20)] : true,
      [utils.asGridCoord(65,21)] : true,
      [utils.asGridCoord(65,22)] : true,
      [utils.asGridCoord(65,23)] : true,
      [utils.asGridCoord(66,23)] : true,
      [utils.asGridCoord(65,24)] : true,
      [utils.asGridCoord(64,24)] : true,
      [utils.asGridCoord(63,24)] : true,
      [utils.asGridCoord(62,24)] : true,
      [utils.asGridCoord(63,23)] : true,
      [utils.asGridCoord(62,23)] : true,
      [utils.asGridCoord(60,23)] : true,
      [utils.asGridCoord(61,23)] : true,
      [utils.asGridCoord(60,24)] : true,
      [utils.asGridCoord(60,25)] : true,
      [utils.asGridCoord(61,24)] : true,
      [utils.asGridCoord(61,25)] : true,
      [utils.asGridCoord(42,42)] : true,
      [utils.asGridCoord(43,42)] : true,
      [utils.asGridCoord(44,42)] : true,
      [utils.asGridCoord(42,43)] : true,
      [utils.asGridCoord(43,43)] : true,
      [utils.asGridCoord(44,43)] : true,
      [utils.asGridCoord(39,12)] : true,
      [utils.asGridCoord(39,13)] : true,
      [utils.asGridCoord(39,14)] : true,
      [utils.asGridCoord(39,15)] : true,
      [utils.asGridCoord(39,16)] : true,
      [utils.asGridCoord(36,16)] : true,
      [utils.asGridCoord(37,16)] : true,
      [utils.asGridCoord(38,16)] : true,
      [utils.asGridCoord(36,14)] : true,
      [utils.asGridCoord(36,15)] : true,
      [utils.asGridCoord(33,14)] : true,
      [utils.asGridCoord(34,14)] : true,
      [utils.asGridCoord(35,14)] : true,
      [utils.asGridCoord(31,16)] : true,
      [utils.asGridCoord(32,16)] : true,
      [utils.asGridCoord(37,30)] : true,
      [utils.asGridCoord(37,31)] : true,
      [utils.asGridCoord(37,32)] : true,
      [utils.asGridCoord(38,32)] : true,
      [utils.asGridCoord(39,32)] : true,
      [utils.asGridCoord(39,33)] : true,
      [utils.asGridCoord(39,34)] : true,
      [utils.asGridCoord(40,34)] : true,
      [utils.asGridCoord(41,34)] : true,
      [utils.asGridCoord(41,35)] : true,
      [utils.asGridCoord(41,36)] : true,
      [utils.asGridCoord(42,36)] : true,
      [utils.asGridCoord(43,36)] : true,
      [utils.asGridCoord(44,36)] : true,
      [utils.asGridCoord(44,35)] : true,
      [utils.asGridCoord(44,34)] : true,
      [utils.asGridCoord(45,34)] : true,
      [utils.asGridCoord(45,33)] : true,
      [utils.asGridCoord(45,32)] : true,
      [utils.asGridCoord(45,31)] : true,
      [utils.asGridCoord(44,31)] : true,
      [utils.asGridCoord(43,31)] : true,
      [utils.asGridCoord(42,31)] : true,
      [utils.asGridCoord(41,31)] : true,
      [utils.asGridCoord(41,30)] : true,

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
      [utils.asGridCoord(28,6)]: [
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
              x: utils.withGrid(28),
              y: utils.withGrid(8), 
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