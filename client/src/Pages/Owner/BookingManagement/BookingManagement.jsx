import React, { useEffect, useState } from "react";
import { useGetBookingsOwnerMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { generateError } from "../../../components/Dependencies/toast";
import { useSelector } from "react-redux";
import BookingListing from "../../../components/Owner/BookingListing/BookingListing";

const BookingManagement = () => {
  const { ownerInfo } = useSelector((state) => state.owner);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [getBookingsCall] = useGetBookingsOwnerMutation();

  const fetchEnquiries = async () => {
    setBookingsLoading(true);
    try {
      const result = await getBookingsCall(ownerInfo._id).unwrap();
      console.log(result);
      if (result.error) {
        generateError(result.error);
      } else {
        setBookings(result.bookings);
      }
    } catch (error) {
      generateError(error.message);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <>
      <BookingListing
        bookingsLoading={bookingsLoading}
        bookings={bookings}
        ownerInfo={ownerInfo}
        setBookings={setBookings}
      />
    </>
  );
};

export default BookingManagement;
