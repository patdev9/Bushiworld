class BatOnline{
    
    constructor({PData,onComplete,socket}){
        
        var datas = localStorage.getItem('PlayerData');
        var datas = localStorage.getItem('PlayerData');
        console.log(localStorage.getItem('PlayerNumber'),'PLAYERRRNUMBERRRRR')
        console.log(JSON.parse(datas),'PPPPPPPP')
        console.log(PData)
        console.log(onComplete)
        this.Playerdata = JSON.parse(datas)
        this.nfts = JSON.parse(localStorage.getItem('nfts'));
        console.log(this.nfts)
        console.log(this.Playerdata[0].data)
        console.log(this.Playerdata,'PPPPP')
        this.socket = socket
        
        this.combatants = {
        }
        
        this.activeCombatants = {
          player: null, //"player1",
          enemy: null, //"enemy1",
        }
        this.Playerdata[0].data.lineup.forEach(id=>{
            this.addCombatant(id,"player",this.Playerdata[0].data.pizzas[id] )
        })
        this.Playerdata[1].data.lineup.forEach(id=>{
            this.addCombatant(id,"enemy",this.Playerdata[1].data.pizzas[id] )
        })
        // window.playerState.lineup.forEach(id => {
        //     this.addCombatant(id, "player", window.playerState.pizzas[id])
        //   });
    }
    addCombatant(id, team, config) {
        this.combatants[id] = new Combatant({
          ...this.nfts[0][config.pizzaId],
          ...config,
          team,
          isPlayerControlled: team === "player"
        }, this)
  
        //Populate first active pizza
  
        console.log(this)
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
        
        this.createElement()
        container.appendChild(this.element)
        // this.playerTeam = new Team("player", "Hero");
        // this.enemyTeam = new Team("enemy", "Bully");
    
        // Object.keys(this.combatants).forEach(key => {
        //   let combatant = this.combatants[key];
        //   combatant.id = key;
        //   combatant.init(this.element)
          
        //   //Add to correct team
    
        //   if (combatant.team === "player") {
        //     this.playerTeam.combatants.push(combatant);
        //   } else if (combatant.team === "enemy") {
        //     this.enemyTeam.combatants.push(combatant);
        //   }
        // })

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key
            combatant.init(this.element)
        })

        this.turnCycle = new TurnOnline({
            battle:this,
            socket:this.socket,
            onNewEvent : event =>{
                return new Promise(resolve =>{
                    console.log(resolve)
                    const battleEveent = new EventOnline(event, this,this.socket)
                    battleEveent.init(resolve)
                })
            }
        })
        this.turnCycle.init();
    }
}