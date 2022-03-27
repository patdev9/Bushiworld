class BatOnline{
    
    constructor({PData,onComplete,socket, PlayNum,room}){
        
        var datas = localStorage.getItem('PlayerData');
       
        this.Playerdata = JSON.parse(datas)
        this.nfts = JSON.parse(localStorage.getItem('nfts'));
     
        this.onComplete =onComplete
        this.socket = socket
        this.PlayNum = PlayNum
        this.room = room
        
        this.combatants = {
            // "player":new CombatantOnline({
            //     ...Pizzas.s001,
            //     team:'player',
            //     hp:50,
            //     maxHp:50,
            //     xp:10,
            //     maxXp:100,
            //     level:1,
            //     status:null,
            //     player:0
            // },this),
            // "enemy": new CombatantOnline({
            //     ...Pizzas.s001,
            //     team:'enemy',
            //     hp:50,
            //     maxHp:50,
            //     xp:30,
            //     maxXp:100,
            //     level:1,
            //     status:null,
            //     player:1
            // },this)
        }
        this.activeCombatants = {
            player: null, //"player1",
            enemy: null, //"enemy1",
          }
       //  Dynamically add the Player team
      
    this.Playerdata[0].data.lineup.forEach(id => {
        this.addCombatant(id, "player", this.Playerdata[0].data.pizzas[id])
      });
    this.Playerdata[1].data.lineup.forEach(id => {
        this.addCombatantE(id+'E', "enemy", this.Playerdata[1].data.pizzas[id])
      });
      //Now the enemy team
     
    }
   

    addCombatant(id, team, config) {
      
       let pp = this.nfts[0].nfts
      
        this.combatants[id] = new CombatantOnline({
          ...pp[config.pizzaId],
          ...config,
          team,
          isPlayerControlled: team === "player",
          player:team == "player" ?0:1,
        }, this)
  
        //Populate first active pizza
  
        this.activeCombatants[team] = this.activeCombatants[team] || id
    }
    addCombatantE(id, team, config) {
     
       let pp = this.nfts[1].nfts
        this.combatants[id] = new Combatant({
          ...pp[config.pizzaId],
          ...config,
          team,
          isPlayerControlled: team === "player",
          player:team == "player" ?0:1,
        }, this)
  
        //Populate first active pizza
  
        this.activeCombatants[team] = this.activeCombatants[team] || id
    }
    
    
    createElement() {
      
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = (`
        <div class="Battle_hero">
          <img src="${'/images/characters/people/hero.png'}" alt="Hero" />
        </div>
        <div class="Battle_enemy">
          
        </div>
        `)
      }

    init(container){

        this.playerTeam = new Team("player", "Hero");
        this.enemyTeam = new Team("enemy", "Bully");
        
        this.createElement()
        container.appendChild(this.element)

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element)
            
            //Add to correct team
      
            if (combatant.team === "player") {
              this.playerTeam.combatants.push(combatant);
            } else if (combatant.team === "enemy") {
              this.enemyTeam.combatants.push(combatant);
            }
          })

          this.playerTeam.init(this.element);
          this.enemyTeam.init(this.element);
       


        this.turnCycle = new TurnOnline({
            
            battle:this,
            socket:this.socket,
            PlayNum:this.PlayNum,
            room:this.room,
            onNewEvent : event =>{
                return new Promise(resolve =>{
                   
                    const battleEveent = new EventOnline(event, this,this.socket,this.PlayNum,this.room)
                    battleEveent.init(resolve)
                })
            }, onWinner: winner => {

                if (winner === "player") {
                  const playerState = window.playerState;
                  Object.keys(playerState.pizzas).forEach(id => {
                    const playerStatePizza = playerState.pizzas[id];
                    const combatant = this.combatants[id];
                    if (combatant) {
                      // playerStatePizza.hp = combatant.hp;
                      // playerStatePizza.xp = combatant.xp;
                      // playerStatePizza.maxXp = combatant.maxXp;
                      // playerStatePizza.level = combatant.level;
                    }
                  })
        
                  //Get rid of player used items
                //   playerState.items = playerState.items.filter(item => {
                //     return !this.usedInstanceIds[item.instanceId]
                //   })
        
                  //Send signal to update
                  utils.emitEvent("PlayerStateUpdated");
                }
        
                this.element.remove();
                
                this.onComplete(winner === "player");
              }
        })
        this.turnCycle.init();
    }
}