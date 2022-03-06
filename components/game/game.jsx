// /* eslint-disable @next/next/no-img-element */
// import React, { useEffect, useState, useRef } from "react";
// import Link from "next/link";

// import { useDispatch, useSelector } from "react-redux";
// import { connect, connectDefi,connectW } from "../../redux/blockchain/blockchainActions";
// import { fetchData } from "../../redux/data/dataActions";
// const game = ({ lr, nr, theme }) => {

//     class Battle {
//         constructor({ enemy, onComplete }) {
      
//           this.enemy = enemy;
//           this.onComplete = onComplete;
      
//           this.combatants = {
//             // "player1": new Combatant({
//             //   ...Pizzas.s001,
//             //   team: "player",
//             //   hp: 30,
//             //   maxHp: 50,
//             //   xp: 95,
//             //   maxXp: 100,
//             //   level: 1,
//             //   status: { type: "saucy" },
//             //   isPlayerControlled: true
//             // }, this),
//             // "player2": new Combatant({
//             //   ...Pizzas.s002,
//             //   team: "player",
//             //   hp: 30,
//             //   maxHp: 50,
//             //   xp: 75,
//             //   maxXp: 100,
//             //   level: 1,
//             //   status: null,
//             //   isPlayerControlled: true
//             // }, this),
//             // "enemy1": new Combatant({
//             //   ...Pizzas.v001,
//             //   team: "enemy",
//             //   hp: 1,
//             //   maxHp: 50,
//             //   xp: 20,
//             //   maxXp: 100,
//             //   level: 1,
//             // }, this),
//             // "enemy2": new Combatant({
//             //   ...Pizzas.f001,
//             //   team: "enemy",
//             //   hp: 25,
//             //   maxHp: 50,
//             //   xp: 30,
//             //   maxXp: 100,
//             //   level: 1,
//             // }, this)
//           }
      
//           this.activeCombatants = {
//             player: null, //"player1",
//             enemy: null, //"enemy1",
//           }
      
//           //Dynamically add the Player team
//           window.playerState.lineup.forEach(id => {
//             this.addCombatant(id, "player", window.playerState.pizzas[id])
//           });
//           //Now the enemy team
//           Object.keys(this.enemy.pizzas).forEach(key => {
//             this.addCombatant("e_"+key, "enemy", this.enemy.pizzas[key])
//           })
      
      
//           //Start empty
//           this.items = []
      
//           //Add in player items
//           window.playerState.items.forEach(item => {
//             this.items.push({
//               ...item,
//               team: "player"
//             })
//           })
      
//           this.usedInstanceIds = {};
      
//         }
      
//         addCombatant(id, team, config) {
//             this.combatants[id] = new Combatant({
//               ...Pizzas[config.pizzaId],
//               ...config,
//               team,
//               isPlayerControlled: team === "player"
//             }, this)
      
//             //Populate first active pizza
      
//             console.log(this)
//             this.activeCombatants[team] = this.activeCombatants[team] || id
//         }
      
//         createElement() {
//           this.element = document.createElement("div");
//           this.element.classList.add("Battle");
//           this.element.innerHTML = (`
//           <div class="Battle_hero">
//             <img src="${'/images/characters/people/hero.png'}" alt="Hero" />
//           </div>
//           <div class="Battle_enemy">
//             <img src=${this.enemy.src} alt=${this.enemy.name} />
//           </div>
//           `)
//         }
      
//         init(container) {
//           this.createElement();
//           container.appendChild(this.element);
      
//           this.playerTeam = new Team("player", "Hero");
//           this.enemyTeam = new Team("enemy", "Bully");
      
//           Object.keys(this.combatants).forEach(key => {
//             let combatant = this.combatants[key];
//             combatant.id = key;
//             combatant.init(this.element)
            
//             //Add to correct team
//             if (combatant.team === "player") {
//               this.playerTeam.combatants.push(combatant);
//             } else if (combatant.team === "enemy") {
//               this.enemyTeam.combatants.push(combatant);
//             }
//           })
      
//           this.playerTeam.init(this.element);
//           this.enemyTeam.init(this.element);
      
//           this.turnCycle = new TurnCycle({
//             battle: this,
//             onNewEvent: event => {
//               return new Promise(resolve => {
//                 const battleEvent = new BattleEvent(event, this)
//                 battleEvent.init(resolve);
//               })
//             },
//             onWinner: winner => {
      
//               if (winner === "player") {
//                 const playerState = window.playerState;
//                 Object.keys(playerState.pizzas).forEach(id => {
//                   const playerStatePizza = playerState.pizzas[id];
//                   const combatant = this.combatants[id];
//                   if (combatant) {
//                     playerStatePizza.hp = combatant.hp;
//                     playerStatePizza.xp = combatant.xp;
//                     playerStatePizza.maxXp = combatant.maxXp;
//                     playerStatePizza.level = combatant.level;
//                   }
//                 })
      
//                 //Get rid of player used items
//                 playerState.items = playerState.items.filter(item => {
//                   return !this.usedInstanceIds[item.instanceId]
//                 })
      
//                 //Send signal to update
//                 utils.emitEvent("PlayerStateUpdated");
//               }
      
//               this.element.remove();
//               this.onComplete(winner === "player");
//             }
//           })
//           this.turnCycle.init();
      
      
//         }
      
//       }
//       /// BattleAnimation
//       window.BattleAnimations = {
//         async spin(event, onComplete) {
//           const element = event.caster.pizzaElement;
//           const animationClassName = event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";
//           element.classList.add(animationClassName);
      
//           //Remove class when animation is fully complete
//           element.addEventListener("animationend", () => {
//             element.classList.remove(animationClassName);
//           }, { once:true });
      
//           //Continue battle cycle right around when the pizzas collide
//           await utils.wait(100);
//           onComplete();
//         },
      
//         async glob(event, onComplete) {
//           const {caster} = event;
//           let div = document.createElement("div");
//           div.classList.add("glob-orb");
//           div.classList.add(caster.team === "player" ? "battle-glob-right" : "battle-glob-left");
      
//           div.innerHTML = (`
//             <svg viewBox="0 0 32 32" width="32" height="32">
//               <circle cx="16" cy="16" r="16" fill="${event.color}" />
//             </svg>
//           `);
      
//           //Remove class when animation is fully complete
//           div.addEventListener("animationend", () => {
//             div.remove();
//           });
      
//           //Add to scene
//           document.querySelector(".Battle").appendChild(div);
      
//           await utils.wait(820);
//           onComplete();
//         }
//       }

//       /// BattleEvent
//       /// BattleEvent
//       /// BattleEvent
//       /// BattleEvent
//       /// BattleEvent
//       /// BattleEvent
   
//       class BattleEvent {
//         constructor(event, battle) {
//           this.event = event;
//           this.battle = battle;
//         }
        
//         textMessage(resolve) {
      
//           const text = this.event.text
//           .replace("{CASTER}", this.event.caster?.name)
//           .replace("{TARGET}", this.event.target?.name)
//           .replace("{ACTION}", this.event.action?.name)
      
//           const message = new TextMessage({
//             text,
//             onComplete: () => {
//               resolve();
//             }
//           })
//           message.init( this.battle.element )
//         }
      
//         async stateChange(resolve) {
//           const {caster, target, damage, recover, status, action} = this.event;
//           let who = this.event.onCaster ? caster : target;
      
//           if (damage) {
//             //modify the target to have less HP
//             target.update({
//               hp: target.hp - damage
//             })
            
//             //start blinking
//             target.pizzaElement.classList.add("battle-damage-blink");
//           }
      
//           if (recover) {
//             let newHp = who.hp + recover;
//             if (newHp > who.maxHp) {
//               newHp = who.maxHp;
//             }
//             who.update({
//               hp: newHp
//             })
//           }
      
//           if (status) {
//             who.update({
//               status: {...status}
//             })
//           }
//           if (status === null) {
//             who.update({
//               status: null
//             })
//           }
      
      
//           //Wait a little bit
//           await utils.wait(600)
      
//           //Update Team components
//           this.battle.playerTeam.update();
//           this.battle.enemyTeam.update();
      
//           //stop blinking
//           target.pizzaElement.classList.remove("battle-damage-blink");
//           resolve();
//         }
      
//         submissionMenu(resolve) {
//           const {caster} = this.event;
//           const menu = new SubmissionMenu({
//             caster: caster,
//             enemy: this.event.enemy,
//             items: this.battle.items,
//             replacements: Object.values(this.battle.combatants).filter(c => {
//               return c.id !== caster.id && c.team === caster.team && c.hp > 0
//             }),
//             onComplete: submission => {
//               //submission { what move to use, who to use it on }
//               resolve(submission)
//             }
//           })
//           menu.init( this.battle.element )
//         }
      
//         replacementMenu(resolve) {
//           const menu = new ReplacementMenu({
//             replacements: Object.values(this.battle.combatants).filter(c => {
//               return c.team === this.event.team && c.hp > 0
//             }),
//             onComplete: replacement => {
//               resolve(replacement)
//             }
//           })
//           menu.init( this.battle.element )
//         }
      
//         async replace(resolve) {
//           const {replacement} = this.event;
      
//           //Clear out the old combatant
//           const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
//           this.battle.activeCombatants[replacement.team] = null;
//           prevCombatant.update();
//           await utils.wait(400);
      
//           //In with the new!
//           this.battle.activeCombatants[replacement.team] = replacement.id;
//           replacement.update();
//           await utils.wait(400);
      
//           //Update Team components
//           this.battle.playerTeam.update();
//           this.battle.enemyTeam.update();
      
//           resolve();
//         }
      
//         giveXp(resolve) {
//           let amount = this.event.xp;
//           const {combatant} = this.event;
//           const step = () => {
//             if (amount > 0) {
//               amount -= 1;
//               combatant.xp += 1;
      
//               //Check if we've hit level up point
//               if (combatant.xp === combatant.maxXp) {
//                 combatant.xp = 0;
//                 combatant.maxXp = 100;
//                 combatant.level += 1;
//               }
      
//               combatant.update();
//               requestAnimationFrame(step);
//               return;
//             }
//             resolve();
//           }
//           requestAnimationFrame(step);
//         }
      
//         animation(resolve) {
//           const fn = BattleAnimations[this.event.animation];
//           fn(this.event, resolve);
//         }
      
//         init(resolve) {
//           this[this.event.type](resolve);
//         }
//       }

//       // Combatants
//       // Combatants
//       // Combatants
//       // Combatants
//       // Combatants
//       // Combatants

//       class Combatant {
//         constructor(config, battle) {
//           Object.keys(config).forEach(key => {
//             this[key] = config[key];
//           })
//           this.hp = typeof(this.hp) === "undefined" ? this.maxHp : this.hp;
//           this.battle = battle;
//         }
      
//         get hpPercent() {
//           const percent = this.hp / this.maxHp * 100;
//           return percent > 0 ? percent : 0;
//         }
      
//         get xpPercent() {
//           return this.xp / this.maxXp * 100;
//         }
      
//         get isActive() {
//           return this.battle?.activeCombatants[this.team] === this.id;
//         }
      
//         get givesXp() {
//           return this.level * 20;
//         }
      
//         createElement() {
//           this.hudElement = document.createElement("div");
//           this.hudElement.classList.add("Combatant");
//           this.hudElement.setAttribute("data-combatant", this.id);
//           this.hudElement.setAttribute("data-team", this.team);
//           this.hudElement.innerHTML = (`
//             <p class="Combatant_name">${this.name}</p>
//             <p class="Combatant_level"></p>
//             <div class="Combatant_character_crop">
//               <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
//             </div>
//             <img class="Combatant_type"  src="${this.icon}" alt="${this.type}" />
//             <svg viewBox="0 0 26 3" class="Combatant_life-container">
//               <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
//               <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
//             </svg>
//             <svg viewBox="0 0 26 2" class="Combatant_xp-container">
//               <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
//               <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
//             </svg>
//             <p class="Combatant_status"></p>
//           `);
      
//           this.pizzaElement = document.createElement("img");
//           this.pizzaElement.classList.add("Pizza");
//           this.pizzaElement.setAttribute("src", this.src );
//           this.pizzaElement.setAttribute("alt", this.name );
//           this.pizzaElement.setAttribute("data-team", this.team );
      
//           this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
//           this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");
//         }
      
//         update(changes={}) {
//           //Update anything incoming
//           Object.keys(changes).forEach(key => {
//             this[key] = changes[key]
//           });
      
//           //Update active flag to show the correct pizza & hud
//           this.hudElement.setAttribute("data-active", this.isActive);
//           this.pizzaElement.setAttribute("data-active", this.isActive);
      
//           //Update HP & XP percent fills
//           this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`)
//           this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`)
      
//           //Update level on screen
//           this.hudElement.querySelector(".Combatant_level").innerText = this.level;
      
//           //Update status
//           const statusElement = this.hudElement.querySelector(".Combatant_status");
//           if (this.status) {
//             statusElement.innerText = this.status.type;
//             statusElement.style.display = "block";
//           } else {
//             statusElement.innerText = "";
//             statusElement.style.display = "none";
//           }
//         }
      
//         getReplacedEvents(originalEvents) {
      
//           if (this.status?.type === "clumsy" && utils.randomFromArray([true, false, false])) {
//             return [
//               { type: "textMessage", text: `${this.name} flops over!` },
//             ]
//           }
      
//           return originalEvents;
//         }
      
//         getPostEvents() {
//           if (this.status?.type === "saucy") {
//             return [
//               { type: "textMessage", text: "Feelin' saucy!" },
//               { type: "stateChange", recover: 5, onCaster: true }
//             ]
//           } 
//           return [];
//         }
      
//         decrementStatus() {
//           if (this.status?.expiresIn > 0) {
//             this.status.expiresIn -= 1;
//             if (this.status.expiresIn === 0) {
//               this.update({
//                 status: null
//               })
//               return {
//                 type: "textMessage",
//                 text: "Status expired!"
//               }
//             }
//           }
//           return null;
//         }
      
//         init(container) {
//           this.createElement();
//           container.appendChild(this.hudElement);
//           container.appendChild(this.pizzaElement);
//           this.update();
//         }
      
//       }


//       // ReplacementMenu
//       // ReplacementMenu
//       // ReplacementMenu
//       // ReplacementMenu
//       // ReplacementMenu
//       class ReplacementMenu {
//         constructor({ replacements, onComplete }) {
//           this.replacements = replacements;
//           this.onComplete = onComplete;
//         }
      
//         decide() {
//           this.menuSubmit(this.replacements[0])
//         }
      
//         menuSubmit(replacement) {
//           this.keyboardMenu?.end();
//           this.onComplete(replacement)
//         }
      
//         showMenu(container) {
//           this.keyboardMenu = new KeyboardMenu();
//           this.keyboardMenu.init(container);
//           this.keyboardMenu.setOptions(this.replacements.map(c => {
//             return {
//               label: c.name,
//               description: c.description,
//               handler: () => {
//                 this.menuSubmit(c);
//               }
//             }
//           }))
//         }
      
//         init(container) {
      
//           if (this.replacements[0].isPlayerControlled) {
//             this.showMenu(container);
//           } else {
//             this.decide();
//           }
//         }
//       }

//       // SUBMISSIONMENU
//       // SUBMISSIONMENU
//       // SUBMISSIONMENU
//       // SUBMISSIONMENU
//       // SUBMISSIONMENU
//       // SUBMISSIONMENU
//       // SUBMISSIONMENU

//       class SubmissionMenu { 
//         constructor({ caster, enemy, onComplete, items, replacements }) {
//           this.caster = caster;
//           this.enemy = enemy;
//           this.replacements = replacements;
//           this.onComplete = onComplete;
      
//           let quantityMap = {};
//           items.forEach(item => {
//             if (item.team === caster.team) {
//               let existing = quantityMap[item.actionId];
//               if (existing) {
//                 existing.quantity += 1;
//               } else {
//                 quantityMap[item.actionId] = {
//                   actionId: item.actionId,
//                   quantity: 1,
//                   instanceId: item.instanceId,
//                 }
//              }
//             }
//           })
//           this.items = Object.values(quantityMap);
//         }
      
//         getPages() {
      
//           const backOption = {
//             label: "Go Back",
//             description: "Return to previous page",
//             handler: () => {
//               this.keyboardMenu.setOptions(this.getPages().root)
//             }
//           };
      
//           return {
//             root: [
//               {
//                 label: "Attack",
//                 description: "Choose an attack",
//                 handler: () => {
//                   //Do something when chosen...
//                   this.keyboardMenu.setOptions( this.getPages().attacks )
//                 }
//               },
//               {
//                 label: "Items",
//                 description: "Choose an item",
//                 handler: () => {
//                   //Go to items page...
//                   this.keyboardMenu.setOptions( this.getPages().items )
//                 }
//               },
//               // {
//               //   label: "Swap",
//               //   description: "Change to another Bushi",
//               //   handler: () => { 
//               //     //See Bushi options
//               //     this.keyboardMenu.setOptions( this.getPages().replacements )
//               //   }
//               // },
//             ],
//             attacks: [
//               ...this.caster.actions.map(key => {
//                 const action = Actions[key];
//                 return {
//                   label: action.name,
//                   description: action.description,
//                   handler: () => {
//                     this.menuSubmit(action)
//                   }
//                 }
//               }),
//               backOption
//             ],
//             items: [
//               ...this.items.map(item => {
//                 const action = Actions[item.actionId];
//                 return {
//                   label: action.name,
//                   description: action.description,
//                   right: () => {
//                     return "x"+item.quantity;
//                   },
//                   handler: () => {
//                     this.menuSubmit(action, item.instanceId)
//                   }
//                 }
//               }),
//               backOption
//             ],
//             replacements: [
//               ...this.replacements.map(replacement => {
//                 return {
//                   label: replacement.name,
//                   description: replacement.description,
//                   handler: () => {
//                     //Swap me in, coach!
//                     this.menuSubmitReplacement(replacement)
//                   }
//                 }
//               }),
//               backOption
//             ]
//           }
//         }
      
//         menuSubmitReplacement(replacement) {
//           this.keyboardMenu?.end();
//           this.onComplete({
//             replacement
//           })
//         }
      
//         menuSubmit(action, instanceId=null) {
      
//           this.keyboardMenu?.end();
      
//           this.onComplete({
//             action,
//             target: action.targetType === "friendly" ? this.caster : this.enemy,
//             instanceId
//           })
//         }
      
//         decide() {
//           //TODO: Enemies should randomly decide what to do...
//           this.menuSubmit(Actions[ this.caster.actions[0] ]);
//         }
      
//         showMenu(container) {
//           this.keyboardMenu = new KeyboardMenu();
//           this.keyboardMenu.init(container);
//           this.keyboardMenu.setOptions( this.getPages().root )
//         }
      
//         init(container) {
      
//           if (this.caster.isPlayerControlled) {
//             //Show some UI
//             this.showMenu(container)
//           } else {
//             this.decide()
//           }
//         }
//       }

//       //TEAM
//       //TEAM
//       //TEAM
//       //TEAM
//       //TEAM
//       //TEAM

//       class Team {
//         constructor(team, name) {
//           this.team = team;
//           this.name = name;
//           this.combatants = [];
//         }
      
//         createElement() {
//           this.element = document.createElement("div");
//           this.element.classList.add("Team");
//           this.element.setAttribute("data-team", this.team);
//           this.combatants.forEach(c => {
//             let icon = document.createElement("div");
//             icon.setAttribute("data-combatant", c.id);
//             icon.innerHTML = (`
//               <svg xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 -0.5 7 10" shape-rendering="crispEdges">
//                 <path stroke="#3a160d" d="M2 0h3M1 1h1M5 1h1M0 2h1M6 2h1M0 3h1M6 3h1M0 4h1M6 4h1M1 5h1M5 5h1M2 6h3" />
//                 <path stroke="#e2b051" d="M2 1h1M4 1h1M1 2h1M5 2h1M1 4h1M5 4h1M2 5h1M4 5h1" />
//                 <path stroke="#ffd986" d="M3 1h1M2 2h3M1 3h5M2 4h3M3 5h1" />
                
//                 <!-- Active indicator appears when needed with CSS -->
//                 <path class="active-pizza-indicator" stroke="#3a160d" d="M3 8h1M2 9h3" />
                
//                 <!-- Dead paths appear when needed with CSS -->
//                 <path class="dead-pizza" stroke="#3a160d" d="M2 0h3M1 1h1M5 1h1M0 2h1M2 2h1M4 2h1M6 2h1M0 3h1M3 3h1M6 3h1M0 4h1M2 4h1M4 4h1M6 4h1M1 5h1M5 5h1M2 6h3" />
//                 <path class="dead-pizza" stroke="#9b917f" d="M2 1h3M1 2h1M5 2h1" />
//                 <path class="dead-pizza" stroke="#c4bdae" d="M3 2h1M1 3h2M4 3h2M1 4h1M3 4h1M5 4h1M2 5h3" />
//               </svg> 
//             `)
//             //Add to parent element
//             this.element.appendChild(icon)
//           })
//         }
      
//         update() {
//           this.combatants.forEach(c => {
//             const icon = this.element.querySelector(`[data-combatant="${c.id}"]`)
//             icon.setAttribute("data-dead", c.hp <= 0 );
//             icon.setAttribute("data-active", c.isActive );
//           })
//         }
      
//         init(container) {
//           this.createElement();
//           this.update();
//           container.appendChild(this.element);
//         }
//       }

//       // TURN
//       // TURN
//       // TURN
//       // TURN
//       // TURN
//       // TURN
//       // TURN
//       class TurnCycle {
//         constructor({ battle, onNewEvent, onWinner }) {
//           this.battle = battle;
//           this.onNewEvent = onNewEvent;
//           this.onWinner = onWinner;
//           this.currentTeam = "player"; //or "enemy"
//         }
      
//         async turn() {
//           // Get the caster
//           const casterId = this.battle.activeCombatants[this.currentTeam];
//           const caster = this.battle.combatants[casterId];
//           const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"]
//           const enemy = this.battle.combatants[enemyId];
      
//           const submission = await this.onNewEvent({
//             type: "submissionMenu",
//             caster,
//             enemy
//           })
      
//           //Stop here if we are replacing this Pizza
//           if (submission.replacement) {
//             await this.onNewEvent({
//               type: "replace",
//               replacement: submission.replacement
//             })
//             await this.onNewEvent({
//               type: "textMessage",
//               text: `Go get 'em, ${submission.replacement.name}!`
//             })
//             this.nextTurn();
//             return;
//           }
      
//           if (submission.instanceId) {
      
//             //Add to list to persist to player state later
//             this.battle.usedInstanceIds[submission.instanceId] = true;
      
//             //Removing item from battle state
//             this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId)
//           }
      
//           const resultingEvents = caster.getReplacedEvents(submission.action.success);
      
//           for (let i=0; i<resultingEvents.length; i++) {
//             const event = {
//               ...resultingEvents[i],
//               submission,
//               action: submission.action,
//               caster,
//               target: submission.target,
//             }
//             await this.onNewEvent(event);
//           }
      
//           //Did the target die?
//           const targetDead = submission.target.hp <= 0;
//           if (targetDead) {
//             await this.onNewEvent({ 
//               type: "textMessage", text: `${submission.target.name} is ruined!`
//             })
      
//             if (submission.target.team === "enemy") {
      
//               const playerActivePizzaId = this.battle.activeCombatants.player;
//               const xp = submission.target.givesXp;
      
//               await this.onNewEvent({
//                 type: "textMessage",
//                 text: `Gained ${xp} XP!`
//               })
//               await this.onNewEvent({
//                 type: "giveXp",
//                 xp,
//                 combatant: this.battle.combatants[playerActivePizzaId]
//               })
//             }
//           }
      
//           //Do we have a winning team?
//           const winner = this.getWinningTeam();
//           if (winner) {
//             await this.onNewEvent({
//               type: "textMessage",
//               text: "Winner!"
//             })
//             this.onWinner(winner);
//             return;
//           }
            
//           //We have a dead target, but still no winner, so bring in a replacement
//           if (targetDead) {
//             const replacement = await this.onNewEvent({
//               type: "replacementMenu",
//               team: submission.target.team
//             })
//             await this.onNewEvent({
//               type: "replace",
//               replacement: replacement
//             })
//             await this.onNewEvent({
//               type: "textMessage",
//               text: `${replacement.name} appears!`
//             })
//           }
      
      
//           // Check for post events
//           // (Do things AFTER your original turn submission)
//           const postEvents = caster.getPostEvents();
//           for (let i=0; i < postEvents.length; i++ ) {
//             const event = {
//               ...postEvents[i],
//               submission,
//               action: submission.action,
//               caster,
//               target: submission.target, 
//             }
//             await this.onNewEvent(event);
//           }
      
//           //Check for status expire
//           const expiredEvent = caster.decrementStatus();
//           if (expiredEvent) {
//             await this.onNewEvent(expiredEvent)
//           }
      
//           this.nextTurn();
//         }
      
//         nextTurn() {
//           this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
//           this.turn();
//         }
      
//         getWinningTeam() {
//           let aliveTeams = {};
//           Object.values(this.battle.combatants).forEach(c => {
//             if (c.hp > 0) {
//               aliveTeams[c.team] = true;
//             }
//           })
//           if (!aliveTeams["player"]) { return "enemy"}
//           if (!aliveTeams["enemy"]) { return "player"}
//           return null;
//         }
      
//         async init() {
//           await this.onNewEvent({
//             type: "textMessage",
//             text: `${this.battle.enemy.name} wants to throw down!`
//           })
      
//           //Start the first turn!
//           this.turn();
      
//         }
      
//       }

//       // ACTION
//       // ACTION
//       // ACTION
//       // ACTION
//       // ACTION
//       // ACTION

//       window.Actions = {

//         damage1: {
//           name: "Rugpull!",
//           description: "NOT SAFU",
//           success: [
//             { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
//             { type: "animation", animation: "spin"},
//             { type: "stateChange", damage: 10}
//           ]
//         },
//         damage2: {
//           name: "Shuriken",
//           description: "Throw a shuriken on your opponent",
//           success: [
//             { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
//             { type: "animation", animation: "spin"},
//             { type: "stateChange", damage: 10}
//           ]
//         },
//         damage4: {
//           name: "Rugpull!",
//           description: "NOT SAFU",
//           success: [
//             { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
//             { type: "animation", animation: "spin"},
//             { type: "stateChange", damage: 20}
//           ]
//         },
//         damage3: {
//           name: "Shuriken",
//           description: "Throw a shuriken on your opponent",
//           success: [
//             { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
//             { type: "animation", animation: "spin"},
//             { type: "stateChange", damage: 20}
//           ]
//         },
//         saucyStatus: {
//           name: "Senzu",
//           description: "Take the power of the beans",
//           targetType: "friendly",
//           success: [
//             { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
//             { type: "stateChange", status: { type: "saucy", expiresIn: 3 } }
//           ]
//         },
//         clumsyStatus: {
//           name: "Spit",
//           description: "Spit on your opponent",
//           success: [
//             { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
//             { type: "animation", animation: "glob", color: "#dafd2a" },
//             { type: "stateChange", status: { type: "clumsy", expiresIn: 3 }, damage:15 },
//             { type: "textMessage", text: "{TARGET} is slipping all around!"},
//           ]
//         },
//         //Items
//         // item_recoverStatus: {
//         //   name: "Bandage",
//         //   description: "Feeling fresh and warm",
//         //   targetType: "friendly",
//         //   success: [
//         //     { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
//         //     { type: "stateChange", status: null },
//         //     { type: "textMessage", text: "Feeling fresh!", },
//         //   ]
//         // },
//         item_recoverHp: {
//           name: "Bandage",
//           targetType: "friendly",
//           success: [
//             { type:"textMessage", text: "{CASTER} sprinkles on some {ACTION}!", },
//             { type:"stateChange", recover: 10, },
//             { type:"textMessage", text: "{CASTER} recovers HP!", },
//           ]
//         },
//       }

//       // enemies
//       // enemies
//       // enemies
//       // enemies
//       // enemies
//       // enemies
//       // enemies

//       window.Enemies = {
//         "erio": {
//           name: "Erio",
//           src: "/images/characters/people/erio.png",
//           pizzas: {
//             "a": {
//               pizzaId: "s001",
//               maxHp: 50,
//               level: 1,
//             },
//             "b": {
//               pizzaId: "s002",
//               maxHp: 50,
//               level: 1,
//             },
//           }
//         },
//         "beth": {
//           name: "Beth",
//           src: "/images/characters/people/npc1.png",
//           pizzas: {
//             "a": {
//               hp: 1,
//               pizzaId: "f001",
//               maxHp: 50,
//               level: 1,
//             },
//             "b": {
//               hp: 1,
//               pizzaId: "f001",
//               maxHp: 50,
//               level: 1,
//             },
//           }
//         },
//         "Bushi": {
//           name: "Bushi",
//           src: "/images/characters/people/npc3.png",
//           pizzas: {
//             "a": {
//               hp: 70,
//               pizzaId: "4",
//               maxHp: 70,
//               level: 1,
//             },
//           }
//         }
//       }

//       /// PIZZA
//       /// PIZZA
//       /// PIZZA
//       /// PIZZA
//       /// PIZZA
//       /// PIZZA
//       /// PIZZA

//       window.PizzaTypes = {
//         normal: "normal",
//         spicy: "spicy",
//         veggie: "veggie",
//         fungi: "fungi",
//         chill: "chill",
//       }
      
//       window.Pizzas = {
//         "s001": {
//           name: "Black Bunny",
//           description: "Pizza desc here",
//           type: PizzaTypes.spicy,
//           src: "/nfts/300.png",
//           icon: "/images/icons/wind.png",
//           actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
//         },
//         "2": {
//           name: "2",
//           description: "Pizza desc here",
//           type: PizzaTypes.spicy,
//           src: "/nfts/2.png",
//           icon: "/images/icons/fire.png",
//           actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
//         },
//         "3": {
//           name: "3",
//           description: "Pizza desc here",
//           type: PizzaTypes.spicy,
//           src: "/nfts/3.png",
//           icon: "/images/icons/water.png",
//           actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
//         },
//         "4": {
//           name: "Ghost Warrior",
//           description: "4",
//           type: PizzaTypes.spicy,
//           src: "/nfts/Ghost_warrior.png",
//           icon: "/images/icons/moon.png",
//           actions: [ "damage3", "damage4", "clumsyStatus" ],
//         },
//         "5": {
//           name: "5",
//           description: "5",
//           type: PizzaTypes.spicy,
//           src: "/nfts/5.png",
//           icon: "/images/icons/moon.png",
//           actions: [ "damage1", "saucyStatus", "clumsyStatus" ],
//         },
//         "6": {
//           name: "6",
//           description: "6",
//           type: PizzaTypes.spicy,
//           src: "/nfts/6.png",
//           icon: "/images/icons/thunder.png",
//           actions: [ "damage1", "saucyStatus", "clumsyStatus" ],
//         },
//         "v001": {
//           name: "Call Me Kale",
//           description: "Pizza desc here",
//           type: PizzaTypes.veggie,
//           src: "/images/characters/pizzas/v001.png",
//           icon: "/images/icons/veggie.png",
//           actions: [ "damage1" ],
//         },
//         "f001": {
//           name: "Portobello Express",
//           description: "Pizza desc here",
//           type: PizzaTypes.fungi,
//           src: "/images/characters/pizzas/f001.png",
//           icon: "/images/icons/fungi.png",
//           actions: [ "damage1" ],
//         }
//       }

//       // PLAYER STATE
//       // PLAYER STATE
//       // PLAYER STATE
//       // PLAYER STATE
//       // PLAYER STATE
//       // PLAYER STATE

//       class PlayerState {
//         constructor() {
//           this.pizzas = {
//             "p1": {
//               pizzaId: "s001",
//               hp: 50,
//               maxHp: 50,
//               xp: 0,
//               maxXp: 100,
//               level: 1,
//               status: null,
//             },
//             // "p2": {
//             //   pizzaId: "v001",
//             //   hp: 50,
//             //   maxHp: 50,
//             //   xp: 75,
//             //   maxXp: 100,
//             //   level: 1,
//             //   status: null,
//             // },
//             // "p3": {
//             //   pizzaId: "f001",
//             //   hp: 50,
//             //   maxHp: 50,
//             //   xp: 75,
//             //   maxXp: 100,
//             //   level: 1,
//             //   status: null,
//             // }
//           }
//           this.lineup = ["p1"];
//           this.items = [
//             { actionId: "item_recoverHp", instanceId: "item1" },
//             { actionId: "item_recoverHp", instanceId: "item2" },
//             { actionId: "item_recoverHp", instanceId: "item3" },
//           ]
//           this.storyFlags = {
//           };
//         }
      
//         addPizza(pizzaId) {
//           const newId = `p${Date.now()}`+Math.floor(Math.random() * 99999);
//           this.pizzas[newId] = {
//             pizzaId,
//             hp: 50,
//             maxHp: 50,
//             xp: 0,
//             maxXp: 100,
//             level: 1,
//             status: null,
//           }
//           if (this.lineup.length < 3) {
//             this.lineup.push(newId)
//           }
//           utils.emitEvent("LineupChanged");
//           console.log(this)
//         }
      
//         swapLineup(oldId, incomingId) {
//           const oldIndex = this.lineup.indexOf(oldId);
//           this.lineup[oldIndex] = incomingId;
//           utils.emitEvent("LineupChanged");
//         }
      
//         moveToFront(futureFrontId) {
//           this.lineup = this.lineup.filter(id => id !== futureFrontId);
//           this.lineup.unshift(futureFrontId);
//           utils.emitEvent("LineupChanged");
//         }
      
//       }
//       window.playerState = new PlayerState();

//       /// Crafting menu
//       /// Crafting menu
//       /// Crafting menu
//       /// Crafting menu
//       class CraftingMenu {
//         constructor({ pizzas, onComplete}) {
//           this.pizzas = pizzas;
//           this.onComplete = onComplete;
//         }
      
//         getOptions() {
//           return this.pizzas.map(id => {
//             const base = Pizzas[id];
//             return {
//               label: base.name,
//               description: base.description,
//               handler: () => {
//                 playerState.addPizza(id);
//                 this.close();
//               }
//             }
//           })
//         }
      
//         createElement() {
//           this.element = document.createElement("div");
//           this.element.classList.add("CraftingMenu");
//           this.element.classList.add("overlayMenu");
//           this.element.innerHTML = (`
//             <h2>Create a Pizza</h2>
//           `)
//         }
      
//         close() {
//           this.keyboardMenu.end();
//           this.element.remove();
//           this.onComplete();
//         }
      
      
//         init(container) {
//           this.createElement();
//           this.keyboardMenu = new KeyboardMenu({
//             descriptionContainer: container
//           })
//           this.keyboardMenu.init(this.element)
//           this.keyboardMenu.setOptions(this.getOptions())
      
//           container.appendChild(this.element);
//         }
//       }


//       // DIRECTION
//       // DIRECTION
//       // DIRECTION
//       // DIRECTION
//       // DIRECTION
//       // DIRECTION
//       class DirectionInput {
//         constructor() {
//           this.heldDirections = [];
      
//           this.map = {
//             "ArrowUp": "up",
//             "KeyW": "up",
//             "ArrowDown": "down",
//             "KeyS": "down",
//             "ArrowLeft": "left",
//             "KeyA": "left",
//             "ArrowRight": "right",
//             "KeyD": "right",
//           }
//         }
      
//         get direction() {
//           return this.heldDirections[0];
//         }
      
//         init() {
//           document.addEventListener("keydown", e => {
//             const dir = this.map[e.code];
//             if (dir && this.heldDirections.indexOf(dir) === -1) {
//               this.heldDirections.unshift(dir);
//             }
//           });
//           document.addEventListener("keyup", e => {
//             const dir = this.map[e.code];
//             const index = this.heldDirections.indexOf(dir);
//             if (index > -1) {
//               this.heldDirections.splice(index, 1);
//             }
//           })
      
//         }
      
//       }

//       // GAME OBJ
//       // GAME OBJ
//       // GAME OBJ
//       // GAME OBJ
//       // GAME OBJ
//       // GAME OBJ

//       class GameObject {
//         constructor(config) {
//           this.id = null;
//           this.isMounted = false;
//           this.x = config.x || 0;
//           this.y = config.y || 0;
//           this.direction = config.direction || "down";
//           this.sprite = new Sprite({
//             gameObject: this,
//             src: config.src || "/images/characters/people/hero.png",
//           });
      
//           this.behaviorLoop = config.behaviorLoop || [];
//           this.behaviorLoopIndex = 0;
      
//           this.talking = config.talking || [];
      
//         }
      
//         mount(map) {
//           console.log("mounting!")
//           this.isMounted = true;
//           map.addWall(this.x, this.y);
      
//           //If we have a behavior, kick off after a short delay
//           setTimeout(() => {
//             this.doBehaviorEvent(map);
//           }, 10)
//         }
      
//         update() {
//         }
      
//         async doBehaviorEvent(map) { 
      
//           //Don't do anything if there is a more important cutscene or I don't have config to do anything
//           //anyway.
//           if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
//             return;
//           }
      
//           //Setting up our event with relevant info
//           let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
//           eventConfig.who = this.id;
      
//           //Create an event instance out of our next event config
//           const eventHandler = new OverworldEvent({ map, event: eventConfig });
//           await eventHandler.init(); 
      
//           //Setting the next event to fire
//           this.behaviorLoopIndex += 1;
//           if (this.behaviorLoopIndex === this.behaviorLoop.length) {
//             this.behaviorLoopIndex = 0;
//           } 
      
//           //Do it again!
//           this.doBehaviorEvent(map);
          
      
//         }
      
      
//       }

//       // HUB
//       // HUB
//       // HUB
//       // HUB
//       // HUB
//       // HUB
//       // HUB

//       class Hud {
//         constructor() {
//           this.scoreboards = [];
//         }
      
//         update() {
//           this.scoreboards.forEach(s => {
//             s.update(window.playerState.pizzas[s.id])
//           })
//         }
      
//         createElement() {
      
//           if (this.element) {
//             this.element.remove();
//             this.scoreboards = [];
//           }
      
//           this.element = document.createElement("div");
//           this.element.classList.add("Hud");
      
//           const {playerState} = window;
//           playerState.lineup.forEach(key => {
//             const pizza = playerState.pizzas[key];
//             const scoreboard = new Combatant({
//               id: key,
//               ...Pizzas[pizza.pizzaId],
//               ...pizza,
//             }, null)
//             scoreboard.createElement();
//             this.scoreboards.push(scoreboard);
//             this.element.appendChild(scoreboard.hudElement);
//           })
//           this.update();
//         }
      
//         init(container) {
//           this.createElement();
//           container.appendChild(this.element);
      
//           document.addEventListener("PlayerStateUpdated", () => {
//             this.update();
//           })
      
//           document.addEventListener("LineupChanged", () => {
//             this.createElement();
//             container.appendChild(this.element);
//           })
      
//         }
      
      
      
//       }

//       // KEYBORDMENU
//       // KEYBORDMENU
//       // KEYBORDMENU
//       // KEYBORDMENU
//       // KEYBORDMENU
//       // KEYBORDMENU
//       // KEYBORDMENU

//       class KeyboardMenu {
//         constructor(config={}) {
//           this.options = []; //set by updater method
//           this.up = null;
//           this.down = null;
//           this.prevFocus = null;
//           this.descriptionContainer = config.descriptionContainer || null;
//         }
      
//         setOptions(options) {
//           this.options = options;
//           this.element.innerHTML = this.options.map((option, index) => {
//             const disabledAttr = option.disabled ? "disabled" : "";
//             return (`
//               <div class="option">
//                 <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
//                   ${option.label}
//                 </button>
//                 <span class="right">${option.right ? option.right() : ""}</span>
//               </div>
//             `)
//           }).join("");
      
//           this.element.querySelectorAll("button").forEach(button => {
      
//             button.addEventListener("click", () => {
//               const chosenOption = this.options[ Number(button.dataset.button) ];
//               chosenOption.handler();
//             })
//             button.addEventListener("mouseenter", () => {
//               button.focus();
//             })
//             button.addEventListener("focus", () => {
//               this.prevFocus = button;
//               this.descriptionElementText.innerText = button.dataset.description;
//             })
//           })
      
//           setTimeout(() => {
//             this.element.querySelector("button[data-button]:not([disabled])").focus();
//           }, 10)
      
          
      
      
//         }
      
//         createElement() {
//           this.element = document.createElement("div");
//           this.element.classList.add("KeyboardMenu");
      
//           // Description box element
//           this.descriptionElement = document.createElement("div");
//           this.descriptionElement.classList.add("DescriptionBox");
//           this.descriptionElement.innerHTML = (`<p>I will provide information!</p>`);
//           this.descriptionElementText = this.descriptionElement.querySelector("p");
//         }
      
//         end() {
      
//           //Remove menu element and description element
//           this.element.remove();
//           this.descriptionElement.remove();
      
//           //Clean up bindings
//           this.up.unbind();
//           this.down.unbind();
//         }
      
//         init(container) {
//           this.createElement();
//           (this.descriptionContainer || container).appendChild(this.descriptionElement);
//           container.appendChild(this.element);
      
//           this.up = new KeyPressListener("ArrowUp", () => {
//             const current = Number(this.prevFocus.getAttribute("data-button"));
//             const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
//               return el.dataset.button < current && !el.disabled;
//             })
//             prevButton?.focus();
//           })
//           this.down = new KeyPressListener("ArrowDown", () => {
//             const current = Number(this.prevFocus.getAttribute("data-button"));
//             const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
//               return el.dataset.button > current && !el.disabled;
//             })
//             nextButton?.focus();
//           })
      
//         }
      
//       }

//       class KeyPressListener {
//         constructor(keyCode, callback) {
//           let keySafe = true;
//           this.keydownFunction = function(event) {
//             if (event.code === keyCode) {
//                if (keySafe) {
//                   keySafe = false;
//                   callback();
//                }  
//             }
//          };
//          this.keyupFunction = function(event) {
//             if (event.code === keyCode) {
//                keySafe = true;
//             }         
//          };
//          document.addEventListener("keydown", this.keydownFunction);
//          document.addEventListener("keyup", this.keyupFunction);
//         }
      
//         unbind() { 
//           document.removeEventListener("keydown", this.keydownFunction);
//           document.removeEventListener("keyup", this.keyupFunction);
//         }
      
      
//       }

//       //OVERLORD
//       //OVERLORD
//       //OVERLORD
//       //OVERLORD
//       //OVERLORD
//       //OVERLORD
//       //OVERLORD

//       class Overworld {
//         constructor(config) {
//           this.element = config.element;
//           this.canvas = this.element.querySelector(".game-canvas");
//           this.ctx = this.canvas.getContext("2d");
//           this.map = null;
//         }
       
//          startGameLoop() {
//            const step = () => {
//              //Clear off the canvas
//              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
       
//              //Establish the camera person
//              const cameraPerson = this.map.gameObjects.hero;
       
//              //Update all objects
//              Object.values(this.map.gameObjects).forEach(object => {
//                object.update({
//                  arrow: this.directionInput.direction,
//                  map: this.map,
//                })
//              })
             
       
//              //Draw Lower layer
//              this.map.drawLowerImage(this.ctx, cameraPerson);
       
//              //Draw Game Objects
//              Object.values(this.map.gameObjects).sort((a,b) => {
//                return a.y - b.y;
//              }).forEach(object => {
//                object.sprite.draw(this.ctx, cameraPerson);
//              })
       
//              //Draw Upper layer
//              this.map.drawUpperImage(this.ctx, cameraPerson);
             
//              if (!this.map.isPaused) {
//                requestAnimationFrame(() => {
//                  step();   
//                })
//              }
//            }
//            step();
//         }
       
//         bindActionInput() {
//           new KeyPressListener("Enter", () => {
//             //Is there a person here to talk to?
//             this.map.checkForActionCutscene()
//           })
//           new KeyPressListener("Escape", () => {
//             if (!this.map.isCutscenePlaying) {
//              this.map.startCutscene([
//                { type: "pause" }
//              ])
//             }
//           })
//         }
       
//         bindHeroPositionCheck() {
//           document.addEventListener("PersonWalkingComplete", e => {
//             if (e.detail.whoId === "hero") {
//               //Hero's position has changed
//               this.map.checkForFootstepCutscene()
//             }
//           })
//         }
       
//         startMap(mapConfig, heroInitialState=null) {
//          this.map = new OverworldMap(mapConfig);
//          this.map.overworld = this;
//          this.map.mountObjects();
       
//          if (heroInitialState) {
//            const {hero} = this.map.gameObjects;
//            this.map.removeWall(hero.x, hero.y);
//            hero.x = heroInitialState.x;
//            hero.y = heroInitialState.y;
//            hero.direction = heroInitialState.direction;
//            this.map.addWall(hero.x, hero.y);
//          }
       
//          this.progress.mapId = mapConfig.id;
//          this.progress.startingHeroX = this.map.gameObjects.hero.x;
//          this.progress.startingHeroY = this.map.gameObjects.hero.y;
//          this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
       
//          console.log(this.map.walls)
       
//         }
       
//         async init() {
       
//          const container = document.querySelector(".game-container");
       
//          //Create a new Progress tracker
//          this.progress = new Progress();
       
//          //Show the title screen
//          this.titleScreen = new TitleScreen({
//            progress: this.progress
//          })
//          const useSaveFile = await this.titleScreen.init(container);
       
//          //Potentially load saved data
//          let initialHeroState = null;
//          if (useSaveFile) {
//            this.progress.load();
//            initialHeroState = {
//              x: this.progress.startingHeroX,
//              y: this.progress.startingHeroY,
//              direction: this.progress.startingHeroDirection,
//            }
//          }
       
//          //Load the HUD
//          this.hud = new Hud();
//          this.hud.init(container);
       
//          //Start the first map
//          this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState );
       
//          //Create controls
//          this.bindActionInput();
//          this.bindHeroPositionCheck();
       
//          this.directionInput = new DirectionInput();
//          this.directionInput.init();
       
//          //Kick off the game!
//          this.startGameLoop();
       
       
//          // this.map.startCutscene([
//          //   { type: "battle", enemyId: "beth" }
//          //   // { type: "changeMap", map: "DemoRoom"}
//          //   // { type: "textMessage", text: "This is the very first message!"}
//          // ])
       
//         }
//        }

//        /// OVERLORD EVENT
//        /// OVERLORD EVENT
//        /// OVERLORD EVENT
//        /// OVERLORD EVENT
//        /// OVERLORD EVENT

//        class OverworldEvent {
//         constructor({ map, event}) {
//           this.map = map;
//           this.event = event;
//         }
      
//         stand(resolve) {
//           const who = this.map.gameObjects[ this.event.who ];
//           who.startBehavior({
//             map: this.map
//           }, {
//             type: "stand",
//             direction: this.event.direction,
//             time: this.event.time
//           })
          
//           //Set up a handler to complete when correct person is done walking, then resolve the event
//           const completeHandler = e => {
//             if (e.detail.whoId === this.event.who) {
//               document.removeEventListener("PersonStandComplete", completeHandler);
//               resolve();
//             }
//           }
//           document.addEventListener("PersonStandComplete", completeHandler)
//         }
      
//         walk(resolve) {
//           const who = this.map.gameObjects[ this.event.who ];
//           who.startBehavior({
//             map: this.map
//           }, {
//             type: "walk",
//             direction: this.event.direction,
//             retry: true
//           })
      
//           //Set up a handler to complete when correct person is done walking, then resolve the event
//           const completeHandler = e => {
//             if (e.detail.whoId === this.event.who) {
//               document.removeEventListener("PersonWalkingComplete", completeHandler);
//               resolve();
//             }
//           }
//           document.addEventListener("PersonWalkingComplete", completeHandler)
      
//         }
      
//         textMessage(resolve) {
      
//           if (this.event.faceHero) {
//             const obj = this.map.gameObjects[this.event.faceHero];
//             obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
//           }
      
//           const message = new TextMessage({
//             text: this.event.text,
//             onComplete: () => resolve()
//           })
//           message.init( document.querySelector(".game-container") )
//         }
      
//         changeMap(resolve) {
      
//           const sceneTransition = new SceneTransition();
//           sceneTransition.init(document.querySelector(".game-container"), () => {
//             this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
//               x: this.event.x,
//               y: this.event.y,
//               direction: this.event.direction,
//             });
//             resolve();
      
//             sceneTransition.fadeOut();
      
//           })
//         }
      
//         battle(resolve) {
//           const battle = new Battle({
//             enemy: Enemies[this.event.enemyId],
//             onComplete: (didWin) => {
//               resolve(didWin ? "WON_BATTLE" : "LOST_BATTLE");
//             }
//           })
//           battle.init(document.querySelector(".game-container"));
      
//         }
      
//         pause(resolve) {
//           this.map.isPaused = true;
//           const menu = new PauseMenu({
//             progress: this.map.overworld.progress,
//             onComplete: () => {
//               resolve();
//               this.map.isPaused = false;
//               this.map.overworld.startGameLoop();
//             }
//           });
//           menu.init(document.querySelector(".game-container"));
//         }
      
//         addStoryFlag(resolve) {
//           window.playerState.storyFlags[this.event.flag] = true;
//           resolve();
//         }
      
//         craftingMenu(resolve) {
//           const menu = new CraftingMenu({
//             pizzas: this.event.pizzas,
//             onComplete: () => {
//               resolve();
//             }
//           })
//           menu.init(document.querySelector(".game-container"))
//         }
      
//         init() {
//           return new Promise(resolve => {
//             this[this.event.type](resolve)      
//           })
//         }
      
//       }

//       // OVERLORDMAP
//       // OVERLORDMAP
//       // OVERLORDMAP
//       // OVERLORDMAP
//       // OVERLORDMAP
//       // OVERLORDMAP

//       class OverworldMap {
//         constructor(config) {
//           this.overworld = null;
//           this.gameObjects = config.gameObjects;
//           this.cutsceneSpaces = config.cutsceneSpaces || {};
//           this.walls = config.walls || {};
      
//           this.lowerImage = new Image();
//           this.lowerImage.src = config.lowerSrc;
      
//           this.upperImage = new Image();
//           this.upperImage.src = config.upperSrc;
      
//           this.isCutscenePlaying = false;
//           this.isPaused = false;
//         }
      
//         drawLowerImage(ctx, cameraPerson) {
//           ctx.drawImage(
//             this.lowerImage, 
//             utils.withGrid(10.5) - cameraPerson.x, 
//             utils.withGrid(6) - cameraPerson.y
//             )
//         }
      
//         drawUpperImage(ctx, cameraPerson) {
//           ctx.drawImage(
//             this.upperImage, 
//             utils.withGrid(10.5) - cameraPerson.x, 
//             utils.withGrid(6) - cameraPerson.y
//           )
//         } 
      
//         isSpaceTaken(currentX, currentY, direction) {
//           const {x,y} = utils.nextPosition(currentX, currentY, direction);
//           return this.walls[`${x},${y}`] || false;
//         }
      
//         mountObjects() {
//           Object.keys(this.gameObjects).forEach(key => {
      
//             let object = this.gameObjects[key];
//             object.id = key;
      
//             //TODO: determine if this object should actually mount
//             object.mount(this);
      
//           })
//         }
      
//         async startCutscene(events) {
//           this.isCutscenePlaying = true;
      
//           for (let i=0; i<events.length; i++) {
//             const eventHandler = new OverworldEvent({
//               event: events[i],
//               map: this,
//             })
//             const result = await eventHandler.init();
//             if (result === "LOST_BATTLE") {
//               break;
//             }
//           }
      
//           this.isCutscenePlaying = false;
      
//           //Reset NPCs to do their idle behavior (if they are standing)
//           Object.values(this.gameObjects).forEach(object => {
//             const current = object.behaviorLoop[object.behaviorLoopIndex];
//             if (current && current.type === "stand") {
//               object.doBehaviorEvent(this);
//             }
//           })
      
//         }
      
//         checkForActionCutscene() {
//           const hero = this.gameObjects["hero"];
//           const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
//           const match = Object.values(this.gameObjects).find(object => {
//             return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
//           });
//           if (!this.isCutscenePlaying && match && match.talking.length) {
      
//             const relevantScenario = match.talking.find(scenario => {
//               return (scenario.required || []).every(sf => {
//                 return playerState.storyFlags[sf]
//               })
//             })
//             relevantScenario && this.startCutscene(relevantScenario.events)
//           }
//         }
      
//         checkForFootstepCutscene() {
//           const hero = this.gameObjects["hero"];
//           const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
//           if (!this.isCutscenePlaying && match) {
//             this.startCutscene( match[0].events )
//           }
//         }
      
//         addWall(x,y) {
//           this.walls[`${x},${y}`] = true;
//         }
//         removeWall(x,y) {
//           delete this.walls[`${x},${y}`]
//         }
//         moveWall(wasX, wasY, direction) {
//           this.removeWall(wasX, wasY);
//           const {x,y} = utils.nextPosition(wasX, wasY, direction);
//           this.addWall(x,y);
//         }
      
//       }
      
//       window.OverworldMaps = {
//         DemoRoom: {
//           id: "DemoRoom",
//           lowerSrc: "/images/maps/PXL_Lower.png",
//           upperSrc: "/images/maps/PXL_Highier.png",
//           gameObjects: {
//             hero: new Person({
//               isPlayerControlled: true,
//               x: utils.withGrid(22),
//               y: utils.withGrid(16),
//             }),
//             // npcA: new Person({
//             //   x: utils.withGrid(9),
//             //   y: utils.withGrid(9),
//             //   src: "/images/characters/people/npc1.png",
//             //   behaviorLoop: [
//             //     { type: "walk", direction: "left", },
//             //     { type: "walk", direction: "down", },
//             //     { type: "walk", direction: "right", },
//             //     { type: "walk", direction: "up", },
//             //     //{ type: "stand", direction: "up", time: 400, },
//             //   ],
//             //   talking: [
//             //     {
//             //       required: ["TALKED_TO_ERIO"],
//             //       events: [
//             //         { type: "textMessage", text: "Isn't Erio the coolest?", faceHero: "npcA" },
//             //       ]
//             //     },
//             //     {
//             //       events: [
//             //         { type: "textMessage", text: "I'm going to crush you!", faceHero: "npcA" },
//             //         { type: "battle", enemyId: "beth" },
//             //         { type: "addStoryFlag", flag: "DEFEATED_BETH"},
//             //         { type: "textMessage", text: "You crushed me like weak pepper.", faceHero: "npcA" },
//             //         { type: "textMessage", text: "Go away!"},
//             //         { who: "npcB", type: "walk",  direction: "up" },
//             //       ]
//             //     }
//             //   ]
//             // }),
//             // npcC: new Person({
//             //   x: utils.withGrid(4),
//             //   y: utils.withGrid(8),
//             //   src: "/images/characters/people/npc1.png",
//             //   behaviorLoop: [
//             //     { type: "stand", direction: "left", time: 500, },
//             //     { type: "stand", direction: "down", time: 500, },
//             //     { type: "stand", direction: "right", time: 500, },
//             //     { type: "stand", direction: "up", time: 500, },
//             //   ],
//             // }),
//             // npcB: new Person({
//             //   x: utils.withGrid(8),
//             //   y: utils.withGrid(5),
//             //   src: "/images/characters/people/erio.png",
//             //   talking: [
//             //     {
//             //       events: [
//             //         { type: "textMessage", text: "Bahaha!", faceHero: "npcB" },
//             //         { type: "addStoryFlag", flag: "TALKED_TO_ERIO"}
//             //         //{ type: "battle", enemyId: "erio" }
//             //       ]
//             //     }
//             //   ]
//             //   // behaviorLoop: [
//             //   //   { type: "walk",  direction: "left" },
//             //   //   { type: "stand",  direction: "up", time: 800 },
//             //   //   { type: "walk",  direction: "up" },
//             //   //   { type: "walk",  direction: "right" },
//             //   //   { type: "walk",  direction: "down" },
//             //   // ]
//             // }),
//             // pizzaStone: new PizzaStone({
//             //   x: utils.withGrid(2),
//             //   y: utils.withGrid(7),
//             //   storyFlag: "USED_PIZZA_STONE",
//             //   pizzas: ["v001", "f001"],
//             // }),
//           },
//           walls: {
//             [utils.asGridCoord(39,27)] : true,
//             [utils.asGridCoord(40,27)] : true,
//             [utils.asGridCoord(40,24)] : true,
//             [utils.asGridCoord(39,24)] : true,
//             [utils.asGridCoord(38,24)] : true,
//             [utils.asGridCoord(37,24)] : true,
//             [utils.asGridCoord(36,24)] : true,
//             [utils.asGridCoord(35,24)] : true,
//             [utils.asGridCoord(35,23)] : true,
//             [utils.asGridCoord(36,23)] : true,
//             [utils.asGridCoord(36,22)] : true,
//             [utils.asGridCoord(37,22)] : true,
//             [utils.asGridCoord(37,21)] : true,
//             [utils.asGridCoord(36,20)] : true,
//             [utils.asGridCoord(35,20)] : true,
//             [utils.asGridCoord(34,20)] : true,
//             [utils.asGridCoord(33,20)] : true,
//             [utils.asGridCoord(32,17)] : true,
//             [utils.asGridCoord(32,18)] : true,
//             [utils.asGridCoord(32,19)] : true,
//             [utils.asGridCoord(32,20)] : true,
//             [utils.asGridCoord(32,19)] : true,
//             [utils.asGridCoord(32,18)] : true,
//             [utils.asGridCoord(32,17)] : true,
//             [utils.asGridCoord(39,13)] : true,
//             [utils.asGridCoord(39,14)] : true,
//             [utils.asGridCoord(39,15)] : true,
//             [utils.asGridCoord(38,15)] : true,
//             [utils.asGridCoord(37,15)] : true,
//             [utils.asGridCoord(36,15)] : true,
//             [utils.asGridCoord(35,15)] : true,
//             [utils.asGridCoord(34,15)] : true,
//             [utils.asGridCoord(33,15)] : true,
//             [utils.asGridCoord(33,17)] : true,
//             [utils.asGridCoord(33,16)] : true,
//             [utils.asGridCoord(33,15)] : true,
//             [utils.asGridCoord(33,14)] : true,
//             [utils.asGridCoord(33,13)] : true,
//             [utils.asGridCoord(33,12)] : true,
//             [utils.asGridCoord(34,12)] : true,
//             [utils.asGridCoord(35,12)] : true,
//             [utils.asGridCoord(36,12)] : true,
//             [utils.asGridCoord(37,12)] : true,
//             [utils.asGridCoord(38,12)] : true,
//             [utils.asGridCoord(39,12)] : true,
//             [utils.asGridCoord(39,13)] : true,
//             [utils.asGridCoord(40,13)] : true,
//             [utils.asGridCoord(41,13)] : true,
//             [utils.asGridCoord(42,13)] : true,
//             [utils.asGridCoord(43,13)] : true,
//             [utils.asGridCoord(43,12)] : true,
//             [utils.asGridCoord(43,11)] : true,
//             [utils.asGridCoord(45,11)] : true,
//             [utils.asGridCoord(46,11)] : true,
//             [utils.asGridCoord(46,10)] : true,
//             [utils.asGridCoord(46,9)] : true,
//             [utils.asGridCoord(47,8)] : true,
//             [utils.asGridCoord(47,7)] : true,
//             [utils.asGridCoord(47,6)] : true,
//             [utils.asGridCoord(47,5)] : true,
//             [utils.asGridCoord(47,4)] : true,
//             [utils.asGridCoord(47,3)] : true,
//             [utils.asGridCoord(47,2)] : true,
//             [utils.asGridCoord(46,2)] : true,
//             [utils.asGridCoord(45,2)] : true,
//             [utils.asGridCoord(44,2)] : true,
//             [utils.asGridCoord(43,2)] : true,
//             [utils.asGridCoord(42,2)] : true,
//             [utils.asGridCoord(41,2)] : true,
//             [utils.asGridCoord(40,2)] : true,
//             [utils.asGridCoord(39,2)] : true,
//             [utils.asGridCoord(38,2)] : true,
//             [utils.asGridCoord(37,2)] : true,
//             [utils.asGridCoord(36,2)] : true,
//             [utils.asGridCoord(36,3)] : true,
//             [utils.asGridCoord(36,4)] : true,
//             [utils.asGridCoord(35,4)] : true,
//             [utils.asGridCoord(34,4)] : true,
//             [utils.asGridCoord(34,3)] : true,
//             [utils.asGridCoord(34,2)] : true,
//             [utils.asGridCoord(33,2)] : true,
//             [utils.asGridCoord(32,3)] : true,
//             [utils.asGridCoord(32,4)] : true,
//             [utils.asGridCoord(32,5)] : true,
//             [utils.asGridCoord(32,6)] : true,
//             [utils.asGridCoord(31,6)] : true,
//             [utils.asGridCoord(30,6)] : true,
//             [utils.asGridCoord(29,5)] : true,
//             [utils.asGridCoord(28,5)] : true,
//             [utils.asGridCoord(27,5)] : true,
//             [utils.asGridCoord(26,5)] : true,
//             [utils.asGridCoord(26,6)] : true,
//             [utils.asGridCoord(25,6)] : true,
//             [utils.asGridCoord(25,5)] : true,
//             [utils.asGridCoord(25,4)] : true,
//             [utils.asGridCoord(25,3)] : true,
//             [utils.asGridCoord(26,2)] : true,
//             [utils.asGridCoord(25,2)] : true,
//             [utils.asGridCoord(24,2)] : true,
//             [utils.asGridCoord(23,2)] : true,
//             [utils.asGridCoord(22,2)] : true,
//             [utils.asGridCoord(21,2)] : true,
//             [utils.asGridCoord(20,2)] : true,
//             [utils.asGridCoord(19,2)] : true,
//             [utils.asGridCoord(18,2)] : true,
//             [utils.asGridCoord(17,2)] : true,
//             [utils.asGridCoord(16,2)] : true,
//             [utils.asGridCoord(15,2)] : true,
//             [utils.asGridCoord(15,3)] : true,
//             [utils.asGridCoord(15,4)] : true,
//             [utils.asGridCoord(15,5)] : true,
//             [utils.asGridCoord(15,6)] : true,
//             [utils.asGridCoord(8,6)] : true,
//             [utils.asGridCoord(7,7)] : true,
//             [utils.asGridCoord(8,7)] : true,
      
//       // bas
//       [utils.asGridCoord(0,38)] : true,
//       [utils.asGridCoord(1,38)] : true,
//       [utils.asGridCoord(2,38)] : true,
//       [utils.asGridCoord(3,38)] : true,
//       [utils.asGridCoord(4,38)] : true,
//       [utils.asGridCoord(5,38)] : true,
//       [utils.asGridCoord(6,38)] : true,
//       [utils.asGridCoord(7,38)] : true,
//       [utils.asGridCoord(8,38)] : true,
//       [utils.asGridCoord(9,38)] : true,
//       [utils.asGridCoord(10,38)] : true,
//       [utils.asGridCoord(11,38)] : true,
//       [utils.asGridCoord(12,38)] : true,
//       [utils.asGridCoord(13,38)] : true,
//       [utils.asGridCoord(14,38)] : true,
//       [utils.asGridCoord(15,38)] : true,
//       [utils.asGridCoord(16,38)] : true,
//       [utils.asGridCoord(17,38)] : true,
//       [utils.asGridCoord(18,38)] : true,
//       [utils.asGridCoord(19,38)] : true,
//       [utils.asGridCoord(20,38)] : true,
//       [utils.asGridCoord(21,38)] : true,
//       [utils.asGridCoord(22,38)] : true,
//       [utils.asGridCoord(23,38)] : true,
//       [utils.asGridCoord(24,38)] : true,
//       [utils.asGridCoord(25,38)] : true,
//       [utils.asGridCoord(26,38)] : true,
//       [utils.asGridCoord(27,38)] : true,
//       [utils.asGridCoord(28,38)] : true,
//       [utils.asGridCoord(29,38)] : true,
//       [utils.asGridCoord(30,38)] : true,
//       [utils.asGridCoord(31,38)] : true,
//       [utils.asGridCoord(32,38)] : true,
//       [utils.asGridCoord(33,38)] : true,
//       [utils.asGridCoord(34,38)] : true,
//       [utils.asGridCoord(35,38)] : true,
//       [utils.asGridCoord(36,38)] : true,
//       [utils.asGridCoord(37,38)] : true,
//       [utils.asGridCoord(38,38)] : true,
//       [utils.asGridCoord(39,38)] : true,
//       [utils.asGridCoord(40,38)] : true,
//       [utils.asGridCoord(41,38)] : true,
//       [utils.asGridCoord(42,38)] : true,
//       [utils.asGridCoord(43,38)] : true,
//       [utils.asGridCoord(44,38)] : true,
//       [utils.asGridCoord(45,38)] : true,
//       [utils.asGridCoord(46,38)] : true,
      
//       //bas haut 
//       [utils.asGridCoord(14,37)] : true,
//       [utils.asGridCoord(14,36)] : true,
//       [utils.asGridCoord(14,35)] : true,
//       [utils.asGridCoord(14,34)] : true,
//       [utils.asGridCoord(14,33)] : true,
//       [utils.asGridCoord(14,32)] : true,
//       [utils.asGridCoord(14,31)] : true,
//       [utils.asGridCoord(14,30)] : true,
//       [utils.asGridCoord(14,29)] : true,
//       [utils.asGridCoord(14,28)] : true,
//       [utils.asGridCoord(14,27)] : true,
//       [utils.asGridCoord(15,27)] : true,
//       [utils.asGridCoord(16,27)] : true,
//       [utils.asGridCoord(17,27)] : true,
//       [utils.asGridCoord(18,27)] : true,
//       [utils.asGridCoord(18,26)] : true,
//       [utils.asGridCoord(18,25)] : true,
//       [utils.asGridCoord(18,24)] : true,
//       [utils.asGridCoord(18,23)] : true,
//       [utils.asGridCoord(18,22)] : true,
//       [utils.asGridCoord(18,21)] : true,
//       [utils.asGridCoord(17,21)] : true,
//       [utils.asGridCoord(16,21)] : true,
//       [utils.asGridCoord(15,21)] : true,
//       [utils.asGridCoord(14,21)] : true,
//       [utils.asGridCoord(13,21)] : true,
//       [utils.asGridCoord(12,21)] : true,
//       [utils.asGridCoord(11,21)] : true,
//       [utils.asGridCoord(10,21)] : true,
//       [utils.asGridCoord(9,21)] : true,
//       [utils.asGridCoord(8,21)] : true,
//       [utils.asGridCoord(7,21)] : true,
//       [utils.asGridCoord(6,21)] : true,
//       [utils.asGridCoord(5,21)] : true,
//       [utils.asGridCoord(5,20)] : true,
//       [utils.asGridCoord(5,19)] : true,
//       [utils.asGridCoord(5,18)] : true,
//       [utils.asGridCoord(5,17)] : true,
//       [utils.asGridCoord(5,16)] : true,
//       [utils.asGridCoord(5,15)] : true,
//       [utils.asGridCoord(5,14)] : true,
//       [utils.asGridCoord(6,14)] : true,
//       [utils.asGridCoord(7,14)] : true,
//       [utils.asGridCoord(8,14)] : true,
//       [utils.asGridCoord(9,14)] : true,
//       [utils.asGridCoord(10,14)] : true,
//       [utils.asGridCoord(11,14)] : true,
//       [utils.asGridCoord(12,14)] : true,
//       [utils.asGridCoord(13,14)] : true,
//       [utils.asGridCoord(14,14)] : true,
//       [utils.asGridCoord(15,14)] : true,
//       [utils.asGridCoord(16,14)] : true,
//       [utils.asGridCoord(17,14)] : true,
//       [utils.asGridCoord(17,13)] : true,
//       [utils.asGridCoord(17,12)] : true,
//       [utils.asGridCoord(17,11)] : true,
//       [utils.asGridCoord(17,10)] : true,
//       [utils.asGridCoord(17,9)] : true,
//       [utils.asGridCoord(17,8)] : true,
//       [utils.asGridCoord(17,7)] : true,
//       [utils.asGridCoord(17,6)] : true,
//       [utils.asGridCoord(16,6)] : true,
      
      
      
//             [utils.asGridCoord(40,37)] : true,
//       [utils.asGridCoord(40,36)] : true,
//       [utils.asGridCoord(40,35)] : true,
//       [utils.asGridCoord(40,34)] : true,
//       [utils.asGridCoord(40,33)] : true,
//       [utils.asGridCoord(40,32)] : true,
//       [utils.asGridCoord(40,32)] : true,
//       [utils.asGridCoord(41,32)] : true,
//       [utils.asGridCoord(42,32)] : true,
//       [utils.asGridCoord(43,32)] : true,
//       [utils.asGridCoord(43,33)] : true,
//       [utils.asGridCoord(43,34)] : true,
//       [utils.asGridCoord(44,34)] : true,
//       [utils.asGridCoord(45,34)] : true,
//       [utils.asGridCoord(46,34)] : true,
//       [utils.asGridCoord(47,34)] : true,
//       [utils.asGridCoord(48,34)] : true,
//       [utils.asGridCoord(48,33)] : true,
//       [utils.asGridCoord(48,32)] : true,
//       [utils.asGridCoord(49,32)] : true,
//       [utils.asGridCoord(50,32)] : true,
//       [utils.asGridCoord(51,32)] : true,
//       [utils.asGridCoord(52,32)] : true,
//       [utils.asGridCoord(53,31)] : true,
//       [utils.asGridCoord(54,31)] : true,
//       [utils.asGridCoord(55,31)] : true,
//       [utils.asGridCoord(56,31)] : true,
//       [utils.asGridCoord(56,30)] : true,
//       [utils.asGridCoord(56,29)] : true,
//       [utils.asGridCoord(57,28)] : true,
//       [utils.asGridCoord(58,28)] : true,
//       [utils.asGridCoord(59,28)] : true,
//       [utils.asGridCoord(60,28)] : true,
//       [utils.asGridCoord(61,28)] : true,
//       [utils.asGridCoord(61,27)] : true,
//       [utils.asGridCoord(62,26)] : true,
//       [utils.asGridCoord(63,26)] : true,
//       [utils.asGridCoord(64,26)] : true,
//       [utils.asGridCoord(65,26)] : true,
//       [utils.asGridCoord(66,26)] : true,
//       [utils.asGridCoord(67,26)] : true,
//       [utils.asGridCoord(67,25)] : true,
//       [utils.asGridCoord(67,24)] : true,
//       [utils.asGridCoord(67,23)] : true,
//       [utils.asGridCoord(67,22)] : true,
//       [utils.asGridCoord(67,21)] : true,
//       [utils.asGridCoord(67,22)] : true,
//       [utils.asGridCoord(67,20)] : true,
//       [utils.asGridCoord(67,19)] : true,
//       [utils.asGridCoord(67,18)] : true,
//       [utils.asGridCoord(67,17)] : true,
//       [utils.asGridCoord(67,16)] : true,
//       [utils.asGridCoord(67,15)] : true,
      
      
//       [utils.asGridCoord(66,15)] : true,
//       [utils.asGridCoord(65,15)] : true,
//       [utils.asGridCoord(64,15)] : true,
//       [utils.asGridCoord(63,15)] : true,
//       [utils.asGridCoord(62,15)] : true,
//       [utils.asGridCoord(61,15)] : true,
//       [utils.asGridCoord(61,14)] : true,
//       [utils.asGridCoord(61,13)] : true,
//       [utils.asGridCoord(60,13)] : true,
//       [utils.asGridCoord(60,12)] : true,
//       [utils.asGridCoord(60,11)] : true,
//       [utils.asGridCoord(59,11)] : true,
//       [utils.asGridCoord(59,10)] : true,
//       [utils.asGridCoord(58,10)] : true,
//       [utils.asGridCoord(58,9)] : true,
//       [utils.asGridCoord(57,9)] : true,
//       [utils.asGridCoord(57,8)] : true,
//       [utils.asGridCoord(57,7)] : true,
//       [utils.asGridCoord(56,7)] : true,
      
//       //mini cabane
      
//       [utils.asGridCoord(55,7)] : true,
//       [utils.asGridCoord(55,6)] : true,
//       [utils.asGridCoord(55,5)] : true,
//       [utils.asGridCoord(54,5)] : true,
//       [utils.asGridCoord(53,5)] : true,
//       [utils.asGridCoord(53,6)] : true,
//       [utils.asGridCoord(53,7)] : true,
//       [utils.asGridCoord(52,7)] : true,
      
      
//       // ANIS 
//       [utils.asGridCoord(51,7)] : true,
//       [utils.asGridCoord(51,8)] : true,
//       [utils.asGridCoord(51,9)] : true,
//       [utils.asGridCoord(51,10)] : true,
//       [utils.asGridCoord(51,11)] : true,
//       [utils.asGridCoord(52,11)] : true,
//       [utils.asGridCoord(52,12)] : true,
//       [utils.asGridCoord(53,12)] : true,
//       [utils.asGridCoord(53,13)] : true,
//       [utils.asGridCoord(53,14)] : true,
//       [utils.asGridCoord(53,15)] : true,
//       [utils.asGridCoord(53,16)] : true,
//       [utils.asGridCoord(52,16)] : true,
//       [utils.asGridCoord(52,17)] : true,
//       [utils.asGridCoord(52,18)] : true,
//       [utils.asGridCoord(52,19)] : true,
//       [utils.asGridCoord(52,20)] : true,
//       [utils.asGridCoord(51,20)] : true,
//       [utils.asGridCoord(51,21)] : true,
//       [utils.asGridCoord(50,21)] : true,
//       [utils.asGridCoord(49,21)] : true,
//       [utils.asGridCoord(48,21)] : true,
//       [utils.asGridCoord(47,21)] : true,
      
//       [utils.asGridCoord(47,20)] : true,
//       [utils.asGridCoord(46,20)] : true,
//       [utils.asGridCoord(45,20)] : true,
//       [utils.asGridCoord(44,20)] : true,
      
//       [utils.asGridCoord(44,19)] : true,
//       [utils.asGridCoord(44,18)] : true,
//       [utils.asGridCoord(44,17)] : true,
//       [utils.asGridCoord(44,16)] : true,
//       [utils.asGridCoord(44,15)] : true,
//       [utils.asGridCoord(44,14)] : true,
//       [utils.asGridCoord(44,13)] : true,
//       [utils.asGridCoord(44,12)] : true,
      
//       [utils.asGridCoord(45,12)] : true,
//       [utils.asGridCoord(45,11)] : true,
//       [utils.asGridCoord(46,11)] : true,
//       [utils.asGridCoord(46,10)] : true,
//       [utils.asGridCoord(46,9)] : true,
//       [utils.asGridCoord(46,8)] : true,
      
//       [utils.asGridCoord(45,8)] : true,
//       [utils.asGridCoord(44,8)] : true,
//       [utils.asGridCoord(43,8)] : true,
      
//       [utils.asGridCoord(43,9)] : true,
      
//       [utils.asGridCoord(42,9)] : true,
//       [utils.asGridCoord(41,9)] : true,
//       [utils.asGridCoord(40,9)] : true,
      
//       [utils.asGridCoord(40,10)] : true,
      
//       [utils.asGridCoord(39,10)] : true,
//       [utils.asGridCoord(38,10)] : true,
//       [utils.asGridCoord(37,10)] : true,
      
//       [utils.asGridCoord(37,11)] : true,
      
//       [utils.asGridCoord(36,11)] : true,
//       [utils.asGridCoord(35,11)] : true,
//       [utils.asGridCoord(34,11)] : true,
      
//       //mini lac
      
//       [utils.asGridCoord(26,14)] : true,
//       [utils.asGridCoord(27,14)] : true,
//       [utils.asGridCoord(28,14)] : true,
//       [utils.asGridCoord(28,13)] : true,
//       [utils.asGridCoord(29,13)] : true,
//       [utils.asGridCoord(30,13)] : true,
//       [utils.asGridCoord(31,13)] : true,
//       [utils.asGridCoord(31,14)] : true,
//       [utils.asGridCoord(32,14)] : true,
//       [utils.asGridCoord(33,15)] : true,
//       [utils.asGridCoord(33,16)] : true,
//       [utils.asGridCoord(34,16)] : true,
//       [utils.asGridCoord(35,16)] : true,
//       [utils.asGridCoord(36,16)] : true,
//       [utils.asGridCoord(37,16)] : true,
//       [utils.asGridCoord(37,17)] : true,
//       [utils.asGridCoord(37,18)] : true,
//       [utils.asGridCoord(37,19)] : true,
//       [utils.asGridCoord(36,19)] : true,
//       [utils.asGridCoord(36,20)] : true,
//       [utils.asGridCoord(35,20)] : true,
//       [utils.asGridCoord(34,20)] : true,
//       [utils.asGridCoord(33,20)] : true,
//       [utils.asGridCoord(32,20)] : true,
//       [utils.asGridCoord(31,20)] : true,
//       [utils.asGridCoord(30,20)] : true,
//       [utils.asGridCoord(29,20)] : true,
//       [utils.asGridCoord(29,19)] : true,
//       [utils.asGridCoord(28,19)] : true,
//       [utils.asGridCoord(28,18)] : true,
//       [utils.asGridCoord(28,17)] : true,
//       [utils.asGridCoord(27,17)] : true,
//       [utils.asGridCoord(27,16)] : true,
//       [utils.asGridCoord(26,16)] : true,
//       [utils.asGridCoord(26,15)] : true,
      
//       //DALOS
      
      
       
      
//           },
//           cutsceneSpaces: {
//             [utils.asGridCoord(7,4)]: [
//               {
//                 events: [
//                   { who: "npcB", type: "walk",  direction: "left" },
//                   { who: "npcB", type: "stand",  direction: "up", time: 500 },
//                   { type: "textMessage", text:"You can't be in there!"},
//                   { who: "npcB", type: "walk",  direction: "right" },
//                   { who: "hero", type: "walk",  direction: "down" },
//                   { who: "hero", type: "walk",  direction: "left" },
//                 ]
//               }
//             ],
//             [utils.asGridCoord(28,6)]: [
//               {
//                 events: [
//                   { 
//                     type: "changeMap", 
//                     map: "Kitchen",
//                     x: utils.withGrid(9),
//                     y: utils.withGrid(11), 
//                     direction: "down"
//                   }
//                 ]
//               }
//             ]
//           }
          
//         },
//         Kitchen: {
//           id: "Kitchen",
//           lowerSrc: "/images/maps/KitchenLower.png",
//           upperSrc: "/images/maps/KitchenUpper.png",
//           gameObjects: {
//             hero: new Person({
//               isPlayerControlled: true,
//               x: utils.withGrid(9),
//               y: utils.withGrid(11),
//             }),
//             npcB: new Person({
//               x: utils.withGrid(9),
//               y: utils.withGrid(5),
//               src: "/images/characters/people/npc3.png",
//               talking: [
//                 {
//                   events: [
                   
//                     { type: "textMessage", text: "We finally meet, Black Bunny! Let's end it once and for all", faceHero: "npcB" },
//                     { type: "battle", enemyId: "Bushi" },
//                     { type: "addStoryFlag", flag: "DEFEATED_Bushi"},
//                     { type: "textMessage", text: "You won the battle but the war isn't over.", faceHero: "npcB" },
//                     { type: "textMessage", text: "Go away!"},
//                   ]
//                 }
//               ]
//             })
//           },
//           walls:{
//             [utils.asGridCoord(0,3)] : true,
//             [utils.asGridCoord(1,3)] : true,
//             [utils.asGridCoord(2,3)] : true,
//             [utils.asGridCoord(3,3)] : true,
//             [utils.asGridCoord(4,3)] : true,
//             [utils.asGridCoord(5,3)] : true,
//             [utils.asGridCoord(6,3)] : true,
//             [utils.asGridCoord(7,3)] : true,
//             [utils.asGridCoord(8,3)] : true,
//             [utils.asGridCoord(9,3)] : true,
//             [utils.asGridCoord(10,3)] : true,
//             [utils.asGridCoord(11,3)] : true,
//             [utils.asGridCoord(12,3)] : true,
//             [utils.asGridCoord(13,3)] : true,
//             [utils.asGridCoord(14,3)] : true,
//             [utils.asGridCoord(15,3)] : true,
//             [utils.asGridCoord(16,3)] : true,
//             [utils.asGridCoord(17,3)] : true,
//             [utils.asGridCoord(18,3)] : true,
//             [utils.asGridCoord(19,3)] : true,
//             [utils.asGridCoord(20,3)] : true,
//             [utils.asGridCoord(20,4)] : true,
//             [utils.asGridCoord(20,5)] : true,
//             [utils.asGridCoord(20,6)] : true,
//             [utils.asGridCoord(20,7)] : true,
//             [utils.asGridCoord(20,8)] : true,
//             [utils.asGridCoord(20,9)] : true,
//             [utils.asGridCoord(20,10)] : true,
//             [utils.asGridCoord(20,11)] : true,
//             [utils.asGridCoord(19,11)] : true,
//             [utils.asGridCoord(18,11)] : true,
//             [utils.asGridCoord(17,11)] : true,
//             [utils.asGridCoord(16,11)] : true,
//             [utils.asGridCoord(15,11)] : true,
//             [utils.asGridCoord(14,11)] : true,
//             [utils.asGridCoord(13,11)] : true,
//             [utils.asGridCoord(12,11)] : true,
//             [utils.asGridCoord(11,11)] : true,
//             [utils.asGridCoord(11,12)] : true,
//             [utils.asGridCoord(11,13)] : true,
//             [utils.asGridCoord(11,13)] : true,
//             [utils.asGridCoord(10,13)] : true,
//             [utils.asGridCoord(9,13)] : true,
//             [utils.asGridCoord(8,13)] : true,
//             [utils.asGridCoord(7,12)] : true,
//             [utils.asGridCoord(7,11)] : true,
//             [utils.asGridCoord(6,11)] : true,
//             [utils.asGridCoord(5,11)] : true,
//             [utils.asGridCoord(4,11)] : true,
//             [utils.asGridCoord(3,11)] : true,
//             [utils.asGridCoord(2,11)] : true,
//             [utils.asGridCoord(1,11)] : true,
//             [utils.asGridCoord(0,11)] : true,
//             [utils.asGridCoord(-1,11)] : true,
//             [utils.asGridCoord(-1,10)] : true,
//             [utils.asGridCoord(-1,9)] : true,
//             [utils.asGridCoord(-1,8)] : true,
//             [utils.asGridCoord(-1,7)] : true,
//             [utils.asGridCoord(-1,6)] : true,
//             [utils.asGridCoord(-1,5)] : true,
//             [utils.asGridCoord(-1,4)] : true,
//             [utils.asGridCoord(-1,3)] : true,
//             [utils.asGridCoord(-1,2)] : true,
//             [utils.asGridCoord(-1,1)] : true,
           
           
           
           
//           },
//           cutsceneSpaces: {
//             [utils.asGridCoord(9,12)]: [
//               {
//                 events: [
//                   { 
//                     type: "changeMap", 
//                     map: "DemoRoom",
//                     x: utils.withGrid(28),
//                     y: utils.withGrid(8), 
//                     direction: "down"
//                   }
//                 ]
//               }
//             ]
//           }
//         },
//         Street: {
//           id: "Street",
//           lowerSrc: "/images/maps/StreetLower.png",
//           upperSrc: "/images/maps/StreetUpper.png",
//           gameObjects: {
//             hero: new Person({
//               isPlayerControlled: true,
//               x: utils.withGrid(30),
//               y: utils.withGrid(10),
//             })
//           },
//           cutsceneSpaces: {
//             [utils.asGridCoord(29,9)]: [
//               {
//                 events: [
//                   { 
//                     type: "changeMap",
//                     map: "DemoRoom",
//                     x: utils.withGrid(5),
//                     y: utils.withGrid(10), 
//                     direction: "up"
//                   }
//                 ]
//               }
//             ]
//           }
//         }
//       }

//       //PauseMenu
//       //PauseMenu
//       //PauseMenu
//       //PauseMenu
//       //PauseMenu
//       //PauseMenu

//       class PauseMenu {
//         constructor({progress, onComplete}) {
//           this.progress = progress;
//           this.onComplete = onComplete;
//         }
      
//         getOptions(pageKey) {
      
//           //Case 1: Show the first page of options
//           if (pageKey === "root") {
//             const lineupPizzas = playerState.lineup.map(id => {
//               const {pizzaId} = playerState.pizzas[id];
//               const base = Pizzas[pizzaId];
//               return {
//                 label: base.name,
//                 description: base.description,
//                 handler: () => {
//                   this.keyboardMenu.setOptions( this.getOptions(id) )
//                 }
//               }
//             })
//             return [
//               ...lineupPizzas,
//               {
//                 label: "Save",
//                 description: "Save your progress",
//                 handler: () => {
//                   this.progress.save();
//                   this.close();
//                 }
//               },
//               {
//                 label: "Close",
//                 description: "Close the pause menu",
//                 handler: () => {
//                   this.close();
//                 }
//               }
//             ]
//           }
      
//           //Case 2: Show the options for just one pizza (by id)
//           const unequipped = Object.keys(playerState.pizzas).filter(id => {
//             return playerState.lineup.indexOf(id) === -1;
//           }).map(id => {
//             const {pizzaId} = playerState.pizzas[id];
//             const base = Pizzas[pizzaId];
//             return {
//               label: `Swap for ${base.name}`,
//               description: base.description,
//               handler: () => {
//                 playerState.swapLineup(pageKey, id);
//                 this.keyboardMenu.setOptions( this.getOptions("root") );
//               }
//             }
//           })
      
//           return [
//             ...unequipped,
//             {
//               label: "Move to front",
//               description: "Move this pizza to the front of the list",
//               handler: () => {
//                 playerState.moveToFront(pageKey);
//                 this.keyboardMenu.setOptions( this.getOptions("root") );
//               }
//             },
//             {
//               label: "Back",
//               description: "Back to root menu",
//               handler: () => {
//                 this.keyboardMenu.setOptions( this.getOptions("root") );
//               }
//             }
//           ];
//         }
      
//         createElement() {
//           this.element = document.createElement("div");
//           this.element.classList.add("PauseMenu");
//           this.element.classList.add("overlayMenu");
//           this.element.innerHTML = (`
//             <h2>Pause Menu</h2>
//           `)
//         }
      
//         close() {
//           this.esc?.unbind();
//           this.keyboardMenu.end();
//           this.element.remove();
//           this.onComplete();
//         }
      
//         async init(container) {
//           this.createElement();
//           this.keyboardMenu = new KeyboardMenu({
//             descriptionContainer: container
//           })
//           this.keyboardMenu.init(this.element);
//           this.keyboardMenu.setOptions(this.getOptions("root"));
      
//           container.appendChild(this.element);
      
//           utils.wait(200);
//           this.esc = new KeyPressListener("Escape", () => {
//             this.close();
//           })
//         }
      
//       }
//       // Person
//       // Person
//       // Person
//       // Person
//       // Person
//       // Person

//       class Person extends GameObject {
//         constructor(config) {
//           super(config);
//           this.movingProgressRemaining = 0;
//           this.isStanding = false;
      
//           this.isPlayerControlled = config.isPlayerControlled || false;
      
//           this.directionUpdate = {
//             "up": ["y", -1],
//             "down": ["y", 1],
//             "left": ["x", -1],
//             "right": ["x", 1],
//           }
      
//           this.standBehaviorTimeout;
//         }
      
//         update(state) {
//           if (this.movingProgressRemaining > 0) {
//             this.updatePosition();
//           } else {
      
//             //More cases for starting to walk will come here
//             //
//             //
      
//             //Case: We're keyboard ready and have an arrow pressed
//             if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
//               this.startBehavior(state, {
//                 type: "walk",
//                 direction: state.arrow
//               })
//             }
//             this.updateSprite(state);
//           }
//         }
      
//         startBehavior(state, behavior) {
//           //Set character direction to whatever behavior has
//           this.direction = behavior.direction;
          
//           if (behavior.type === "walk") {
//             //Stop here if space is not free
//             if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
      
              
//                 behavior.retry && setTimeout(() => {
//                   this.startBehavior(state, behavior)
//                 }, 10);
//                 return;
              
//             }
      
//             //Ready to walk!
//             state.map.moveWall(this.x, this.y, this.direction);
//             this.movingProgressRemaining = 16;
//             this.updateSprite(state);
//           }
      
//           if (behavior.type === "stand") {
//             this.isStanding = true;
//             this.standBehaviorTimeout = setTimeout(() => {
//               utils.emitEvent("PersonStandComplete", {
//                 whoId: this.id
//               })
//               this.isStanding = false;
//             }, behavior.time)
//           }
      
//         }
      
//         updatePosition() {
//             const [property, change] = this.directionUpdate[this.direction];
//             this[property] += change;
//             this.movingProgressRemaining -= 1;
      
//             if (this.movingProgressRemaining === 0) {
//               //We finished the walk!
//               utils.emitEvent("PersonWalkingComplete", {
//                 whoId: this.id
//               })
      
//             }
//         }
      
//         updateSprite() {
//           if (this.movingProgressRemaining > 0) {
//             this.sprite.setAnimation("walk-"+this.direction);
//             return;
//           }
//           this.sprite.setAnimation("idle-"+this.direction);    
//         }
      
//       }

//       //STONE
//       //STONE
//       //STONE
//       //STONE
//       //STONE

//       class PizzaStone extends GameObject {
//         constructor(config) {
//           super(config);
//           this.sprite = new Sprite({
//             gameObject: this,
//             src: "/images/characters/pizza-stone.png",
//             animations: {
//               "used-down"   : [ [0,0] ],
//               "unused-down" : [ [1,0] ],
//             },
//             currentAnimation: "used-down"
//           });
//           this.storyFlag = config.storyFlag;
//           this.pizzas = config.pizzas;
      
//           this.talking = [
//             {
//               required: [this.storyFlag],
//               events: [
//                 { type: "textMessage", text: "You have already used this." },
//               ]
//             },
//             {
//               events: [
//                 { type: "textMessage", text: "Approaching the legendary pizza stone..." },
//                 { type: "craftingMenu", pizzas: this.pizzas },
//                 { type: "addStoryFlag", flag: this.storyFlag },
//               ]
//             }
//           ]
      
//         }
      
//         update() {
//          this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
//           ? "used-down"
//           : "unused-down";
//         }
      
//       }

//       // Progress
//       // Progress
//       // Progress
//       // Progress
//       // Progress
//       // Progress
//       // Progress
//       // Progress


//       class Progress {
//         constructor() {
//           this.mapId = "DemoRoom";
//           this.startingHeroX = 0;
//           this.startingHeroY = 0;
//           this.startingHeroDirection = "down";
//           this.saveFileKey = "PizzaLegends_SaveFile1";
//         }
      
//         save() {
//           window.localStorage.setItem(this.saveFileKey, JSON.stringify({
//             mapId: this.mapId,
//             startingHeroX: this.startingHeroX,
//             startingHeroY: this.startingHeroY,
//             startingHeroDirection: this.startingHeroDirection,
//             playerState: {
//               pizzas: playerState.pizzas,
//               lineup: playerState.lineup,
//               items: playerState.items,
//               storyFlags: playerState.storyFlags
//             }
//           }))
//         }
      
//         getSaveFile() {
//           const file = window.localStorage.getItem(this.saveFileKey);
//           return file ? JSON.parse(file) : null
//         }
        
//         load() {
//           const file = this.getSaveFile();
//           if (file) {
//             this.mapId = file.mapId;
//             this.startingHeroX = file.startingHeroX;
//             this.startingHeroY = file.startingHeroY;
//             this.startingHeroDirection = file.startingHeroDirection;
//             Object.keys(file.playerState).forEach(key => {
//               playerState[key] = file.playerState[key];
//             })
//           }
//         }
      
//       }


//       // Revealing test
//       // Revealing test
//       // Revealing test
//       // Revealing test
//       // Revealing test
//       // Revealing test

//       class RevealingText {
//         constructor(config) {
//           this.element = config.element;
//           this.text = config.text;
//           this.speed = config.speed || 60;
      
//           this.timeout = null;
//           this.isDone = false;
//         }
      
//         revealOneCharacter(list) {
//           const next = list.splice(0,1)[0];
//           next.span.classList.add("revealed");
      
//           if (list.length > 0) {
//             this.timeout = setTimeout(() => {
//               this.revealOneCharacter(list)
//             }, next.delayAfter)
//           } else {
//             this.isDone = true;
//           }
//         }
      
//         warpToDone() {
//           clearTimeout(this.timeout);
//           this.isDone = true;
//           this.element.querySelectorAll("span").forEach(s => {
//             s.classList.add("revealed");
//           })
//         }
      
//         init() {
//           let characters = [];
//           this.text.split("").forEach(character => {
      
//             //Create each span, add to element in DOM
//             let span = document.createElement("span");
//             span.textContent = character;
//             this.element.appendChild(span);
      
//             //Add this span to our internal state Array
//             characters.push({
//               span,
//               delayAfter: character === " " ? 0 : this.speed         
//             })
//           })
      
//           this.revealOneCharacter(characters);
      
//         }
      
//       }

//       // Scene TRANSITION
//       // Scene TRANSITION
//       // Scene TRANSITION
//       // Scene TRANSITION
//       // Scene TRANSITION
//       // Scene TRANSITION
//       // Scene TRANSITION
//       // Scene TRANSITION
//       // Scene TRANSITION
//       // Scene TRANSITION


//       class SceneTransition {
//         constructor() {
//           this.element = null;
//         }
//         createElement() {
//           this.element = document.createElement("div");
//           this.element.classList.add("SceneTransition");
//         }
      
//         fadeOut() {
//           this.element.classList.add("fade-out");
//           this.element.addEventListener("animationend", () => {
//             this.element.remove();
//           }, { once: true })
//         }
      
//         init(container, callback) {
//           this.createElement();
//           container.appendChild(this.element);
      
//           this.element.addEventListener("animationend", () => {
//             callback();
//           }, { once: true })
      
//         }
//       }

//       // SPRITE
//       // SPRITE
//       // SPRITE
//       // SPRITE
//       // SPRITE
//       // SPRITE
//       // SPRITE
//       // SPRITE
//       // SPRITE

//       class Sprite {
//         constructor(config) {
      
//           //Set up the image
//           this.image = new Image();
//           this.image.src = config.src;
//           this.image.onload = () => {
//             this.isLoaded = true;
//           }
      
//           //Shadow
//           this.shadow = new Image();
//           this.useShadow = true; //config.useShadow || false
//           if (this.useShadow) {
//             this.shadow.src = "/images/characters/shadow.png";
//           }
//           this.shadow.onload = () => {
//             this.isShadowLoaded = true;
//           }
      
//           //Configure Animation & Initial State
//           this.animations = config.animations || {
//             "idle-down" : [ [0,0] ],
//             "idle-right": [ [0,1] ],
//             "idle-up"   : [ [0,2] ],
//             "idle-left" : [ [0,3] ],
//             "walk-down" : [ [1,0],[0,0],[3,0],[0,0], ],
//             "walk-right": [ [1,1],[0,1],[3,1],[0,1], ],
//             "walk-up"   : [ [1,2],[0,2],[3,2],[0,2], ],
//             "walk-left" : [ [1,3],[0,3],[3,3],[0,3], ]
//           }
//           this.currentAnimation = config.currentAnimation || "idle-down";
//           this.currentAnimationFrame = 0;
      
//           this.animationFrameLimit = config.animationFrameLimit || 8;
//           this.animationFrameProgress = this.animationFrameLimit;
          
      
//           //Reference the game object
//           this.gameObject = config.gameObject;
//         }
      
//         get frame() {
//           return this.animations[this.currentAnimation][this.currentAnimationFrame]
//         }
      
//         setAnimation(key) {
//           if (this.currentAnimation !== key) {
//             this.currentAnimation = key;
//             this.currentAnimationFrame = 0;
//             this.animationFrameProgress = this.animationFrameLimit;
//           }
//         }
      
//         updateAnimationProgress() {
//           //Downtick frame progress
//           if (this.animationFrameProgress > 0) {
//             this.animationFrameProgress -= 1;
//             return;
//           }
      
//           //Reset the counter
//           this.animationFrameProgress = this.animationFrameLimit;
//           this.currentAnimationFrame += 1;
      
//           if (this.frame === undefined) {
//             this.currentAnimationFrame = 0
//           }
      
      
//         }
        
      
//         draw(ctx, cameraPerson) {
//           const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
//           const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;
      
//           this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);
      
      
//           const [frameX, frameY] = this.frame;
      
//           this.isLoaded && ctx.drawImage(this.image,
//             frameX * 32, frameY * 32,
//             32,32,
//             x,y,
//             32,32
//           )
      
//           this.updateAnimationProgress();
//         }
      
//       }

//       // TEXT MESSAGE
//       // TEXT MESSAGE
//       // TEXT MESSAGE
//       // TEXT MESSAGE
//       // TEXT MESSAGE
//       // TEXT MESSAGE
//       // TEXT MESSAGE
//       // TEXT MESSAGE
//       // TEXT MESSAGE
//       // TEXT MESSAGE

//       class TextMessage {
//         constructor({ text, onComplete }) {
//           this.text = text;
//           this.onComplete = onComplete;
//           this.element = null;
//         }
      
//         createElement() {
//           //Create the element
//           this.element = document.createElement("div");
//           this.element.classList.add("TextMessage");
      
//           this.element.innerHTML = (`
//             <p class="TextMessage_p"></p>
//             <button class="TextMessage_button">Next</button>
//           `)
      
//           //Init the typewriter effect
//           this.revealingText = new RevealingText({
//             element: this.element.querySelector(".TextMessage_p"),
//             text: this.text
//           })
      
//           this.element.querySelector("button").addEventListener("click", () => {
//             //Close the text message
//             this.done();
//           });
      
//           this.actionListener = new KeyPressListener("Enter", () => {
//             this.done();
//           })
      
//         }
      
//         done() {
      
//           if (this.revealingText.isDone) {
//             this.element.remove();
//             this.actionListener.unbind();
//             this.onComplete();
//           } else {
//             this.revealingText.warpToDone();
//           }
//         }
      
//         init(container) {
//           this.createElement();
//           container.appendChild(this.element);
//           this.revealingText.init();
//         }
      
//       }
//       // TITLE SCREEN
//       // TITLE SCREEN
//       // TITLE SCREEN
//       // TITLE SCREEN
//       // TITLE SCREEN
//       // TITLE SCREEN
//       // TITLE SCREEN
//       // TITLE SCREEN
//       // TITLE SCREEN
//       // TITLE SCREEN


//       class TitleScreen {
//         constructor({ progress }) {
//           this.progress = progress;
//         }
      
//         getOptions(resolve) {
//           const safeFile = this.progress.getSaveFile();
//           return [
//             { 
//               label: "New Game",
//               description: "Start a new adventure!",
//               handler: () => {
//                 this.close();
//                 resolve();
//               }
//             },
//             safeFile ? {
//               label: "Continue Game",
//               description: "Resume your adventure",
//               handler: () => {
//                 this.close();
//                 resolve(safeFile);
//               }
//             } : null
//           ].filter(v => v);
//         }
      
//         createElement() {
//           this.element = document.createElement("div");
//           this.element.classList.add("TitleScreen");
         
      
//         }
      
//         close() {
//           this.keyboardMenu.end();
//           this.element.remove();
//         }
        
//         init(container) {
//           return new Promise(resolve => {
//             this.createElement();
//             container.appendChild(this.element);
//             this.keyboardMenu = new KeyboardMenu();
//             this.keyboardMenu.init(this.element);
//             this.keyboardMenu.setOptions(this.getOptions(resolve))
//           })
//         }
      
//       }

//       /// UTILS
//       /// UTILS
//       /// UTILS
//       /// UTILS
//       /// UTILS
//       /// UTILS
//       /// UTILS
//       /// UTILS
//       /// UTILS

//       const utils = {
//         withGrid(n) {
//           return n * 16;
//         },
//         asGridCoord(x,y) {
//           return `${x*16},${y*16}`
//         },
//         nextPosition(initialX, initialY, direction) {
//           let x = initialX;
//           let y = initialY;
//           const size = 16;
//           if (direction === "left") { 
//             x -= size;
//           } else if (direction === "right") {
//             x += size;
//           } else if (direction === "up") {
//             y -= size;
//           } else if (direction === "down") {
//             y += size;
//           }
//           return {x,y};
//         },
//         oppositeDirection(direction) {
//           if (direction === "left") { return "right" }
//           if (direction === "right") { return "left" }
//           if (direction === "up") { return "down" }
//           return "up"
//         },
      
//         wait(ms) {
//           return new Promise(resolve => {
//             setTimeout(() => {
//               resolve()
//             }, ms)
//           })
//         },
      
//         randomFromArray(array) {
//           return array[ Math.floor(Math.random()*array.length) ]
//         },
      
//         emitEvent(name, detail) {
//           const event = new CustomEvent(name, {
//             detail
//           });
//           document.dispatchEvent(event);
//         }
        
//       }

//       (function () {
//         console.log('ppppp')
//         const overworld = new Overworld({
//           element: document.querySelector(".game-container")
//         });
//         overworld.init();
      
//       })();
//       const overworld = new Overworld({
//         element: document.querySelector(".game-container")
//       });
//       overworld.init();


//   return (
//    <>
//     <div className="game-container">
//       <canvas className="game-canvas" width="352" height="198"></canvas>
//     </div>
//     </>
//   );
// };

// export default game;
