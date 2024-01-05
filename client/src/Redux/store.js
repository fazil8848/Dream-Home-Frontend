import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/authSlice";
import adminReducer from "./Slices/adminAuthSlice";
import ownerReducer from "./Slices/ownerApi/ownerAuthSlicel";
import { apiSlice } from "./Slices/apiSlice";
import userChatReducer from "./Slices/chatSlices/userChatSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    owner: ownerReducer,
    chat: userChatReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefualtMiddleware) =>
    getDefualtMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
