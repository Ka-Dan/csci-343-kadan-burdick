import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slices/authSlice.js";

/*
* We are moving the store creation to a separate file so that we can use the store object in other files.
*/
const store = configureStore({
  reducer: {
    auth: reducer
  }
});

export default store;
