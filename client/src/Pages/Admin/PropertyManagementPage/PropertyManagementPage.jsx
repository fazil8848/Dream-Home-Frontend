import React from "react";
import PropertyManagement from "../../../components/Admin/PropertyManagement/PropertyManagement";

const PropertyManagementPage = () => {
  return (
    <>
      <div>
        <div className="text-2xl font-medium font-poppins text-blue-100 py-3">
          Property Management
        </div>
        <div className="px-3">
          <PropertyManagement />
        </div>
      </div>
    </>
  );
};

export default PropertyManagementPage;
