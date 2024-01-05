import React, { useEffect, useState } from "react";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import { useSelector } from "react-redux";
import {
  useCancelReservationMutation,
  useGetBookingsMutation,
} from "../../../Redux/Slices/userApi/usersApiSlice";
import { Link } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { Button } from "@material-tailwind/react";

const BookingManagementListing = () => {
  const [getBookingsCall] = useGetBookingsMutation();
  // const [cancelReservationCall] = useCancelReservationMutation();
  const { userInfo } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const result = await getBookingsCall(userInfo._id).unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        console.log(result);
        setBookings(result.bookings);
      }
    } catch (error) {
      console.log(error);
      generateError(error.message);
    }
  };

  const handleCancel = async (e, id) => {
    e.preventDefault();
    // try {
    //   const result = await cancelReservationCall({
    //     id,
    //     user: userInfo._id,
    //   }).unwrap();
    //   console.log(result, "result");
    //   if (result.error) {
    //     generateError(result.error);
    //   } else {
    //     setBookings(result.bookings);
    //     generateSuccess(result.message);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   generateError(error.message);
    // }
  };

  useEffect(() => {
    fetchBookings();
  }, [userInfo]);
  return (
    <>
      <div className="rounded-md border border-stroke bg-white shadow-default  h-full">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark flex gap-4">
          <Link to={"/profile"} className="font-medium text-black">
            Profile
          </Link>
          <Link to={"/bookings"} className="font-medium text-black">
            Bookings
          </Link>
          <Link to={"/reservations"} className="font-medium text-black">
            Reservations
          </Link>
        </div>
        <div className="container mx-auto overflow-x-auto border border-gray-300 rounded-lg shadow-xl">
          <table className="min-w-full bg-white ">
            <thead className="text-center">
              <tr>
                <th className="px-4 py-3 border-b">Property</th>
                <th className="px-4 py-3 border-b">Owner Name</th>
                <th className="px-4 py-3 border-b">Owner Email</th>
                <th className="px-4 py-3 border-b">Owner Mobile</th>
                <th className="px-4 py-3 border-b">Token Amount</th>
                <th className="px-4 py-3 border-b">Contact</th>
                {/* <th className="px-4 py-3 border-b">Manage</th> */}
              </tr>
            </thead>
            <tbody className="w-full">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id} className="text-center">
                    <td className="py-2 px-4 border-b ">
                      <Link
                        className="flex items-center gap-2"
                        to={`/property/${booking.property._id}`}
                      >
                        <img
                          className="h-20 "
                          src={booking.property.ImageUrls[0]}
                          alt="image"
                        />
                        {booking.property.property_name}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {booking.owner.fullName}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {booking.owner.email}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {booking.owner.mobile}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {booking.tokenAmount}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Link to={`/chat/${booking.owner._id}`}>
                        <SiGooglemessages size={32} />
                      </Link>
                    </td>
                    {/* <td className="py-2 px-4 border-b">
                      {booking.is_cancelled ? (
                        <p className="text-red-500">Cancelled</p>
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => handleCancel(e, booking._id)}
                          className="bg-black hover:bg-white hover:text-black hover:border"
                        >
                          Cancel
                        </Button>
                      )}
                    </td> */}
                  </tr>
                ))
              ) : (
                <div className="w-full h-16 flex justify-center items-center">
                  <p className="mx-auto"> No Bookings Avalable</p>
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BookingManagementListing;
