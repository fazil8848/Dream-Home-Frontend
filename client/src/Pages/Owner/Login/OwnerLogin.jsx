import React from "react";
import OwnerLogin from "../../../components/Owner/OwnerLogin/OwnerLogin";
import OwnerHeader from "../../../components/Owner/OwnerHeader/OwnerHeader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OwnerLoginPage() {
  return (
    <>
      <OwnerHeader />
      <ToastContainer />
      <OwnerLogin />
    </>
  );
}

export default OwnerLoginPage;
