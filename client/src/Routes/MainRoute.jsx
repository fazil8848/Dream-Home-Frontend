import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRouter from "./Admin/AdminRoutes.jsx";
import UserRouter from "./User/UserRoutes.jsx";
import Verification from "../Pages/Verification/Verification.jsx";
import OwnerRoutes from "./Owner/OwnerRoutes.jsx";
import VerificationOwner from "../Pages/Owner/VerificationOwner/VerificationOwner.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const MainRouter = () => {
  return (
    <PayPalScriptProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/owner/*" element={<OwnerRoutes />} />
        <Route path="/*" element={<UserRouter />} />
        <Route path="/user/verifyUser/:id" element={<Verification />} />
        <Route path="/owner/verifyUser/:id" element={<VerificationOwner />} />
      </Routes>
    </PayPalScriptProvider>
  );
};

export default MainRouter;
