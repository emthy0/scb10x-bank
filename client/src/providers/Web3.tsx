import React, { FC, useEffect } from "react"
import { createContext, useContext, Context } from "react"
import { initialWindowSafeAreaInsets } from "react-native-safe-area-context";
import Web3 from 'web3'

interface Web3ContextInterface {
  address: string;
}

const Web3ContextInit: any = {
  web3Instance: "",
  address: ""
}

export const Web3Context = createContext(Web3ContextInit)

export const Web3Provider: FC = ({ children }) => {
  const web3 = new Web3(window.ethereum)
  window.ethereum.enable()
  const data = {
    web3Instance: web3,
  }
  return <Web3Context.Provider value={data}>{ children }</Web3Context.Provider>
}