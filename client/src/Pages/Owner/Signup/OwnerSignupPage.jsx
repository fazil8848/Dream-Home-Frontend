import React from "react";
import OwnerSignup from "../../../components/Owner/OwnerSignup/OwnerSignup";
import OwnerHeader from "../../../components/Owner/OwnerHeader/OwnerHeader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OwnerSignupPage() {
  return (
    <>
      <OwnerHeader />
      <ToastContainer />
      <OwnerSignup />
    </>
  );
}

export default OwnerSignupPage;
