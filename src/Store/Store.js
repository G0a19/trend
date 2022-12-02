import { createSlice, configureStore } from "@reduxjs/toolkit";
import { userIdReduce } from "./UserId";
import { socketReduce } from "./Socket";
import { notificationsNumberReduce } from "./notificationsNumber";

let loader = false;

export const loaderReduce = createSlice({
  name: "loader",
  initialState: loader,
  reducers: {
    changeLoaderHandler(state, action) {
      return !state;
    },
  },
});

const store = configureStore({
  reducer: {
    loader: loaderReduce.reducer,
    userId: userIdReduce.reducer,
    socket: socketReduce.reducer,
    notificationsNumber: notificationsNumberReduce.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const { changeLoaderHandler } = loaderReduce.actions;
export default store;
