import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../redux/slices/users/userSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    category: categoriesReducer,
    post,
    comment,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
