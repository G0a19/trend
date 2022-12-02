import { createSlice } from "@reduxjs/toolkit";

let userId = "";

export const userIdReduce = createSlice({
  name: "userId",
  initialState: userId,
  reducers: {
    setUserIdHandler(state, action) {
      userId = action.payload.userId;
      return action.payload.userId;
    },
  },
});

export const { setUserIdHandler } = userIdReduce.actions;
