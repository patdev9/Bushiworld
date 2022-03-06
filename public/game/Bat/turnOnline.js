

class TurnOnline{
    constructor({battle, onNewEvent,socket}){
        this.battle = battle
        this.onNewEvent = onNewEvent
        this.currentTeam = "player"
        this.socket = socket
    }
    async turn(){
        //
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
          const expiredEvent = caster.decrementStatus();
          if (expiredEvent) {
            await this.onNewEvent(expiredEvent)
          }
        
          this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
          console.log(this.currentTeam,'CURENTTT TEAM');
          this.turn();
    }
    nextTurn() {
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();
      }

   async init(){
        await this.onNewEvent({
            type:"textMessage",
            text:'The battle starts'
        })
        this.turn()
    }
}