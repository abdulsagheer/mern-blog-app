import { userAuth } from "./../../../Interfaces/userAuth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../utils/baseURL";

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
        `${baseUrl}/api/users/register`,
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
// Login Action
// ================================================================

export const loginUserAction: any = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      //make http call
      const { data } = await axios.post(
        `${baseUrl}/api/users/login`,
        userData,
        config
      );
      //save user into local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
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
//get user from local storage and place into store
// ================================================================

export const userLoginFromStorage: any = localStorage.getItem("userInfo")
  ? JSON.parse(String(localStorage.getItem("userInfo")))
  : null;

// ================================================================
//Logout action
// ================================================================

export const logoutAction: any = createAsyncThunk(
  "/user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      localStorage.removeItem("userInfo");
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
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  userAuth: userLoginFromStorage,
  loading: false,
  registered: "",
  appError: "",
  serverError: "",
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
    // ================================================================
    //register
    // ================================================================

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
    // ================================================================
    //login
    // ================================================================

    builder.addCase(loginUserAction.pending, (state, action) => {
      state.loading = true;
      state.appError = undefined;
      state.serverError = undefined;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.loading = false;
      state.appError = undefined;
      state.serverError = undefined;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.appError = action?.payload?.message;
      state.serverError = action?.error?.message;
      state.loading = false;
    });
    // ================================================================
    // Logout
    // ================================================================

    builder.addCase(logoutAction.pending, (state, action) => {
      state.loading = false;
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.userAuth = undefined;
      state.loading = false;
      state.appError = undefined;
      state.serverError = undefined;
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.appError = action?.payload?.message;
      state.serverError = action?.error?.message;
      state.loading = false;
    });
  },
});

export default userSlices.reducer;
