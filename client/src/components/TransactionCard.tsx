import * as React from "react"
import web3 from "web3"

import { styled } from "@mui/material/styles"
import CardContent from "@mui/material/CardContent"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"

import { IAccountControlState } from "@components/AccountInfo"
import { IAccount, ITransaction } from "@store/user"

interface ITransactionCardProps {
  transaction: ITransaction
  account: IAccount
}

export default function TransactionCard(props: ITransactionCardProps) {
  const { transaction, account } = props
  return (
    <>
      <Divider />
      <CardContent>
        {transaction.sender && transaction.receiver ? (
          <>
            <Typography variant="h6">{`Transfer [${
              transaction.sender === account.name ? "Sender" : "Receiver"
            }]`}</Typography>
            <Typography>{`Date: ${new Date(
              transaction.timestamp * 1000
            )}`}</Typography>
            <Typography>{`Amount: ${web3.utils.fromWei(
              transaction.amount.toString(),
              "ether"
            )} ETH `}</Typography>
            <Typography>{`From ${transaction.sender} to ${transaction.receiver} `}</Typography>
          </>
        ) : transaction.sender ? (
          <>
            <Typography variant="h6">Deposit</Typography>
            <Typography>{`Date: ${new Date(
              transaction.timestamp * 1000
            )}`}</Typography>
            <Typography>{`Amount: ${web3.utils.fromWei(
              transaction.amount.toString(),
              "ether"
            )} ETH `}</Typography>
          </>
        ) : (
          <>
            <Typography variant="h6">Withdraw</Typography>
            <Typography>{`Date: ${new Date(
              transaction.timestamp * 1000
            )}`}</Typography>
            <Typography>{`Amount: ${web3.utils.fromWei(
              transaction.amount.toString(),
              "ether"
            )} ETH `}</Typography>
          </>
        )}
      </CardContent>
    </>
  )
}
