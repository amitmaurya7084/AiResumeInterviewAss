import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.js"; // ✅ Correct import path

const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ make sure the key matches
  },
});

 export default store;
