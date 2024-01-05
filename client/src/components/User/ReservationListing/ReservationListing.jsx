import React, { useEffect, useState } from "react";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import { useSelector } from "react-redux";
import {
  useCancelReservationMutation,
  useGetReservationsMutation,
} from "../../../Redux/Slices/userApi/usersApiSlice";
import { Link } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { Button } from "@material-tailwind/react";

const ReservationListing = () => {
  const [getReservetionsCall] = useGetReservationsMutation();
  const [cancelReservationCall] = useCancelReservationMutation();
  const { userInfo } = useSelector((state) => state.user);
  const [reservations, setReservations] = useState([]);
  const fetchReservations = async () => {
    try {
      const result = await getReservetionsCall(userInfo._id).unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        console.log(result.reservations);
        setReservations(result.reservations);
      }
    } catch (error) {
      console.log(error);
      generateError(error.message);
    }
  };

  const handleCancel = async (e, id) => {
    e.preventDefault();
    try {
      const result = await cancelReservationCall({
        id,
        user: userInfo._id,
      }).unwrap();
      console.log(result);
      if (result.error) {
        generateError(result.error);
      } else {
        setReservations(result.reservations);
        generateSuccess(result.message);
      }
    } catch (error) {
      console.log(error);
      generateError(error.message);
    }
  };

  useEffect(() => {
    fetchReservations();
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
                <th className="px-4 py-1 border-b">Property</th>
                <th className="px-4 py-1 border-b">Owner Name</th>
                <th className="px-4 py-1 border-b">Owner Email</th>
                <th className="px-4 py-1 border-b">Owner Mobile</th>
                <th className="px-4 py-1 border-b">Token Amount</th>
                <th className="px-4 py-1 border-b">Contact</th>
                <th className="px-4 py-1 border-b">Manage</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id} className="text-center">
                  <td className="py-2 px-4 border-b">
                    <Link to={`/property/${reservation.property._id}`}>
                      {reservation.property.property_name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {reservation.owner.fullName}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {reservation.owner.email}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {reservation.owner.mobile}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {reservation.tokenAmount}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link to={`/chat/${reservation.owner._id}`}>
                      <SiGooglemessages size={32} />
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {reservation.is_cancelled ? (
                      <p className="text-red-500">Cancelled</p>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => handleCancel(e, reservation._id)}
                        className="bg-black hover:bg-white hover:text-black hover:border"
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReservationListing;
