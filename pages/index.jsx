import Head from 'next/head'
import Image from 'next/image'
import Script from "next/script";
import Homepage from './homepage/homepage'

import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/data/dataActions";

const Home =() => {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  return (
 
  <>
   <Homepage />
  </>
  )
}
export default Home
