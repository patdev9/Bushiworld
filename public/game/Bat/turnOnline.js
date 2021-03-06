

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
     
        const casterId = this.battle.activeCombatants[this.currentTeam];
   
        const caster = this.battle.combatants[casterId];
        
        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"]
        const enemy = this.battle.combatants[enemyId];
      console.log(caster)
      if (caster.xp < 100) {
            
        let newXp = caster.xp + 20;
        if (newXp > caster.maxXp) {
          newXp = who.maxHp;
        }
        caster.update({
          xp: newXp
        })
      }
       
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
          console.log(winner,'WINNER')
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
          this.turn();
    }

    getWinningTeam() {
        let aliveTeams = {};
        Object.values(this.battle.combatants).forEach(c => {
          console.log(c)
          if (c.hp > 0) {
            aliveTeams['winnerteam'] = c
            aliveTeams[c.team] = true;
          }
        })
        console.log(aliveTeams,'ALIBVE TEAM')
        if (!aliveTeams["player"]) { return [aliveTeams.winnerteam.wallet,aliveTeams.winnerteam.idgame]}
        if (!aliveTeams["enemy"]) { return [aliveTeams.winnerteam.wallet,aliveTeams.winnerteam.idgame]}
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