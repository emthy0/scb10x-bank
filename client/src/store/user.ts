import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch, AnyAction} from "redux"
import { toast } from 'react-toastify'

import { BankContract } from '@contracts/index'
import { error } from 'console';

export interface UserInterface {
  email: string;
  firstname: string;
  lastname: string;
}

export interface ITransaction {
  sender: string;
  receiver: string;
  txvalue: number;
  amount: number;
  feeCollected: boolean;
  toBank: boolean;
  timestamp: number;
}

export interface IAccount {
  addr: string;
  name: string;
  balance: number;
  transaction: ITransaction[];
}

export interface IUserState {
  addr: string;
  accounts: IAccount[];
  accToCreate: string;
  actionPayload: any;
}

const initialUserState: IUserState = {
  addr: "",
  accounts: [],
  accToCreate: "",
  actionPayload: {},
}

const errorHandler = (err: Error) => {
  console.log(err.message)
  switch (err.message) {
    case "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.": toast.error('Contract are not on this network') 
    case "Returned error: sender account not recognized": toast.error('You account are not on our network')
    // case
    default: toast.error(err.message);
  }
}



export const getAccountsList = async(dispatch: Dispatch<AnyAction>, getState: () => any) => {
  const state = getState()
  const web3 = state.wallet.web3Instance
  const networkID = state.wallet.networkID
  console.log("Contract Address:",BankContract.networks[networkID].address)
  const bankContract = new web3.eth.Contract(BankContract.abi, BankContract.networks[networkID].address)
  const accountList: string[] = await bankContract.methods.GetAccountsList().call({from:state.wallet.address}).catch((err: any) => {
    console.log(err.message)
    if (err.message === "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.") toast.error('You are not on our network [Contract maybe not deployed]');
    else if (err.message === "Returned error: VM Exception while processing transaction: revert") toast.error("Account Name already been taken.");
    else toast.error(err.message);
    return []
  })
  
  const AccountDataPromise = accountList.map((accountName: string): Promise<IAccount> =>{
    return bankContract.methods.GetAccountsInfo(accountName).call({from:state.wallet.address})
  })
  const AccountData: IAccount[] = await Promise.all(AccountDataPromise).catch((err: any) => {
    errorHandler(err)
    return []
  })
  
  dispatch(setAccountsData(AccountData))
  dispatch(setUserAddr(state.wallet.address))
  // console.log("this is acc data list",AccountData[0])
}

export const createAccount = async(dispatch: Dispatch<AnyAction>, getState: () => any) => {
  const state = getState()
  console.log(state.user.accToCreate)
  if (state.user.accToCreate) {
    const web3 = state.wallet.web3Instance
    const networkID = state.wallet.networkID
    const bankContract = new web3.eth.Contract(BankContract.abi, BankContract.networks[networkID].address)
    bankContract.methods.CreateAccount(state.user.accToCreate).send({from:state.wallet.address, gas: 300000}).then(() => {
      console.log('done')
      getAccountsList(dispatch, getState)
    }).catch(errorHandler)
    
    
  }
}

export const doDeposit = async (dispatch: Dispatch<AnyAction>, getState: () => any) => {
  
  const state = getState()
  const web3 = state.wallet.web3Instance
  const address = state.wallet.address
  const networkID = state.wallet.networkID
  const Contract = new web3.eth.Contract(BankContract.abi, BankContract.networks[networkID].address)
  await Contract.methods.Deposit(state.user.actionPayload.account).send({from:address, gas: 3000000,value:state.user.actionPayload.amount}).then(()=>{
    getAccountsList(dispatch, getState)
    toast.success('Deposit success.')
  }).catch(errorHandler)
  
}

export const doWithdraw = async (dispatch: Dispatch<AnyAction>, getState: () => any) => {
  const state = getState()
  const web3 = state.wallet.web3Instance
  const address = state.wallet.address
  const networkID = state.wallet.networkID
  const Contract = new web3.eth.Contract(BankContract.abi, BankContract.networks[networkID].address)
  await Contract.methods.Withdraw(state.user.actionPayload.account, state.user.actionPayload.amount).send({from:address, gas: 3000000}).then(()=>{
    getAccountsList(dispatch, getState)
    toast.success('Withdraw success.')
  }).catch(errorHandler)
}

export const doTransfer = async (dispatch: Dispatch<AnyAction>, getState: () => any) => {
  const state = getState()
  const web3 = state.wallet.web3Instance
  const address = state.wallet.address
  const networkID = state.wallet.networkID
  const Contract = new web3.eth.Contract(BankContract.abi, BankContract.networks[networkID].address)
  await Contract.methods.BulkTransfer(state.user.actionPayload.account, state.user.actionPayload.targetAccounts, state.user.actionPayload.amount).send({from:address, gas: 3000000}).then(()=>{
    getAccountsList(dispatch, getState)
    toast.success('Transfer success.')
  }).catch(errorHandler)
}

// export const getUserInfo = async(dispatch: Dispatch<AnyAction>, getState: () => any) => {
//   const state = getState()
//   console.log("this is state",state)
//   const web3 = state.wallet.web3Instance
//   const address = state.wallet.address
//   const networkID = state.wallet.networkID
//   console.log("asdasdfa",address,networkID)
  
//   const RegisterContract = new web3.eth.Contract(PatientContract.abi, PatientContract.networks[networkID].address)
//   console.log("asdasdfa",RegisterContract.methods)
//   console.log("getName",RegisterContract.methods.getName)
//   // console.log("getName()",RegisterContract.methods.getName().call())
//   // await RegisterContract.methods.addPatient(address, "titorps360@gmail.com", "thanuy","wuysamut").send({from:address, gas: 3000000})
//   // await RegisterContract.methods.setName("titorps360@gmail.com").send({from:address})
//   // const data = await RegisterContract.methods.getName().call()
//   const data: UserInterface = await RegisterContract.methods.getPatient(address).call()
//   console.log("data",data.email)
//   dispatch(setBasicInfo(data))
//   if (data.email != "") dispatch(setRegistered(true))
//   // await RegisterContract.methods.addPatient(address, "titorps360@gmail.com", "thanuy","wuysamut").send({from:address, gas: 300000})
// }

export const UserSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUserAddr: (state, action) => {
      state.addr = action.payload
    },
    setAccountInfoToCreate: (state, action) => {
      console.log("dd",action)
      state.accToCreate = action.payload
    },
    setAccountsData: (state, action) => {
      state.accounts = action.payload
    },
    setActionPayload: (state, action) => {
      state.actionPayload = action.payload
    },
    // getUserInfo: (state, action) => {

    // },
  }
})

export const { setUserAddr, setAccountInfoToCreate, setAccountsData, setActionPayload } = UserSlice.actions

export default UserSlice.reducer