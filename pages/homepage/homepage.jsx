/* eslint-disable react-hooks/exhaustive-deps */
import React , { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/data/dataActions";
import { connect, connectDefi,connectW } from "../../redux/blockchain/blockchainActions";
import Script from "next/script";
import { io } from "socket.io-client";
import { render } from "react-dom";
import { compose } from "redux";



const Homepage = () => {
  let startButton;
  let start
  let startNormal
  let infoDisplay;
  let input;
  let inputNormal;
  let [Roomlist, setRoomList] = useState(undefined);
  let [RoomlistNormal, setRoomListNormal] = useState(undefined);
  let [lastId,setlastId] = useState(undefined)
  const [feedback, setFeedback] = useState(undefined);
  const [Idbet, setIdbet] = useState(undefined);
  if (typeof window !== "undefined") {
    // Client-side-only code
     start = window.document.querySelector('#start')
     startNormal = window.document.querySelector('#startNormal')
      infoDisplay = document.querySelector('#info')
     // Roomlist = document.querySelector('#RoomL')
     input = document.getElementById('input');
     inputNormal = document.getElementById('inputNormal');
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
  
  
  let getRoom = async ()=>{
    console.log("lkk")
    let p
    await fetch('http://127.0.0.1:3333/getrooms').then((res) => {return res.json()}).then(res=>p = res)
    
    setlastId(await p[p.length -1].id)
   
   
      //   <div className="container-room">
      //     <div className="name-room">Rooms name</div>
      //     <div className="bet-room">Bet : 501,05</div>
      //   </div>
      //   <div className="container-bet">
      //     <div>1/2</div>
      //   </div>
      //   <div className="container-player">
      //     <div>Join</div>
      //   </div>
      // </div>
    setRoomList(await p.map((item)=>{
      return (
      <>
      
          <div className="parent">
        <div className="container-room">
          <div className="name-room">{item.room}</div>
          <div className="bet-room">Bet : {item.betPlayerA}</div>
        </div>
        <div className="container-bet">
          <div>{item.player} /2</div>
        </div>
        <div className="container-player">
          <button onClick={async()=> {
            let id = item.id
            
            let cost = CONFIG.WEI_COST;
            let gasLimit = CONFIG.GAS_LIMIT;
            let totalCostWei = String(cost);
            let totalGasLimit = String(gasLimit);
             await blockchain.smartContract.methods.takebet(id).send({
              to: CONFIG.CONTRACT_ADDRESS,
              from: blockchain.account,
              value: totalCostWei,
              gasLimit: totalGasLimit,
             })
             let bushis = await blockchain.smartContract.methods.BushiBets(id).call()
             if(bushis.playerA != '0x0000000000000000000000000000000000000000' && bushis.playerB != '0x0000000000000000000000000000000000000000') {
              OnGame(item.room,item.id)
             }
           
          }}>Join</button>
        </div>
        </div>
        
        </>
      )
    }));
    
  }
  let getRoomNormal = async ()=>{
    console.log("lkk")
    let p
    await fetch('http://127.0.0.1:3333/getroomsNormal').then((res) => {return res.json()}).then(res=>p = res)
   
    setlastId(await p[p.length -1].id)
   
    
   
      //   <div className="container-room">
      //     <div className="name-room">Rooms name</div>
      //     <div className="bet-room">Bet : 501,05</div>
      //   </div>
      //   <div className="container-bet">
      //     <div>1/2</div>
      //   </div>
      //   <div className="container-player">
      //     <div>Join</div>
      //   </div>
      // </div>
      setRoomListNormal(await p.map((item)=>{
      return (
      <>
      
          <div className="parent">
        <div className="container-room">
          <div className="name-room">{item.room}</div>
          <div className="bet-room">Bet : {item.betPlayerA}</div>
        </div>
        <div className="container-bet">
          <div>{item.player} /2</div>
        </div>
        <div className="container-player">
          <button onClick={async()=> {
            let id = item.id
            
            // let cost = CONFIG.WEI_COST;
            // let gasLimit = CONFIG.GAS_LIMIT;
            // let totalCostWei = String(cost);
            // let totalGasLimit = String(gasLimit);
            //  await blockchain.smartContract.methods.takebet(id).send({
            //   to: CONFIG.CONTRACT_ADDRESS,
            //   from: blockchain.account,
            //   value: totalCostWei,
            //   gasLimit: totalGasLimit,
            //  })
            //  let bushis = await blockchain.smartContract.methods.BushiBets(id).call()
            //  if(bushis.playerA != '0x0000000000000000000000000000000000000000' && bushis.playerB != '0x0000000000000000000000000000000000000000') {
            //   OnGame(item.room,item.id)
            //  }
            OnGameNormal(item.room,item.id)
          }}>Join</button>
        </div>
        </div>
        
        </>
      )
    }));
    
  }




  let getRoomLastid = async ()=>{
    console.log("lkk")
    let p
    await fetch('http://127.0.0.1:3333/lastroom').then((res) => {return res.json()}).then(res=>p = res)
  
    return p[0].id
  }

  let getRoomLastidNormal = async ()=>{
    console.log("lkk")
    let p
    await fetch('http://127.0.0.1:3333/lastroomNormal').then((res) => {return res.json()}).then(res=>p = res)
   
    return p[0].id
  }

  useEffect(async () => {
   
    getConfig();
  }, []);

  useEffect(async () => {
    console.log("7")
  }, [Roomlist]);

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
    var myHeaders = new Headers();
myHeaders.append('Accept', '*/*');
myHeaders.append('Authorization', 'Basic cHJlc3RhdGFpcmVAYm5ic2l0dGVyLmNvbToxMjM0NTY=');
    let bushis;
    
    await fetch(`http://127.0.0.1:3333/bushi/${blockchain.account}`
  ).then((res) => {return res.json()}).then(res=>bushis = res)
   
    
    window.playerState.pizzas = {}
     window.playerState.lineup = []
    for(let i = 0;i < bushis.length;i++){
      let tt = bushis[i].attr.slice(18,23)
      let type = bushis[i].type.name
      let pp = {
        name: bushis[i].name,
        description: bushis[i].desc,
        type: type,
        src:bushis[i].src ,
        icon: `/images/icons/${type}.png`,
        actions: [ bushis[i].nftskill.basic.name, bushis[i].nftskill.typeskill.name , bushis[i].nftskill.special.name ],
      }
      window.Pizzas[tt] = pp
      window.playerState.addPizza(tt)
    }
  }

  let i = 0
  
  const OnlineGame = async  (idgame)=>{
    const socket = io('http://127.0.0.1:3333/bet')
    let room = input.value
    
    let wallet = blockchain.account
    socket.emit('join',room,wallet);
    let data = window.playerState 
    let nfts = window.Pizzas
    data['wallet'] = wallet
    data['idgame'] = idgame
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
    if(ready && enemyReady ) playGameMulti(socket, Playerdata,room,wallet)
    console.log('11111111')
    })


    socket.on('player-connection',(num,datas) => {
      playerConnectedOrDisconnected(num)
    })

    socket.on('enemy-ready', num => {
      enemyReady = true
      playerReady(num)
      if (ready) {
        playGameMulti(socket,Playerdata,room,wallet)
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
 

 


  const OnGame = async  (room,idgame)=>{
    const socket = io('http://127.0.0.1:3333/bet')
    let wallet = blockchain.account
    socket.emit('join',room,wallet);
    let data = window.playerState 
    let nfts = window.Pizzas
    data['wallet'] = wallet
    data['idgame'] = idgame
    socket.emit('player-data', data,nfts,room,wallet)
    socket.on('player-number',(num,datas, )=> {
    
      localStorage.setItem('PlayerNumber',num);
      console.log(num,'PPAPAPAPAPAP')
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
    socket.on('check-players',players =>{
      players.forEach((p,i)=>{
        if(p.connected) playerConnectedOrDisconnected(i)
        if(p.ready){
          playerReady(i)
          if(i != PlayNum) enemyReady = true
        }
      })
    })

    start.addEventListener('click',() =>{
      socket.emit('player-ready',room)
      playerReady(PlayNum)
      if(!ready){
       socket.emit('player-ready',room)
       ready = true
     }
     if(ready && enemyReady ) playGameMulti(socket, Playerdata,room,wallet)
     console.log('2222222222')
     })
   
   
    socket.on('player-connection',(num,datas) => {
      console.log(`Player number ${num} has connected or desconnected`)
      playerConnectedOrDisconnected(num)
    })

    socket.on('enemy-ready', num => {
      enemyReady = true
      playerReady(num)
      if (ready) {
        playGameMulti(socket,Playerdata,room,wallet)
        playerReady(num)
      }
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
  

  const playGameMulti = async (socket,Playerdata,room,wallet) =>{
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
       wallet:wallet,
       onComplete: async (didWin) => {
        resu = (didWin ? "WON_BATTLE" : "LOST_BATTLE");
        if(didWin[0] == blockchain.account){
        
          let winner = didWin[0]
          let id = didWin[1]
          let cost = CONFIG.WEI_COST;
          let gasLimit = CONFIG.GAS_LIMIT;
          let totalCostWei = String(cost);
          let totalGasLimit = String(gasLimit);
           await blockchain.smartContract.methods.withdrowBet(id,winner).send({
            to: CONFIG.CONTRACT_ADDRESS,
            from: blockchain.account,
            gasLimit: totalGasLimit,
           })
        }

        
       
      }
      })
 
       
        let a = document.querySelector(".Battle")
        if(!a){
          batOnline.init(document.querySelector(".game-container"));
        }
  }



  const playGameMultiNormal = async (socket,Playerdata,room,wallet) =>{
    let resu;
    if(!ready){
      socket.emit('player-readyN',room)
      ready = true
      playerReady(PlayNum)
    }
      const batOnline = new BatOnline({
        PlayNum:PlayNum,
        PData:Playerdata,
       socket:socket,
       room:room,
       wallet:wallet,
       onComplete: async (didWin) => {
        resu = (didWin ? "WON_BATTLE" : "LOST_BATTLE");
        if(didWin[0] == blockchain.account){
          
          // let winner = didWin[0]
          // let id = didWin[1]
          // let cost = CONFIG.WEI_COST;
          // let gasLimit = CONFIG.GAS_LIMIT;
          // let totalCostWei = String(cost);
          // let totalGasLimit = String(gasLimit);
          //  await blockchain.smartContract.methods.withdrowBet(id,winner).send({
          //   to: CONFIG.CONTRACT_ADDRESS,
          //   from: blockchain.account,
          //   gasLimit: totalGasLimit,
          //  })
        }

        
        
      }
      })
     
       
        let a = document.querySelector(".Battle")
        if(!a){
          batOnline.init(document.querySelector(".game-container"));
        }
  }


  // function displayOnlineGame() {
  //   const x = document.getElementById("container-online-game");
  //   if (document.getElementById("container-online-game") && x.style.display === "block") {
  //     x.style.display = "none";
  //   } else {
  //     x.style.display = "block";
  //   }
  // }

  const OnlineGameNormal = async  (idgame)=>{
    const socket = io('http://127.0.0.1:3333/normal')
   
    let room = inputNormal.value
    
    let wallet = blockchain.account
    socket.emit('joinN',room,wallet);
    let data = window.playerState 
    let nfts = window.Pizzas
    data['wallet'] = wallet
    data['idgame'] = idgame
    console.log(wallet)
    socket.emit('player-dataN', data,nfts,room,wallet)
   
    socket.on('player-numberN',(num,datas )=> {
      console.log(num,'PPAPAPAPAPAP')
      localStorage.setItem('PlayerNumber',num);
      
      if (num == -1){
        infoDisplay.innerHTML = "Sorry, the server is full"
      }else {
        PlayNum = parseInt(num)
      }
      if(PlayNum == 1) currentPlayer ="enemy"
      socket.emit('check-playersN',room)
    })
    socket.on('dataN',(data,nft)=>{
      Playerdata = data
      localStorage.setItem('PlayerData', JSON.stringify(data));
      localStorage.setItem('nfts', JSON.stringify(nft));
    })
    socket.on('check-playersN',players =>{
      players.forEach((p,i)=>{ 
        if(p.connected) playerConnectedOrDisconnected(i)
        if(p.ready){
          playerReady(i)
          if(i != PlayNum) enemyReady = true
        }
      })
    })
    startNormal.addEventListener('click',() =>{
     socket.emit('player-readyN',room)
     playerReady(PlayNum)
     if(!ready){
      socket.emit('player-readyN',room)
      ready = true
    }
    if(ready && enemyReady ) playGameMultiNormal(socket, Playerdata,room,wallet)
    console.log('11111111')
    })


    socket.on('player-connectionN',(num,datas) => {
      playerConnectedOrDisconnected(num)
    })

    socket.on('enemy-readyN', num => {
      enemyReady = true
      playerReady(num)
      if (ready) {
        playGameMultiNormal(socket,Playerdata,room,wallet)
        playerReady(num)
      }
    })

   

    function playerReady(num){
      let player = `.pN${parseInt(num) +1}`
      document.querySelector(`${player} .ready span`).classList.toggle('green')
    }

    function playerConnectedOrDisconnected(num) {
      console.log(num)
      if(num >= 0 && num <= 1){
        let player = `.pN${parseInt(num) +1}`
        document.querySelector(`${player} .connected span`).classList.toggle('green')
        if(parseInt(num) == PlayNum) document.querySelector(player).style.fontWeight = 'bold'
      }
    }
    
  }
 

 


  const OnGameNormal = async  (room,idgame)=>{
    const socket = io('http://127.0.0.1:3333/normal')
    let wallet = blockchain.account
    socket.emit('joinN',room,wallet);
    let data = window.playerState 
    let nfts = window.Pizzas
    data['wallet'] = wallet
    data['idgame'] = idgame
    socket.emit('player-dataN', data,nfts,room,wallet)
    socket.on('player-numberN',(num,datas, )=> {
     
      localStorage.setItem('PlayerNumber',num);
      console.log(num,'PPAPAPAPAPAP')
      if (num == -1){
        infoDisplay.innerHTML = "Sorry, the server is full"
      }else {
        PlayNum = parseInt(num)
      }
      if(PlayNum == 1) currentPlayer ="enemy"
      socket.emit('check-playersN',room)
    })

    socket.on('dataN',(data,nft)=>{
      Playerdata = data
      localStorage.setItem('PlayerData', JSON.stringify(data));
      localStorage.setItem('nfts', JSON.stringify(nft));
    })
    

    startNormal.addEventListener('click',() =>{
      socket.emit('player-readyN',room)
      playerReady(PlayNum)
      if(!ready){
       socket.emit('player-readyN',room)
       ready = true
     }
     if(ready && enemyReady ) playGameMultiNormal(socket, Playerdata,room,wallet)
     console.log('2222222222')
     })
   
   
    socket.on('player-connectionN',(num,datas) => {
      console.log(`Player number ${num} has connected or desconnected`)
      playerConnectedOrDisconnected(num)
    })

    socket.on('enemy-readyN', num => {
      enemyReady = true
      playerReady(num)
      if (ready) {
        playGameMultiNormal(socket,Playerdata,room,wallet)
        playerReady(num)
      }
    })

    socket.on('check-playersN',players =>{
      players.forEach((p,i)=>{
        if(p.connected) playerConnectedOrDisconnected(i)
        if(p.ready){
          playerReady(i)
          if(i != PlayNum) enemyReady = true
        }
      })
    })

    function playerReady(num){
      let player = `.pN${parseInt(num) +1}`
      document.querySelector(`${player} .ready span`).classList.toggle('green')
    }

    function playerConnectedOrDisconnected(num) {
      let player = `.pN${parseInt(num) +1}`
      document.querySelector(`${player} .connected span`).classList.toggle('green')
      if(parseInt(num) == PlayNum) document.querySelector(player).style.fontWeight = 'bold'
    }
   
  }

  function displayOnlineGame() {
    const x = document.getElementById("container-rooms");
    const z = document.getElementById("main-content-content")
    if (document.getElementById("container-rooms")) {
      x.style.display = "block";
      z.style.overflow = "hidden";
    }
  }
  function cancelOnlineGame() {
    const x = document.getElementById("container-rooms");
    if (document.getElementById("container-rooms")) {
      x.style.display = "none";
    }
  }
  function displayOnlineGameNormal() {
    const x = document.getElementById("container-rooms-normal");
    const z = document.getElementById("main-content-content")
    if (document.getElementById("container-rooms")) {
      x.style.display = "block";
      z.style.overflow = "hidden";
    }
  }
  function cancelOnlineGameNormal() {
    const x = document.getElementById("container-rooms-normal");
    if (document.getElementById("container-rooms-normal")) {
      x.style.display = "none";
    }
  }

 let rooms = [
    {
      id:1,
      name:"kev",
      bet:2,
      player:1
    },
    {
      id:2,
      name:"kev",
      bet:2,
      player:1
    },
    {
      id:3,
      name:"kev",
      bet:2,
    },
  ]

  // Roomlist= rooms.map(function(item){
  //   return(
  //     <div key={item.id} className="parent">
  //     <div className="container-room">
  //       <div className="name-room">{item.name}</div>
  //       <div className="bet-room">Bet : {item.bet}</div>
  //     </div>
  //     <div className="container-bet">
  //       <div>{item.player} /2</div>
  //     </div>
  //     <div className="container-player">
  //       <button onClick={()=> OnGame(item.name)}>Join</button>
  //     </div>
  //   </div>
  //   )
  // })

  

  //let p = new EventSource('http://127.0.0.1:3333/rooms')
//   p.addEventListener("change", function (event) { 
//     console.log(event.data); 
//     //traitement à effectuer 
// }, false);


 
  
 
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
        <div className="container-rooms" id="container-rooms">
        <div className="rooms-title">ROOMS</div>
        <div className="container-rooms-join-create">
        <button onClick={() => getRoom()}> Refrech</button>
        <input  id="input" className="search-bar-rooms"></input>
        <button  onClick={async()=> {
          getRoom()
         let p = await getRoomLastid()
         let id = p +1
         
          setIdbet(()=>{Idbet = id})
          
          let cost = CONFIG.WEI_COST;
          let gasLimit = CONFIG.GAS_LIMIT;
          let totalCostWei = String(cost);
          let totalGasLimit = String(gasLimit);
         await blockchain.smartContract.methods.createBet(id).send({
          to: CONFIG.CONTRACT_ADDRESS,
          from: blockchain.account,
          value: totalCostWei,
          gasLimit: totalGasLimit,
         }) .once("error", (err) => {
          console.log(err);
          setFeedback("Sorry, something went wrong please try again later.");
        })
        .then((receipt) => {
          OnlineGame(id);
        });
       
         
        }} className="join-room-rooms">Create game</button>
       
        {/* <button onClick={async()=>{

        }}> CANCEL BET</button> */}
        <button id="start"> Ready</button>
        </div>
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
        <div  className="big-container-room">
                      <div> {Roomlist} </div>
        </div>
           <div className="container-cancel-button-bushi">
           <button id="cancel-button-bushi" onClick={cancelOnlineGame}>Cancel</button>
             </div>
      </div>


      <div className="container-rooms" id="container-rooms-normal">
        <div className="rooms-title">ROOMS</div>
        <div className="container-rooms-join-create">
        <button onClick={() => getRoomNormal()}> Refrech</button>
        <input  id="inputNormal" className="search-bar-rooms"></input>
        <button  onClick={async()=> {
          getRoomNormal()
         let p = await getRoomLastidNormal()
         let id = p +1
        
          
        //   let cost = CONFIG.WEI_COST;
        //   let gasLimit = CONFIG.GAS_LIMIT;
        //   let totalCostWei = String(cost);
        //   let totalGasLimit = String(gasLimit);
        //  await blockchain.smartContract.methods.createBet(id).send({
        //   to: CONFIG.CONTRACT_ADDRESS,
        //   from: blockchain.account,
        //   value: totalCostWei,
        //   gasLimit: totalGasLimit,
        //  }) .once("error", (err) => {
        //   console.log(err);
        //   setFeedback("Sorry, something went wrong please try again later.");
        // })
        // .then((receipt) => {
        //   OnlineGame(id);
        // });
        OnlineGameNormal(id);
        
 
        }} className="join-room-rooms">Create game</button>
        <button id="startNormal"> Ready</button>
        </div>
        <div className="online-game-container">
                        <div className="player pN1">
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
                       
                        </div>
                        <div className="row  justify-content-center">
                          <div className="player pN2">
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
        <div  className="big-container-room">
       
                      <div> {RoomlistNormal} </div>
        </div>
           <div className="container-cancel-button-bushi">
           <button id="cancel-button-bushi" onClick={cancelOnlineGameNormal}>Cancel</button>
             </div>
      </div>

                  <div className="container-buttons-online">
                    <div className="container-button-online-load">
                      <div className="container-load-nft">
                        <button onClick={() => getDatanfts()}> Load NFTS</button>
                       
                        
                      </div>
                      <div className="container-button-online-game">
                        <button onClick={displayOnlineGame} className="text-center">
                          betting
                        </button>
                        <button onClick={displayOnlineGameNormal} className="text-center">
                          Normal
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
        
                          {/* <button id="start"> Ready</button> */}
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
