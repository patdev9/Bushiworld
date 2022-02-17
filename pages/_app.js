/* eslint-disable @next/next/no-sync-scripts */
import React from "react";
import store from "../redux/store";
import { Provider } from "react-redux";

import Script from "next/script";
import Head from "next/head";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
      
      <Component {...pageProps} />
      </Provider>
 
    </>
 
    )
  
}

export default MyApp
