import * as React from "react"
import { styled } from "@mui/material/styles"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Collapse from "@mui/material/Collapse"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import IconButton, { IconButtonProps } from "@mui/material/IconButton"

import { IAccountControlState } from "@components/AccountInfo"
import { IAccount, ITransaction } from "@store/user"
import AccountInfo from "@components/AccountInfo"
import AccountControl from "@components/AccountControl"
import TransactionCard from "./TransactionCard"
import { CommonSymbolSchema } from "@thirdweb-dev/sdk"

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
)

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}))

interface IAccountCardProps {
  account: IAccount
}

export default function BasicCard(props: IAccountCardProps) {
  const { account } = props
  const [expanded, setExpanded] = React.useState(false)
  const [currentControl, setCurrentControl] =
    React.useState<IAccountControlState>("info")
  console.log("adfasdfA", account.transactionHistory)
  return (
    <Card className="card">
      <Grid container>
        <Grid item xs={10}>
          <AccountInfo account={account} currentControl={currentControl} />
          {/* <CardContent sx={{ minWidth: "45vw" }}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Account Name:
            </Typography>
            <Typography variant="h5" component="div">
              {account.name}
            </Typography>
            <Typography variant="h6">Balance: {account.balance}</Typography>
          </CardContent> */}
          <Divider />
          <CardActions onClick={() => setExpanded(!expanded)} disableSpacing>
            <ExpandMore
              expand={expanded}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {account.transactionHistory.map(
              (transaction: ITransaction, index) => {
                console.log(transaction)
                return (
                  <TransactionCard
                    transaction={transaction}
                    account={account}
                  />
                )
              }
            )}
          </Collapse>
        </Grid>
        <Grid item xs={2}>
          {/* <CardActions>
            <Grid container direction="column">
              <Button sx={{ display: "flex" }} size="small">
                Share
              </Button>
              <Button size="small">Share</Button>
              <Button size="small">Share</Button>
            </Grid>
          </CardActions> */}
          <AccountControl setAccountControl={setCurrentControl} />
        </Grid>
      </Grid>
    </Card>
  )
}
