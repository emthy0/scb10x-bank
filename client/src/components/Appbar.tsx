import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window
}

const drawerWidth = 240
const navItems = ["Home", "About", "Contact"]

export default function DrawerAppBar(props: Props) {
  const { window } = props

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <AppBar component="nav">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {navItems.map((item) => (
            <Button key={item} sx={{ color: "#fff" }}>
              {item}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
