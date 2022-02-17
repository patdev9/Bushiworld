// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      // let cost = await store
      //   .getState()
      //   .blockchain.smartContract.methods.cost()
      //   .call();
      let accont = await store.getState().blockchain.account
      let nfts = await store.getState().blockchain.smartContract.methods.walletOfOwner(accont).call()
    
      let jsondata = [];
      for(let i = 0; i < nfts.length; i++) {
        
  
        let tokenMetadataURI = await store.getState().blockchain.smartContract.methods.tokenURI(nfts[i]).call()
        
        if (tokenMetadataURI.startsWith("ipfs://")) {
          tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
        }
        jsondata.push(tokenMetadataURI);
      }
    
     let imgs= []
     for(let i = 0;i< jsondata.length;i++){
      const tokenMetadata = await fetch(jsondata[i]).then((response) => response.json())
      if (tokenMetadata.image.startsWith("ipfs://")) {
          tokenMetadata.image = `https://ipfs.io/ipfs/${tokenMetadata.image.split("ipfs://")[1]}`
        }
      imgs.push(tokenMetadata);
     }
     
      dispatch(
        fetchDataSuccess({
          totalSupply,
          imgs
          // cost,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};