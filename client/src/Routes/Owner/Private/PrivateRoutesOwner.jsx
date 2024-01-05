import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import React from 'react'

const PrivateRoutesOwner = () => {
    const {ownerInfo} = useSelector((state)=> state.owner)
  return ownerInfo ? <Outlet/> : <Navigate to={'/owner/login'} replace />
}

export default PrivateRoutesOwner
