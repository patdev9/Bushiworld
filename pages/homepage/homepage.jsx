import React , { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/data/dataActions";
import { connect, connectDefi,connectW } from "../../redux/blockchain/blockchainActions";
import Script from "next/script";

const Homepage = () => {
  
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

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

  

 
  return (
    <>

{/* {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  
                  <div className="text-center">
                       <div className="dropdown-menu">
                  <a onClick={async (e)  =>  {
                        e.preventDefault();
                        dispatch(connect());
                        
                     
                        getData();
                      }}   className="dropdown-item">Metamask</a>
                  <a  onClick={async (e)  =>  {
                        e.preventDefault();
                       
                        
                       dispatch(connectDefi())
                       
                        getData();
                      }} className="dropdown-item">Defi wallet</a>
                  <a   onClick={async (e)  =>  {
                        e.preventDefault();
                        
                        dispatch(connectW())
                        
                        getData();
                      }} className="dropdown-item">wallet-connect</a>
              </div>
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
                ) : ( */}
                 
                  <div  className="main-content">
    <div className="game-container">
    <canvas className="game-canvas" width="352" height="198"></canvas>
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

    <Script src="game/init.js"></Script>
    </div>
     
      </div>
                {/* )} */}
    
    
    </>
  );
};

export default Homepage;
