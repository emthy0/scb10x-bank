import * as React from "react"
import { useSelector } from "react-redux"
import web3 from "web3"

import { styled } from "@mui/material/styles"
import Autocomplete from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Collapse from "@mui/material/Collapse"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import FilledInput from "@mui/material/FilledInput"
import FormControl from "@mui/material/FormControl"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Input from "@mui/material/Input"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton, { IconButtonProps } from "@mui/material/IconButton"

import {
  IAccount,
  IUserState,
  doDeposit,
  doWithdraw,
  doTransfer,
  setActionPayload,
} from "@store/user"
import { RootState, useAppDispatch } from "@/store"
import { fontSize } from "@mui/system"

export type IAccountControlState = "info" | "deposit" | "withdraw" | "transfer"

interface IAccountCardProps {
  account: IAccount
  currentControl: IAccountControlState
}

interface IDialogPayloadProps {
  title: string
  body: string
  function: (...props: any) => Promise<void>
}

interface IAccountSubControlProps {
  account: IAccount
  user: IUserState
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  setDialogPayload: React.Dispatch<React.SetStateAction<IDialogPayloadProps>>
}

const General = (account: IAccount) => (
  <>
    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
      Account Name:
    </Typography>
    <Typography variant="h6" component="div">
      {account.name}
    </Typography>
    <Typography sx={{ fontSize: 14 }} color="text.secondary">
      Balance:
    </Typography>
    <Typography variant="h5" component="div">
      {web3.utils.fromWei(account.balance.toString(), "ether")} ETH
    </Typography>
  </>
)

// const handleDeposit = (amount: number) => {}

const Deposit = (props: IAccountSubControlProps) => {
  const [amount, setAmount] = React.useState<number>(0)
  const dispatch = useAppDispatch()
  const handleDeposit = () => {
    console.log(props.user)
    dispatch(
      setActionPayload({
        amount: web3.utils.toWei(amount.toString(), "ether"),
        account: props.account.name,
      })
    )
    props.setDialogPayload({
      title: "Deposit",
      body: `${amount} ETH from ${props.user.addr} will be deposit to ${props.account.name}`,
      function: doDeposit,
    })
    props.setOpenDialog(true)
  }
  return (
    <>
      <h5 style={{ margin: 0 }}>{`Deposit`}</h5>
      <h5 style={{ margin: 0 }}>{`${props.account.name}`}</h5>
      <h6 style={{ margin: 0 }}>{`Balance: ${web3.utils.fromWei(
        props.account.balance.toString(),
        "ether"
      )} ETH`}</h6>
      <FormControl
        sx={{ m: 1, minWidth: "50%", display: "inline-block" }}
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-amount">Amount:</InputLabel>
        <Input
          id="standard-adornment-amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          type="number"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9,.]*",
            step: 0.0000001,
          }}
          sx={{ width: "70%", marginRight: "5%" }}
          endAdornment={<InputAdornment position="start">ETH</InputAdornment>}
        />
        <Button
          onClick={handleDeposit}
          variant="outlined"
          sx={{ width: "20%" }}
          // sx={{ marginTop: 1, paddingTop: 1 }}
        >
          Deposit
        </Button>
      </FormControl>
    </>
  )
}

const Withdraw = (props: IAccountSubControlProps) => {
  const [amount, setAmount] = React.useState<number>(0)
  const dispatch = useAppDispatch()
  const handleWithdraw = () => {
    console.log(props.user)
    dispatch(
      setActionPayload({
        amount: web3.utils.toWei(amount.toString(), "ether"),
        account: props.account.name,
      })
    )
    props.setDialogPayload({
      title: "Withdraw",
      body: `${amount} ETH from ${props.account.name} will be withdraw to ${props.user.addr}`,
      function: doWithdraw,
    })
    props.setOpenDialog(true)
  }
  return (
    <>
      <h5 style={{ margin: 0 }}>Withdraw</h5>
      <h5 style={{ margin: 0 }}>{`${props.account.name} `}</h5>
      <h6 style={{ margin: 0 }}>{`Balance: ${web3.utils.fromWei(
        props.account.balance.toString(),
        "ether"
      )} ETH`}</h6>
      <FormControl
        sx={{ m: 1, minWidth: "50%", display: "inline-block" }}
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-amount">Amount:</InputLabel>
        <Input
          id="standard-adornment-amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          type="number"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9,.]*",
            step: 0.0000001,
          }}
          sx={{ width: "70%", marginRight: "5%" }}
          endAdornment={<InputAdornment position="start">ETH</InputAdornment>}
        />
        <Button
          onClick={handleWithdraw}
          variant="outlined"
          sx={{ width: "20%" }}
          // sx={{ marginTop: 1, paddingTop: 1 }}
        >
          Withdraw
        </Button>
      </FormControl>
      <Typography variant="overline" component="div">
        Thanks for using our service.
      </Typography>
    </>
  )
}

const Transfer = (props: IAccountSubControlProps) => {
  const [amount, setAmount] = React.useState<number>(0)
  const dispatch = useAppDispatch()
  const [totalAmount, setTotalAmount] = React.useState<Number>(0)
  const [accounts, setAccounts] = React.useState<string[]>([])
  const handleTransfer = () => {
    dispatch(
      setActionPayload({
        amount: web3.utils.toWei(amount.toString(), "ether"),
        account: props.account.name,
        targetAccounts: accounts,
      })
    )
    props.setDialogPayload({
      title: "Transfer",
      body: `Transfer ${amount * accounts.length} ETH to ${
        accounts.length
      } accounts. ( ${amount} ETH each., 1% fee will be dedcuted if destinate account are not yours.)`,
      function: doTransfer,
    })

    props.setOpenDialog(true)
  }
  return (
    <>
      <h5 style={{ margin: 0 }}>Transfer</h5>
      <h5 style={{ margin: 0 }}>{`${props.account.name} `}</h5>
      <h6 style={{ margin: 0 }}>{`Balance: ${web3.utils.fromWei(
        props.account.balance.toString(),
        "ether"
      )} ETH`}</h6>
      <FormControl
        sx={{ m: 1, width: "80%", display: "inline-block" }}
        variant="standard"
      >
        <Autocomplete
          multiple
          freeSolo
          sx={{ width: "60%", display: "inline-block", marginRight: "2%" }}
          // onMouseOut={() => }
          onChange={(_, value) => {
            setAccounts(value)
          }}
          options={[]}
          id="tags-standard"
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Transfer to"
              placeholder="Accounts"
            />
          )}
        />

        <TextField
          sx={{ width: "30%", display: "inline-block" }}
          type="number"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            step: 0.0000001,
          }}
          onChange={(e) => setAmount(Number(e.target.value))}
          variant="standard"
          label="Amount per Account"
          placeholder="ETH"
        />

        <Typography
          sx={{ width: "72%", display: "inline-block", fontSize: "10px" }}
          variant="overline"
          component="div"
        >
          {`Total ${amount * accounts.length} ETH will be transfer to ${
            accounts.length
          } accounts. 
          `}
          <br /> 1% fee will be dedcuted if destinate account are not yours.
        </Typography>
        <Button
          onClick={handleTransfer}
          variant="outlined"
          sx={{ width: "20%" }}
          // sx={{ marginTop: 1, paddingTop: 1 }}
        >
          Transfer
        </Button>
      </FormControl>
    </>
  )
}

export default function AccountInfo(props: IAccountCardProps) {
  const { account, currentControl } = props
  const dispatch = useAppDispatch()
  const state = useSelector((state: RootState) => state)

  const [openDialog, setOpenDialog] = React.useState(false)
  const [dialogPayload, setDialogPayload] = React.useState<IDialogPayloadProps>(
    { title: "", body: "", function: () => new Promise(() => {}) }
  )
  const subProps: IAccountSubControlProps = {
    user: state.user,
    account,
    setOpenDialog,
    setDialogPayload,
  }
  return (
    <CardContent sx={{ minWidth: "45vw", minHeight: "20vh" }}>
      {
        {
          info: General(account),
          deposit: Deposit(subProps),
          withdraw: Withdraw(subProps),
          transfer: Transfer(subProps),
        }[currentControl]
      }
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogPayload.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogPayload.body}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false)
            }}
          >
            Abort
          </Button>
          <Button
            onClick={() => {
              dispatch(dialogPayload.function).then(() => {
                setOpenDialog(false)
              })
            }}
            autoFocus
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  )
}
