import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
};

export const addressBookSlice = createSlice({
  name: "address",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      const isAddressExisting = state.addresses.some((address) => 
        address.firstName === action.payload.firstName &&
        address.lastName === action.payload.lastName &&
        address.postcode === action.payload.postcode &&
        address.street === action.payload.street &&
        address.houseNumber === action.payload.houseNumber &&
        address.city === action.payload.city
      );
      if (isAddressExisting) return state;
      state.addresses.push(action.payload);
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      const filteredAddresses = state.addresses.filter((address) => address.id !== action.payload);
      state.addresses = filteredAddresses;
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.addressBook.addresses;

export default addressBookSlice.reducer;
