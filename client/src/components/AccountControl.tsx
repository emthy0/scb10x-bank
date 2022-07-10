import * as React from "react"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded"
import PersonRoundedIcon from "@mui/icons-material/PersonRounded"
import LoginRoundedIcon from "@mui/icons-material/LoginRounded"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded"
import FavoriteIcon from "@mui/icons-material/Favorite"
import PersonPinIcon from "@mui/icons-material/PersonPin"

import { IAccountControlState } from "@components/AccountInfo"

import {
  RiLoginCircleFill,
  RiLogoutCircleRFill,
  RiExchangeBoxFill,
  RiExchangeLine,
} from "react-icons/ri"

import {
  MdOutlineAccountBalanceWallet,
  MdOutlineAccountBalance,
  MdLogout,
} from "react-icons/md"

interface IAccountControlProps {
  setAccountControl: React.Dispatch<React.SetStateAction<IAccountControlState>>
}

export default function AccountControl(props: IAccountControlProps) {
  const { setAccountControl } = props

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue)
    const controlList: IAccountControlState[] = [
      "info",
      "deposit",
      "withdraw",
      "transfer",
    ]
    setValue(newValue)
    setAccountControl(controlList[newValue])
  }

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      orientation="vertical"
      aria-label="account control"
      className="AccountControlTabs"
      // sx={{ borderLeft: 1, borderColor: "divider" }}
    >
      <Tab
        icon={<MdOutlineAccountBalanceWallet size={30} />}
        aria-label="My Account"
        label="My Account"
      />
      <Tab
        icon={<MdOutlineAccountBalance size={30} />}
        aria-label="Deposits"
        label="Deposits"
      />
      <Tab
        icon={<MdLogout size={30} />}
        aria-label="Withdraw"
        label="Withdraw"
      />
      <Tab
        icon={<RiExchangeLine size={30} />}
        aria-label="Transfer"
        label="Transfer"
      />
    </Tabs>
  )
}
