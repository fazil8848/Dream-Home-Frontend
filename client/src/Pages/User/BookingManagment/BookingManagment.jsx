import React from "react";
import BookingManagementListing from "../../../components/User/BookingMangement/BookingManagement";

const BookingManagment = () => {
  return (
    <>
      <div className="w-screen flex justify-center bg-gray-50 min-h-screen pt-10">
        <div className="w-full lg:w-8/12">
          <div className="w-full">
            <BookingManagementListing />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingManagment;
