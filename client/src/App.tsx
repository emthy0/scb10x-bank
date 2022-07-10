import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"
import logo from "./logo.svg"
import "./App.css"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"

import AccountCard from "@components/AccountCard"
import NewAccountCard from "@components/NewAccountCard"
import ConnectCard from "@/components/ConnectCard"

import { RootState, useAppDispatch } from "@/store"
import { getAccountsList } from "@store/user"
import { reconnectWallet, connectWallet } from "@store/wallet"

const navItems = ["Home", "About", "Contact"]

function App() {
  const [count, setCount] = useState(0)
  const [page, setPage] = useState()

  const dispatch = useAppDispatch()
  const state = useSelector((state: RootState) => state)

  useEffect(() => {
    window.ethereum.on("accountsChanged", function () {
      dispatch(connectWallet)
      dispatch(getAccountsList)
      console.log("address changed", state.wallet.address)
    })
  }, [])

  useEffect(() => {
    dispatch(reconnectWallet)
    console.log("reconnectWallet", state.wallet.address)
    if (state.wallet.address) {
      // console.log("wallet web", state.wallet.web3Instance)
      console.log("web3 weallet", state.user.accounts)
      dispatch(getAccountsList)
    }
  }, [state.wallet.address])

  useEffect(() => {
    console.log("User's Account", state.user.accounts)
  }, [state.user.accounts])

  return (
    <div className="App">
      <AppBar component="nav">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
            <Button sx={{ color: "#fff" }}>{state.wallet.address}</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <header className="App-header">
        <ToastContainer
          theme="dark"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </header>
      <div className="App">
        {state.user.accounts.map((account) => {
          return <AccountCard key={account.name} account={account} />
        })}
        {state.wallet.address ? <NewAccountCard /> : <ConnectCard />}
      </div>
    </div>
  )
}

export default App
