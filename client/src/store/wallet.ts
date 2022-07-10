import { createContext, useContext, Context } from "react"
import { createSlice } from '@reduxjs/toolkit'
import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'

import createAgent from 'agent-base';

// ------------------------------------
// Constants
// ------------------------------------
export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED'

interface Web3ContextInterface {
  address: string;
}

export const connectWallet = async (dispatch:any, getState:any) => {
  const options: HttpProviderOptions = {
    agent: {
      http: createAgent(),
      https: createAgent(),
    }
  }
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545", options))
  dispatch(setWeb3(web3))
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const address = accounts[0]
  console.log("dadaaaadadada",accounts)
  web3.eth.defaultAccount = address
  const networkID = await web3.eth.net.getId()
  const balance = await web3.eth.getBalance(address);
  dispatch(setAddress(accounts[0]))
  dispatch(setNetworkID(networkID))
  dispatch(setBalance(balance))
  // await AsyncStorage.setItem('@web3Address', address)
  // await AsyncStorage.setItem('@web3NetworkID', networkID.toString())
  // await AsyncStorage.setItem('@web3Connected', "true")
}

export const reconnectWallet = async (dispatch:any, getState:any) => {
  const options: HttpProviderOptions = {
    agent: {
      http: createAgent(),
      https: createAgent(),
    }
  }
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545", options))
  dispatch(setWeb3(web3))
  const accounts = await window.ethereum.request({method: 'eth_accounts'})
  let isConnected = false
  if (accounts.length > 0) isConnected = true
  console.log('wallet connected', isConnected)
  const accounts2 = await window.ethereum.request({ method: 'eth_requestAccounts' })
  console.log("dadaaaadadada",accounts)
  if (isConnected) {
    // const address = await AsyncStorage.getItem('@web3Address')
    // const networkID = await AsyncStorage.getItem('@web3NetworkID')
    const address = accounts[0]
    const networkID = await web3.eth.net.getId()
    if (address && networkID) {
      const balance = await web3.eth.getBalance(address);
      web3.eth.defaultAccount = address
      dispatch(setAddress(address))
      dispatch(setNetworkID(networkID))
      dispatch(setBalance(balance))
      return
    }
  } 
  dispatch(setAddress(null))
  dispatch(setNetworkID(null))
}
  // window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: Array<string>) => {
  //   dispatch(setAddress(accounts[0]))
  //   // web3.eth.net.getId().then((networkID: number) => di)
  // })
  // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

export const WalletSlice = createSlice({
  name: "web3",
  initialState: {
    isConnected: false,
    address: "",
    balance: 0,
    networkID: 0,
    web3Instance: new Web3()
  },
  reducers: {
    setAddress: (state, action) => {
      // console.log("dfd")
      state.address = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setNetworkID: (state, action) => {
      state.networkID = action.payload;
    },
    setWeb3: (state, action) => {
      state.web3Instance = action.payload
    }
  }
})

export const { setAddress, setBalance, setNetworkID, setWeb3 } = WalletSlice.actions;
// console.log(setAddress)
export default WalletSlice.reducer;