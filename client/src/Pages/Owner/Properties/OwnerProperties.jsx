import React, { useEffect } from "react";
import OwnerNav from "../../../components/Owner/OwnerNav/OwnerNav";
import Properties from "../../../components/Owner/Properties/Properties";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OwnerProperties() {
  const { ownerInfo } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  useEffect(() => {
    if (!ownerInfo.kycAdded) {
      navigate("/owner/profile", { state: { kycAdded: true }});
    } else if (!ownerInfo.kycApproved) {
      navigate("/owner", { state: { kycApproved: true }});
    }
  }, [ownerInfo]);
  return (
    <>
      <Properties />
    </>
  );
}

export default OwnerProperties;
