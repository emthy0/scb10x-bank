import * as React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardActionArea from "@mui/material/CardActionArea"
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
  <CardContent sx={{ paddingTop: 5, paddingLeft: 10, minWidth: "15vw" }}>
    <Grid
      container
      component="form"
      autoComplete="off"
      // sx={{ display: "block" }}
      spacing={2}
      alignItems="center"
    >
      <Grid item xs={12}>
        <Typography
          // sx={{ paddingRight: 60 }}
          variant="subtitle1"
          component="div"
        >
          Create Account
        </Typography>
      </Grid>
      <Grid item xs={8} component="div">
        <TextField
          value={name}
          onKeyDown={
            (e) => {
              // e.preventDefault()
              if (e.key === "Enter") {
                e.preventDefault()
                action()
              }
            }
            // e.key === "Enter"
            //   ? () => {
            //       e.preventDefault()
            //       action()
            //     }
            //   : e.preventDefault()
          }
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
  </CardContent>
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
      className="card"
      // onClick={() => setShowForm(true)}
      // sx={{
      //   minWidth: "50vw",
      //   minHeight: "20vh",
      //   display: "flex",
      //   justifyContent: "center",
      //   margin: "auto",
      // }}
      // style={{ backgroundColor: "#bcbcbc" }}
    >
      {showForm ? (
        <>{form(name, setName, CreateNewAccount)}</>
      ) : (
        <CardActionArea
          sx={{ display: "flex" }}
          onClick={() => setShowForm(true)}
        >
          <CardContent color="dark">
            <Typography variant="h5" component="div">
              Create New Account
            </Typography>
          </CardContent>
        </CardActionArea>
      )}
    </Card>
  )
}
