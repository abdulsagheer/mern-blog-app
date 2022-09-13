import { userAuth } from "./../../../Interfaces/userAuth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ================================================================
// Register Action
// ================================================================

export const registerUserAction: any = createAsyncThunk(
  "users/register",
  async (user, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = (await axios.post(
        "http://localhost:5000/api/users/register",
        user,
        config
      )) as any;
      return data;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// ================================================================
// Register Slice
// ================================================================
const initialState: userAuth = {
  userAuth: "login",
  loading: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  // extraReducers: {
  //   [registerUserAction.pending]: (
  //     state = initialState,
  //     action: PayloadAction
  //   ) => {
  //     state.loading = true;
  //   },
  //   [registerUserAction.fullfiled]: (
  //     state = initialState,
  //     action: PayloadAction
  //   ) => {
  //     state.registered = action.payload;
  //   },
  //   [registerUserAction.rejected]: (
  //     state = initialState,
  //     action: PayloadAction
  //   ) => {
  //     state.registered = action.payload;
  //   },
  // },
  extraReducers: (builder) => {
    // Register
    builder.addCase(
      registerUserAction.pending,
      (state = initialState, action: PayloadAction) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      }
    );
    builder.addCase(
      registerUserAction.fullfiled,
      (state = initialState, action: PayloadAction) => {
        state.loading = false;
        state.registered = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      }
    );
    builder.addCase(
      registerUserAction.rejected,
      (state = initialState, action: PayloadAction) => {
        state.loading = false;
        state.appError = action?.payload;
        state.serverError = action?.payload;
      }
    );
  },
});

export default userSlice.reducer;
