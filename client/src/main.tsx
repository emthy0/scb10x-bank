import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import store from "./store"
import { Provider, useSelector, useDispatch } from "react-redux"

// This is the chainId your dApp will work on.

const container = document.getElementById("root")
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
