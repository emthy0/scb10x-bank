import * as React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { RootState, useAppDispatch } from "@/store"
import { setAccountInfoToCreate, createAccount } from "@store/user"
import { reconnectWallet, connectWallet } from "@store/wallet"

const form = (
  name: string,
  setName: React.Dispatch<React.SetStateAction<string>>,
  action: () => void
) => (
  <Grid
    container
    component="form"
    autoComplete="off"
    // sx={{ marginLeft: 10 }}
    spacing={2}
    alignItems="center"
  >
    {/* <Grid item xs={12}>
      <Typography
        // sx={{ paddingRight: 60 }}
        variant="subtitle1"
        component="div"
      >
        Create Account
      </Typography>
    </Grid> */}
    <Grid item xs={8} component="div">
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        id="outlined-basic"
        label="Account Name"
        variant="standard"
        fullWidth
        margin="none"
      />
    </Grid>
    <Grid item xs={4}>
      <Button
        onClick={action}
        variant="outlined"
        // sx={{ marginTop: 1, paddingTop: 1 }}
      >
        Create
      </Button>
    </Grid>
  </Grid>
)

// const form = (
//   <TextField
//     id="outlined-basic"
//     label="Outlined"
//     variant="standard"
//     fullWidth
//   />
// )

export default function BasicCard() {
  const dispatch = useAppDispatch()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const state = useSelector((state: RootState) => state)

  const CreateNewAccount = () => {
    console.log("Creating new account for address: " + state.wallet.address)
    dispatch(setAccountInfoToCreate(name))
    // console.log(state.user.accToCreate)
    dispatch(createAccount)
  }

  return (
    <Card
      onClick={() => setShowForm(true)}
      sx={{
        minWidth: 620,
        minHeight: 155,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CardContent
        sx={{
          minWidth: 520,
          // display: "flex",
          // justifyContent: "center",
          // minHeight: 155,
        }}
      >
        {showForm ? (
          <>
            <Typography
              // sx={{ paddingRight: 60 }}
              variant="subtitle1"
              component="div"
            >
              Create Account
            </Typography>
            {form(name, setName, CreateNewAccount)}
          </>
        ) : (
          <Typography sx={{ margin: 15 }} variant="h5" component="div">
            + Create New Account
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
