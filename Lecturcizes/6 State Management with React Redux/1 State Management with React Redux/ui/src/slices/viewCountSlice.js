import { createSlice } from "@reduxjs/toolkit";

const viewCountSlice = createSlice({
  name: "counter",
  initialState: {
    catViewCount: 0,
    dogViewCount: 0
  },
  reducers: {
    incrementCat: state => {
      state.catViewCount++;
    },
    incrementDog: (state, action) => {
      // action.payload is what you pass when you dispatch the action.
      state.dogViewCount += action.payload;
    }
  }
});

export const { incrementCat, incrementDog } = viewCountSlice.actions;
export default viewCountSlice.reducer;