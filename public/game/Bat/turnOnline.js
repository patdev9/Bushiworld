

class TurnOnline{
    constructor({battle, onNewEvent,socket,PlayNum,onWinner}){
        this.battle = battle
        this.onNewEvent = onNewEvent
        this.currentTeam = "player"
        this.socket = socket
        this.PlayNum = PlayNum
        this.onWinner = onWinner;
    }
    async turn(){
        //
        console.log(this.battle.activeCombatants,'AACCCCCTIV VCOMLMMMV')
        console.log(this.battle,'BATTLLLLELLELEELE')
        const casterId = this.battle.activeCombatants[this.currentTeam];
   
        const caster = this.battle.combatants[casterId];
        
        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"]
        const enemy = this.battle.combatants[enemyId];
        console.log(enemy,'ENEMY')
       
        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            enemy
          })
          
          

          const resultingEvents = caster.getReplacedEvents(submission.action.success);

          for (let i=0; i<resultingEvents.length; i++) {
            const event = {
              ...resultingEvents[i],
              submission,
              action: submission.action,
              caster,
              target: submission.target,
            }
            await this.onNewEvent(event);
          }

          const postEvents = caster.getPostEvents();
          for (let i=0; i < postEvents.length; i++ ) {
            const event = {
              ...postEvents[i],
              submission,
              action: submission.action,
              caster,
              target: submission.target, 
            }
            await this.onNewEvent(event);
          }
          const EnemypostEvents = enemy.getPostEvents();
          for (let i=0; i < EnemypostEvents.length; i++ ) {
            const event = {
              ...EnemypostEvents[i],
              submission,
              action: submission.action,
              caster:caster,
              target: submission.target, 
            }
            await this.onNewEvent(event);
          }
          const expiredEvent = caster.decrementStatus();
          if (expiredEvent) {
            await this.onNewEvent(expiredEvent)
          }

          const targetDead = submission.target.hp <= 0;
          if (targetDead) {
            await this.onNewEvent({ 
              type: "textMessage", text: `${submission.target.name} is ruined!`
            })
      
           
          }



          const winner = this.getWinningTeam();
    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: "Winner!"
      })
      this.onWinner(winner);
      return;
    }

    if (targetDead) {
        const replacement = await this.onNewEvent({
          type: "replacementMenu",
          team: submission.target.team
        })
        await this.onNewEvent({
          type: "replace",
          replacement: replacement
        })
        await this.onNewEvent({
          type: "textMessage",
          text: `${replacement.name} appears!`
        })
      }
        
          this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
          console.log(this.currentTeam,'CURENTTT TEAM');
          this.turn();
    }

    getWinningTeam() {
        let aliveTeams = {};
        Object.values(this.battle.combatants).forEach(c => {
          if (c.hp > 0) {
            aliveTeams[c.team] = true;
          }
        })
        if (!aliveTeams["player"]) { return "enemy"}
        if (!aliveTeams["enemy"]) { return "player"}
        return null;
      }

    nextTurn() {
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();
    }

   async init(){
       if (this.PlayNum == 0){
        await this.onNewEvent({
            type:"textMessage",
            text:'The battle starts'
        })
       }
        this.turn()
    }
}