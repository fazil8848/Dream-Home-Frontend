import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import "./index.css";
import MainRouter from "./Routes/MainRoute.jsx";
import { SocketContextProvider } from "./Context/SocketContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = document.getElementById("root");
const reactRoot = createRoot(root);

reactRoot.render(
  <Provider store={store}>
    <SocketContextProvider>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
      >
        <Router>
          <MainRouter />
        </Router>
      </GoogleOAuthProvider>
    </SocketContextProvider>
  </Provider>
);
