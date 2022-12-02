import { createSlice } from "@reduxjs/toolkit";

let notificationsNumber = 0;

export const notificationsNumberReduce = createSlice({
  name: "notificationsNumber",
  initialState: notificationsNumber,
  reducers: {
    addNotificationsNumberHandler(state, action) {
      state++;
      return state;
    },
    reduceNotificationsNumberHandler(state, action) {
      state--;
      return state;
    },
    setNotificationsNumberHandler(state, action) {
      state = action.payload.number;
      return state;
    },
  },
});

export const { setNotificationsNumberHandler, reduceNotificationsNumberHandler, addNotificationsNumberHandler } = notificationsNumberReduce.actions;
