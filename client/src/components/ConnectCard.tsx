import * as React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

import { RootState, useAppDispatch } from "@/store"
import { setAccountInfoToCreate } from "@store/user"
import { reconnectWallet, connectWallet } from "@store/wallet"

export default function ConnectCard() {
  const dispatch = useAppDispatch()
  const state = useSelector((state: RootState) => state)

  const ConnectWallet = () => {
    dispatch(connectWallet)
  }

  return (
    <Card onClick={ConnectWallet} sx={{ minWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Connect to Wallet
        </Typography>
      </CardContent>
    </Card>
  )
}
