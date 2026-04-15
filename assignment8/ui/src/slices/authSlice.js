import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null
  },
  reducers: {
    authenticated: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    unauthenticated: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

export const { authenticated, unauthenticated } = authSlice.actions;
export default authSlice.reducer;