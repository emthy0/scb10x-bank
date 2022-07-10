import { createSlice } from '@reduxjs/toolkit'

import PatientContract from "@contracts/Patient.json"

interface ContractInterface {
  abi: any;
  networks: any;
}

export const ContractsSlice = createSlice({
  name: 'contracts',
  initialState: {
    PatientContract: {}
  },
  reducers: {
    
  }
})
