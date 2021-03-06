class EventOnline {
    constructor(event, battle,socket,PlayNum,room){

        this.event = event
        this.battle = battle
        this.socket = socket
        this.PlayNum =PlayNum
        this.room=room
    }

    textMessage(resolve) {

        const text = this.event.text
        .replace("{CASTER}", this.event.caster?.name)
        .replace("{TARGET}", this.event.target?.name)
        .replace("{ACTION}", this.event.action?.name)
    
        const message = new TextMessage({
          text,
          onComplete: () => {
            resolve();
          }
        })
        message.init( this.battle.element )
      }
    async stateChange(resolve) {
        let {caster, target, damage, recover, status,skill,energy, action} = this.event;
       console.log(this.event)
        let who = this.event.onCaster ? caster : target;
        caster.update({
          xp: caster.xp - energy
        })
        if (damage) {
          //modify the target to have less HP
          if(skill == 'water' && target.type == 'fire'){
            damage = damage * 1.1
          }
          if(skill == 'moon' && target.type == 'thunder'){
            damage = damage * 1.1
          }
          if(skill == 'wind'){
            damage = damage * 1.1
          }
          if(skill == 'fire' && target.type == 'moon'){
            damage = damage * 1.1
          }
          if(skill == 'thunder' && target.type == 'water'){
            damage = damage * 1.1
          }
          if(skill == 'fire' && target.type == 'water'){
            damage = damage * 0.9
          }
          if(skill == 'thunder' && target.type == 'moon'){
            damage = damage * 0.9
          }
          if(skill == 'moon' && target.type == 'fire'){
            damage = damage * 0.9
          }
          if(skill == 'water' && target.type == 'thunder'){
            damage = damage * 1.1
          }
          
            target.update({
              hp: target.hp - damage
            })
          
         
          
          //start blinking
          target.pizzaElement.classList.add("battle-damage-blink");
        }
    
        if (recover) {
            
          let newHp = who.hp + recover;
          if (newHp > who.maxHp) {
            newHp = who.maxHp;
          }
          who.update({
            hp: newHp
          })
        }
    
        if (status) {
            who.update({
              status: {...status}
            })
          }

          if (status === null) {
            who.update({
              status: null
            })
          }
    
    
        //Wait a little bit
        await utils.wait(600)
    
        //Update Team components

        // this.battle.playerTeam.update();
        // this.battle.enemyTeam.update();
    
        //stop blinking
        target.pizzaElement.classList.remove("battle-damage-blink");
        resolve();
      }
      
      submissionMenu(resolve) {
         
        const menu = new onlineMenu({

          caster: this.event.caster,
          enemy: this.event.enemy,
          socket:this.socket,
          PlayNum:this.PlayNum,
          room:this.room,
          onComplete: submission => {
            //submission { what move to use, who to use it on }
            resolve(submission)
          }
        })
        menu.init( this.battle.element)
      }

      replacementMenu(resolve) {
        const menu = new replaceOnline({
          replacements: Object.values(this.battle.combatants).filter(c => {
            return c.team === this.event.team && c.hp > 0
          }),
          onComplete: replacement => {
            resolve(replacement)
          }
        })
        menu.init( this.battle.element )
      }

      async replace(resolve) {
        const {replacement} = this.event;
    
        //Clear out the old combatant
        const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
        this.battle.activeCombatants[replacement.team] = null;
        prevCombatant.update();
        await utils.wait(400);
    
        //In with the new!
        this.battle.activeCombatants[replacement.team] = replacement.id;
        replacement.update();
        await utils.wait(400);
    
        //Update Team components
        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();
    
        resolve();
      }

      animation(resolve) {
        const fn = BattleAnimations[this.event.animation];
        fn(this.event, resolve);
      }
    
      init(resolve) {
        this[this.event.type](resolve);
      }
}