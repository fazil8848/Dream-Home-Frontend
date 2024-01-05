import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminHome from "../../Pages/Admin/AdminHome/AdminHome";
import AdminLogin from "../../Pages/Admin/AdminLogin/AdminLogin";
import AdminLayout from "../../Layouts/AdminLayout";
import UserListing from "../../Pages/Admin/UserListing/UserListing";
import PrivateRoutes from "./Private/PrivateRoutes";
import OwnerListing from "../../Pages/Admin/OwnerListingPage/OwnerListingPage";
import KycListingPage from "../../Pages/Admin/KycListingPage/KycListingPage";
import PropertyManagementPage from "../../Pages/Admin/PropertyManagementPage/PropertyManagementPage";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      
      <Route path="/" element={<AdminLayout />}>      
        <Route path="" element={<PrivateRoutes />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<UserListing />} />
          <Route path="owners" element={<OwnerListing />} />
          <Route path="kycs" element={<KycListingPage />} />
          <Route path="properties" element={<PropertyManagementPage />} />
        </Route>
      </Route>

    </Routes>
  );
};

export default AdminRouter;
