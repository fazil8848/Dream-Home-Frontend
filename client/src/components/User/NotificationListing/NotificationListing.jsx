import React from "react";
import { useSocket } from "../../../Context/SocketContext";
import { Link } from "react-router-dom";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import { useMarkNotificationAsReadMutation } from "../../../Redux/Slices/userApi/usersApiSlice";
import { useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";

const NotificationListing = () => {
  const { notification, setNotification } = useSocket();
  const [markAsReadCall] = useMarkNotificationAsReadMutation();
  const { userInfo } = useSelector((state) => state.user);
  const userId = userInfo._id;

  const handleMarkRead = async (id) => {
    try {
      const result = await markAsReadCall({ id, userId }).unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        console.log(result);
        generateSuccess(result.message);
        setNotification(result.notifications);
      }
    } catch (error) {
      console.error(error);
      generateError(error.message);
    }
  };
  return (
    <>
      <div className="w-screen flex justify-center py-10 min-h-screen">
        <div className="w-full flex flex-col gap-2 lg:w-1/3 md:w-1/2 bg-white border rounded-md shadow-lg h-[36rem] p-10 ">
          <div className="mb-5">
            <h3 className="text-xl">Notifications</h3>
          </div>
          <div className="overflow-y-auto h-full border-y rounded-md">
            {notification.length > 0 ? (
              notification.map((noti, i) => (
                <div
                  className={
                    noti.read
                      ? `h-16 p-2 w-full border rounded-md shadow-lg flex justify-between items-center gap-4 px-2`
                      : `h-16 p-2 w-full bg-blue-gray-100 border rounded-md shadow-lg flex justify-between px-2 items-center gap-4`
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
                  <Button
                    className="w-1/3 "
                    onClick={() => handleMarkRead(noti._id)}
                  >
                    {noti.read ? "Read" : "Mark Read"}
                  </Button>
                  {noti.link && (
                    <Button className=" ">
                      <Link to={noti.link}>Join</Link>
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p>No Notifications Available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationListing;
