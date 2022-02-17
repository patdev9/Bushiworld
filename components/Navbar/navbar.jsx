/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { connect, connectDefi,connectW } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";
const Navbar = ({ lr, nr, theme }) => {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
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

  const handleDropdown = (e) => {
    getSiblings(e.target.parentElement)
      .filter((item) => item.classList.contains("show"))
      .map((item) => {
        item.classList.remove("show");
        if (item.childNodes[0]) {
          item.childNodes[0].setAttribute("aria-expanded", false);
        }
        if (item.childNodes[1]) {
          item.childNodes[1].classList.remove("show");
        }
      });
    e.target.parentElement.classList.toggle("show");
    e.target.setAttribute("aria-expanded", true);
    e.target.parentElement.childNodes[1].classList.toggle("show");
  };

  const handleMobileDropdown = (e) => {
    document
      .getElementById("navbarSupportedContent")
      .classList.toggle("show-with-trans");
  };

  
  const deco = async ()=>{
    localStorage.clear();
    blockchain.account = "";
    blockchain.smartContract === null;
  }



  return (
    <nav
      ref={nr}
      className={`navbar navbar-expand-lg change ${
        theme === "themeL" ? "light" : ""
      }`}
    >
      <div className="container">
      <div>
          <ul className="navbar-nav ml-auto">
          {blockchain.account === "" ||
                blockchain.smartContract === null ? (
            <li className="nav-item dropdown" onClick={handleDropdown}>
              <span
                className="nav-link dropdown-toggle butn bord curve"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Connect
              </span>
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
            </li>) : (
              <li className="nav-item " onClick={deco} > 
              <span
               className="nav-link  butn bord curve"
               data-toggle="dropdown"
               role="button"
               aria-haspopup="true"
               aria-expanded="false"
            >
               {blockchain.account.slice(0,5)}
            </span>
            <div className="dropdown-menu">
              <a className="dropdown-item" >D</a>
            </div>
            </li>
              
            )}
          </ul>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleMobileDropdown}
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="icon-bar">
            <i className="fas fa-bars"></i>
          </span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">

          <li className="nav-item">
              <Link href="/">
                <a className="nav-link">Home</a>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link href="#sectionAbout">
                <a className="nav-link">About</a>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link href="#Roadmap">
                <a className="nav-link">RoadMap</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#team">
                <a className="nav-link">Team</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/homepage/MyWarrior">
                <a className="nav-link">My warrior</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/homepage/P2e">
                <a className="nav-link">P2E</a>
              </Link>
            </li>
           
          </ul>
        </div>
      
      </div>
    </nav>
  );
};

export default Navbar;
