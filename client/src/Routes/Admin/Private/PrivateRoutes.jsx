import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import React from 'react'

const PrivateRoutes = () => {
    const {adminInfo} = useSelector((state)=> state.admin);
  return adminInfo ? <Outlet/>: <Navigate to={'/admin/login'} replace />
}

export default PrivateRoutes
