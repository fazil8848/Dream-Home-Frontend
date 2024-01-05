import React from "react";
import ReservationListing from "../../../components/User/ReservationListing/ReservationListing";

const ReservationManagement = () => {
  return (
    <>
      <div className="w-screen flex justify-center bg-gray-50 min-h-screen pt-10">
        <div className="w-full lg:w-8/12">
          <div className="w-full">
            <ReservationListing />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationManagement;
