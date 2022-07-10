import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch, AnyAction} from "redux"
import Web3 from 'web3'

import { PatientContract } from '@contracts/index'

interface ITransaction {
  sender: string;
  receiver: string;
  txvalue: number;
  amount: number;
  feeCollected: boolean;
  toBank: boolean;
  timestamp: number;
}

interface IAccount {
  addr: string;
  name: string;
  balance: number;
  transaction: ITransaction[];
}

interface IUser {
  addr: string;
  accounts: IAccount[];
}

export const createAccount = async(dispatch: Dispatch<AnyAction>, getState: () => any) => {
  const state = getState()
  
}

export const setUserInfo2 = async (dispatch: any, getState: any) => {
  const state = getState()
  const web3 = state.wallet.web3Instance
  const address = state.wallet.address
  const networkID = state.wallet.networkID
  const RegisterContract = new web3.eth.Contract(PatientContract.abi, PatientContract.networks[networkID].address)
  await RegisterContract.methods.addPatient(address, state.user.email, state.user.firstname, state.user.lastname).send({from:address, gas: 3000000})
  dispatch(setRegistered(true))
}

export const getUserInfo = async(dispatch: Dispatch<AnyAction>, getState: () => any) => {
  const state = getState()
  console.log("this is state",state)
  const web3 = state.wallet.web3Instance
  const address = state.wallet.address
  const networkID = state.wallet.networkID
  console.log("asdasdfa",address,networkID)
  
  const RegisterContract = new web3.eth.Contract(PatientContract.abi, PatientContract.networks[networkID].address)
  console.log("asdasdfa",RegisterContract.methods)
  console.log("getName",RegisterContract.methods.getName)
  // console.log("getName()",RegisterContract.methods.getName().call())
  // await RegisterContract.methods.addPatient(address, "titorps360@gmail.com", "thanuy","wuysamut").send({from:address, gas: 3000000})
  // await RegisterContract.methods.setName("titorps360@gmail.com").send({from:address})
  // const data = await RegisterContract.methods.getName().call()
  const data: IUser = await RegisterContract.methods.getPatient(address).call()
  console.log("data",data.email)
  dispatch(setBasicInfo(data))
  if (data.email != "") dispatch(setRegistered(true))
  // await RegisterContract.methods.addPatient(address, "titorps360@gmail.com", "thanuy","wuysamut").send({from:address, gas: 300000})
}

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    addr: "",
    accounts: [],
    isRegistered: false,
  },
  reducers: {
    setBasicInfo: (state, action) => {
      if (action.payload.addr != "") {
        state.addr = action.payload.addr
        state.accounts = action.payload.accounts;
      }
    },
    setRegistered: (state, action) => {
      state.isRegistered = action.payload;
    },
    // getUserInfo: (state, action) => {

    // },
  }
})

export const { setBasicInfo, setRegistered, dump } = UserSlice.actions

export default UserSlice.reducer