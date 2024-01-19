import React, { useState } from "react";
import { useSocket } from "../../../Context/SocketContext";
import { Link, useNavigate } from "react-router-dom";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import { useMarkNotificationAsReadMutation } from "../../../Redux/Slices/userApi/usersApiSlice";
import { useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import { Loader } from "../../Dependencies/Loader/Loader";

const NotificationListingOwner = () => {
  const navigate = useNavigate();
  const { ownerNotification, setOwnerNotification } = useSocket();
  const [markAsReadCall] = useMarkNotificationAsReadMutation();
  const { ownerInfo } = useSelector((state) => state.owner);
  const userId = ownerInfo._id;
  const [loading, setLoading] = useState(false);

  const handleMarkRead = async (id) => {
    setLoading(true);
    try {
      const result = await markAsReadCall({ id, userId }).unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        console.log(result);
        generateSuccess(result.message);
        setOwnerNotification(result.notifications);
      }
    } catch (error) {
      console.error(error);
      generateError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <Loader />}
      <div className="w-screen flex justify-center py-10 min-h-screen">
        <div className="w-full flex flex-col gap-2 lg:w-1/3 md:w-3/4 bg-white border rounded-md shadow-lg h-fit p-10">
          <div className="mb-5">
            <h3 className="text-xl">Notifications</h3>
          </div>
          {ownerNotification.length > 0 ? (
            ownerNotification.map((noti, i) => (
              <div
                className={
                  noti.read
                    ? `h-16 p-2 w-full border rounded-md shadow-lg flex justify-between items-center gap-4 px-2`
                    : `h-16 p-2 w-full bg-blue-gray-100 border rounded-md shadow-lg flex justify-between items-center gap-4`
                }
                key={i}
              >
                <div className=" h-full rounded-full">
                  <img
                    src={noti.sender?.profilePic}
                    alt="img"
                    className="rounded-full w-[3.5rem] h-full"
                  />
                </div>
                <div className="w-2/3 ">
                  <p>{noti.message}</p>
                </div>
                {noti.read ? (
                  <div
                    className="w-1/3 text-green-500"
                    onClick={() => handleMarkRead(noti._id)}
                  >
                    Read
                  </div>
                ) : (
                  <Button
                    className="bg-white hover:bg-black text-black hover:text-white"
                    onClick={() => handleMarkRead(noti._id)}
                  >
                    Mark Read
                  </Button>
                )}

                {noti.link && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(noti.link);
                    }}
                    className={
                      " bg-white hover:bg-black text-black hover:text-white"
                    }
                  >
                    View
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p>No Notifications Available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationListingOwner;
