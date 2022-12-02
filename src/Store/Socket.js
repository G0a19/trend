import { createSlice } from "@reduxjs/toolkit";

let socket = {};

export const socketReduce = createSlice({
  name: "userId",
  initialState: socket,
  reducers: {
    setSocketHandler(state, action) {
      socket = action.payload.socket;
      return action.payload;
    },
  },
});

export const { setSocketHandler } = socketReduce.actions;
