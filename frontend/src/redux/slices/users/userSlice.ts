import { userAuth } from "./../../../Interfaces/userAuth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

const userSlices = createSlice({
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
    //register
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.registered = action?.payload;
      state.appError = undefined;
      state.serverError = undefined;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appError = action?.payload?.message;
      state.serverError = action?.error?.message;
    });
  },
});

export default userSlices.reducer;
