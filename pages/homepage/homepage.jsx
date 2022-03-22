/* eslint-disable react-hooks/exhaustive-deps */
import React , { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/data/dataActions";
import { connect, connectDefi,connectW } from "../../redux/blockchain/blockchainActions";
import Script from "next/script";
import { io } from "socket.io-client";



const Homepage = () => {
  let startButton;
  let infoDisplay;
  let input;
  if (typeof window !== "undefined") {
    // Client-side-only code
     startButton = window.document.querySelector('#start')
      infoDisplay = document.querySelector('#info')
     input = document.getElementById('input');
  }
 
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  let Playerdata;
   let bbonline = true
  let PlayNum = 0
  let ready = 0
  let enemyReady = 0
  let currentPlayer = 'user'
  
  // const infoDisplay = window.document.querySelector('#info')
   
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
   
  });

  

  const getData = () => {
   
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      
    }
    
    
  };
  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
    
  },  [blockchain.account]);
  const getDatanfts = async () =>{
 
    // axios.get(`http://localhost:5555/bushi/12`).then(res => console.log(res,'PATOU'))
    // for(let i = 0 ; (i < data.bushis.length) || ( i < 5) ;i++){
    //   console.log('^ppppppp')
    //   console.log(data.bushis,'pppZZZZZZ')
    //   let pat 
    //   //await fetch(`http://localhost:5555/bushi/${data.bushis[i].name.slice(18,23)}`).then((res) =>pat =res.json())     
    // }
   
    window.playerState.pizzas = {}
     window.playerState.lineup = []
    for(let i = 0;i < data.bushis.length;i++){
      let tt = data.bushis[i].attr.slice(18,23)
      let type = data.bushis[i].type.name
    
      let pp = {
        name: data.bushis[i].name,
        description: data.bushis[i].desc,
        type: type,
        src:data.bushis[i].src ,
        icon: `/images/icons/${type}.png`,
        actions: [ data.bushis[i].nftskill.basic.name, data.bushis[i].nftskill.typeskill.name , data.bushis[i].nftskill.special.name ],
      }
     
      window.Pizzas[tt] = pp
      window.playerState.addPizza(tt)
     
    }
  }

  let i = 0
  
  const OnlineGame = async  ()=>{
    const socket = io('http://127.0.0.1:3333')
    let room = input.value
    
    let wallet = blockchain.account
    socket.emit('join',room,wallet);
    let data = window.playerState 
    let nfts = window.Pizzas

    console.log(wallet)
    socket.emit('player-data', data,nfts,room,wallet)
   
    socket.on('player-number',(num,datas )=> {
      
      localStorage.setItem('PlayerNumber',num);
     
      if (num == -1){
        infoDisplay.innerHTML = "Sorry, the server is full"
      }else {
        PlayNum = parseInt(num)
      }
      if(PlayNum == 1) currentPlayer ="enemy"
      socket.emit('check-players',room)
      
    })
    socket.on('data',(data,nft)=>{
    
      Playerdata = data
      localStorage.setItem('PlayerData', JSON.stringify(data));
      localStorage.setItem('nfts', JSON.stringify(nft));
    })
    start.addEventListener('click',() =>{
      
     socket.emit('player-ready',room)
     playerReady(PlayNum)
    
     if(!ready){
      socket.emit('player-ready',room)
      ready = true
    }
    if(ready && enemyReady ) playGameMulti(socket, Playerdata,room)
    })
    socket.on('player-connection',(num,datas) => {
    
      playerConnectedOrDisconnected(num)
    })

    socket.on('enemy-ready', num => {
      enemyReady = true
      playerReady(num)
      if (ready) {
        playGameMulti(socket,Playerdata,room)
        playerReady(num)
      }
    })

    socket.on('check-players',players =>{
      players.forEach((p,i)=>{ 
        if(p.connected) playerConnectedOrDisconnected(i)
        if(p.ready){
          playerReady(i)
          if(i != PlayNum) enemyReady = true
        }
      })
    })

    function playerReady(num){
      let player = `.p${parseInt(num) +1}`
      document.querySelector(`${player} .ready span`).classList.toggle('green')
    }

    function playerConnectedOrDisconnected(num) {
      console.log(num)
      if(num >= 0 && num <= 1){
        let player = `.p${parseInt(num) +1}`
        document.querySelector(`${player} .connected span`).classList.toggle('green')
        if(parseInt(num) == PlayNum) document.querySelector(player).style.fontWeight = 'bold'
      }
     
    }

  }
  const OnGame = async  ()=>{
    const socket = io('http://127.0.0.1:3333')
    let room = "ASS"
    let wallet = blockchain.account
    socket.emit('join',room,wallet);
    let data = window.playerState 
    let nfts = window.Pizzas
  
    
   
    socket.emit('player-data', data,nfts,room,wallet)
    socket.on('player-number',(num,datas, )=> {
    
      localStorage.setItem('PlayerNumber',num);
    
      if (num == -1){
        infoDisplay.innerHTML = "Sorry, the server is full"
      }else {
        PlayNum = parseInt(num)
      }
      if(PlayNum == 1) currentPlayer ="enemy"
      socket.emit('check-players',room)
     
    })

    socket.on('data',(data,nft)=>{
     
      Playerdata = data
      localStorage.setItem('PlayerData', JSON.stringify(data));
      localStorage.setItem('nfts', JSON.stringify(nft));
    })

    start.addEventListener('click',() =>{
      
     socket.emit('player-ready',room)
     playerReady(PlayNum)
   
     if(!ready){
      socket.emit('player-ready',room)
      ready = true
    }
    if(ready && enemyReady ) playGameMulti(socket, Playerdata,room)
    })
  
    socket.on('player-connection',(num,datas) => {
    
     
      console.log(`Player number ${num} has connected or desconnected`)
      playerConnectedOrDisconnected(num)
    })

    socket.on('enemy-ready', num => {
      enemyReady = true
      playerReady(num)
      if (ready) {
        playGameMulti(socket,Playerdata,room)
        playerReady(num)
      }
    })

    socket.on('check-players',players =>{
      players.forEach((p,i)=>{
        if(p.connected) playerConnectedOrDisconnected(i)
        if(p.ready){
          playerReady(i)
          if(i != PlayNum) enemyReady = true
        }
      })
    })
    function playerReady(num){
      
      let player = `.p${parseInt(num) +1}`
      document.querySelector(`${player} .ready span`).classList.toggle('green')
    }

    function playerConnectedOrDisconnected(num) {
     
      let player = `.p${parseInt(num) +1}`
      document.querySelector(`${player} .connected span`).classList.toggle('green')
      if(parseInt(num) == PlayNum) document.querySelector(player).style.fontWeight = 'bold'
    }

  }
  

  const playGameMulti = async (socket,Playerdata,room) =>{
    let resu;
    if(!ready){
      socket.emit('player-ready',room)
      ready = true
      playerReady(PlayNum)
    }
  
   
      const batOnline = new BatOnline({
        PlayNum:PlayNum,
        PData:Playerdata,
       socket:socket,
       room:room,
       onComplete: (didWin) => {
        resu = (didWin ? "WON_BATTLE" : "LOST_BATTLE");
      }
      })
       
        let a = document.querySelector(".Battle")
        if(!a){
          batOnline.init(document.querySelector(".game-container"));
        }
    
   
  }

  let menu
  
  if(bbonline == true){
    menu = <>
      <div  id="info"></div>
      <input id="input"  />
   <button onClick={()=>{  
     OnlineGame()

   }} > Matchmaking</button>
   <button onClick={()=>{  
     OnGame()

   }} > Matchmaking2</button>
   <button id="start" > BatOnline</button>
   <div className="player p1"> player 1
     <div className="connected">Connected  <span></span>
       
     </div>
     <div className="ready">Ready <span></span></div>
   </div>
   <div className="player p2"> player 2
     <div className="connected">Connected <span></span>
       <div className="ready">Ready <span></span></div>
     </div>
     <div className="ready"></div>
   </div> 
    </>
  }
  if(bbonline = false) {
    menu = ""
  }

  function displayOnlineGame() {
    const x = document.getElementById("container-online-game");
    if (document.getElementById("container-online-game") && x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  
 
  
 
  return (
    <div className="main-content" id="main-content-content">



 
   

 {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  
                  <div id="connect-network" className="text-center mt-40 container-button-connect-bushi">
                      
                  <a onClick={async (e)  =>  {
                        e.preventDefault();
                        dispatch(connect());
                        
                        getData();
                        
                      }}   className="mt-50 buttonBushi">Metamask</a>
                  <a  onClick={async (e)  =>  {
                        e.preventDefault();
                       
                        
                       dispatch(connectDefi())
                       
                        getData();
                       
                      }} className="buttonBushi">Defi wallet</a>
                  <a   onClick={async (e)  =>  {
                        e.preventDefault();
                        
                        dispatch(connectW())
                        
                        getData();
                      }} className="buttonBushi">Wallet Connect</a>
              
                    <div
                     className="text-center"
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </div>
                    
                  
                    {blockchain.errorMsg !== "" ? (
                      <>
                        
                        <div
                         className="text-center text-danger"
                        >
                          {blockchain.errorMsg} 
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : ( 
                 
                  <div className="main-content">
                  <div className="container-buttons-online">
                    <div className="container-button-online-load">
                      <div className="container-load-nft">
                        <button onClick={() => getDatanfts()}> Load NFTS</button>
                      </div>
                      <div className="container-button-online-game">
                        <button onClick={displayOnlineGame} className="text-center">
                          Online Game
                        </button>
                      </div>
                    </div>
                    <div className="container-online-game" id="container-online-game">
                      <div className="online-game-container">
                        <div className="player p1">
                          {" "}
                          player 1
                          <div className="connected">
                            Connected <span></span>
                          </div>
                          <div className="ready">
                            Ready <span></span>
                          </div>
                        </div>
                        <div
                          className=" justify-content-center"
                          id="input-game-session"
                        >
                          <div id="info"></div>
        
                          <input
                            placeholder="enter room name.."
                            className="mr-10"
                            id="input"
                          />
        
                          <button
                            id="join"
                            className="mr-2 ml-2"
                            onClick={() => {
                              OnlineGame();
                            }}
                          >
                            {" "}
                            Join or Create
                          </button>
                          {/* <button onClick={()=>{  
             OnGame()
        
           }} > Matchmaking2</button> */}
        
                          <button id="start"> Ready</button>
                        </div>
                        <div className="row  justify-content-center">
                          <div className="player p2">
                            {" "}
                            player 2
                            <div className="connected">
                              Connected <span></span>
                              <div className="ready">
                                Ready <span></span>
                              </div>
                            </div>
                            <div className="ready"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    
    <div className="game-container">
    <canvas className="game-canvas" width="352" height="198"></canvas>
  
  

    <Script src="game/init.js"></Script>
    </div>
     
      </div>
                 )} 
    
    <Script src="game/Content/pizzas.js"></Script>
    <Script src="game/Content/actions.js"></Script>
    <Script src="game/Content/enemies.js"></Script>
    
    <Script src="game/State/PlayerState.js"></Script>
   
    <Script src="game/utils.js"></Script>
    <Script src="game/DirectionInput.js"></Script>
    <Script src="game/Overworld.js"></Script>
    <Script src="game/GameObject.js"></Script>
    <Script src="game/Person.js"></Script>
    <Script src="game/PizzaStone.js"></Script>
    <Script src="game/Sprite.js"></Script>
    <Script src="game/OverworldMap.js"></Script>
    <Script src="game/OverworldEvent.js"></Script>
    <Script src="game/TextMessage.js"></Script>
    <Script src="game/KeyPressListener.js"></Script>
    <Script src="game/RevealingText.js"></Script>
    <Script src="game/SceneTransition.js"></Script>
    <Script src="game/KeyboardMenu.js"></Script>
    <Script src="game/Hud.js"></Script>
    <Script src="game/PauseMenu.js"></Script>
    <Script src="game/CraftingMenu.js"></Script>
    <Script src="game/Progress.js"></Script>
    <Script src="game/TitleScreen.js"></Script>

    <Script src="game/Battle/Battle.js"></Script>
    <Script src="game/Battle/Combatant.js"></Script>
    <Script src="game/Battle/Team.js"></Script>
    <Script src="game/Battle/SubmissionMenu.js"></Script>
    <Script src="game/Battle/ReplacementMenu.js"></Script>
    <Script src="game/Battle/BattleEvent.js"></Script>
    <Script src="game/Battle/TurnCycle.js"></Script>
    <Script src="game/Battle/BattleAnimations.js"></Script>

    <Script src="game/BattleOnline/BattleOnline.js"></Script>
    <Script src="game/BattleOnline/BattleEventOnline.js"></Script>
    <Script src="game/BattleOnline/SubmissionMenuOnline.js"></Script>
    <Script src="game/BattleOnline/TurnCycleOnline.js"></Script>

    <Script src="game/Bat/Bat.js"></Script>
    <Script src="game/Bat/Combats.js"></Script>
    <Script src="game/Bat/turnOnline.js"></Script>
    <Script src="game/Bat/EventOnline.js"></Script>
    <Script src="game/Bat/OnlineMenu.js"></Script>
    <Script src="game/Bat/replaceOnline.js"></Script>
    </div>
  );
};

export default Homepage;
