import { configureStore } from '@reduxjs/toolkit'
import { Action, Dispatch, AnyAction} from "redux"
import { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import WalletReducer from './wallet'
import UserReducer from './user'

const asyncFunctionMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  // If the "action" is actually a function instead...
  // console.log("this is action through middleware",action)
  if (typeof action === 'function') {
    // then call the function and pass `dispatch` and `getState` as arguments
    return action(storeAPI.dispatch, storeAPI.getState)
  }

  // Otherwise, it's a normal action - send it onwards
  return next(action)
}

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(asyncFunctionMiddleware),
  reducer: {
    wallet: WalletReducer,
    user: UserReducer
  }
})




export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store