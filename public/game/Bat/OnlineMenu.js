class onlineMenu { 
    constructor({ caster, enemy, onComplete,socket,PlayNum,room}) {
      this.caster = caster;
      this.enemy = enemy;
      this.onComplete = onComplete;
      this.socket = socket
      this.PlayNum = PlayNum
      this.room =room
    }

    getPages() {

        const backOption = {
          label: "Go Back",
          description: "Return to previous page",
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().root)
          }
        };
    
        return {
          root: [
            {
              label: "Attack",
              description: "Choose an attack",
              handler: () => {
                //Do something when chosen...
                this.keyboardMenu.setOptions( this.getPages().attacks )
              }
            },
            {
              label: "Items",
              description: "Choose an item",
              handler: () => {
                //Go to items page...
                this.keyboardMenu.setOptions( this.getPages().items )
              }
            },
            {
              label: "Swap",
              description: "Change to another pizza",
              handler: () => { 
                //See pizza options
              }
            },
          ],
          attacks: [
            ...this.caster.actions.map(key => {
              const action = Actions[key];
              return {
                label: action.name,
                description: action.description,
                handler: () => {
                  this.menuSubmit(action)
                }
              }
            }),
            backOption
          ],
          items: [
            //items will go here...
            backOption
          ]
        }
      }

      menuSubmit(action, instanceId=null) {

        this.socket.emit('Attaque',action,this.room)
        this.keyboardMenu?.end();
        console.log(action)
        this.onComplete({
          action,
          target: action.targetType === "friendly" ? this.caster : this.enemy
        })
      //  this.socket.emit('Attaque',action)
      this.socket.on('AttaqueP1',(data)=>{
        console.log(data,'MENUSUBMIT')
    })
      }
  
   async decide() {
    // let Ass = Math.floor(Math.random() * (2 + 1))
    // this.menuSubmit(Actions[ this.caster.actions[Ass] ]);
       
    this.socket.once('AttaqueP1', (data) => {
     
        console.log(data,'decide')
        this.onComplete({
            action: data,
            target: this.enemy
          })
        
    });
    // this.socket.on('AttaqueP1',(data)=>{
    //     console.log(data,'decide')
    // })
    // return new Promise((resolve, reject) => {
    //     // socket.emit('create account', {username:username, password:password});
    
    //     this.socket.once('AttaqueP1', (data) => {
            
    //         console.log(data)
    //         resolve(data)
    //     });
    //   });

    //    return new Promise((resolve,reject)=>{
    //         resolve( this.socket.on('Attaque',(act) =>{
    //             console.log(act)
    //             this.onComplete({
    //                 action: act,
    //                 target: this.enemy
    //               })
    //         }))
    //     })
        // this.socket.on('AttaqueP1',(act) =>{
        //     console.log(act)
        //     this.onComplete({
        //         action: act,
        //         target: this.enemy
        //       })
        // })
        // await new Promise((resolve, reject) => {
            
        //     this.socket.on('AttaqueP1', answer => {
        //         console.log(answer,'PPAPAPAPAPAPAPAAPAP')
        //         this.socket.off('AttaqueP1');
        //         console.log(answer)
        //       resolve(answer);
        //     })
        //     setTimeout(reject, 1000);;
        // });
      
    }
    decide1 = async () => {
        // Let the server process data from client 
        let clientData= 'pppp'
        const result = await this.asyncEmit("Attaque", clientData); 
        // and have it returned back, something like a Fetch request
        console.log(result);
     }
     asyncEmit(eventName, data) {
        return new Promise(function (resolve, reject) {
         this.socket.emit(eventName, data);
          this.socket.on(eventName, result => {
            this.socket.off(eventName);
            resolve(result);
          });
          setTimeout(reject, 1000);
        });
      }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions( this.getPages().root )
      }
  
    async init(container) {
        console.log(localStorage.getItem('PlayerNumber'),'PLAYERRRNUMBERRRRR')
        let player = localStorage.getItem('PlayerNumber')
        console.log(this.caster)
        console.log(this.enemy)
       
            if(this.caster.player == this.PlayNum ){
                this.showMenu(container)
            }
            else{
              await this.decide()
            }
      
    }
  }

