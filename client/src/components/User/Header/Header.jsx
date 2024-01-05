import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaUserTie } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { BiLogIn } from "react-icons/bi";
import { BsFillBuildingsFill } from "react-icons/bs";
import { BsFillChatQuoteFill } from "react-icons/bs";
import {
  useGetNotificationsMutation,
  useLogoutMutation,
} from "../../../Redux/Slices/userApi/usersApiSlice";
import { logout } from "../../../Redux/Slices/authSlice";
import { generateError } from "../../Dependencies/toast";
import { VscBell } from "react-icons/vsc";
import {
  setUserOffline,
  setUserOnline,
} from "../../../Redux/Slices/chatSlices/userChatSlice";
import { useSocket } from "../../../Context/SocketContext";

const Header = () => {
  const { socket, notification, setNotification } = useSocket();
  const { userInfo } = useSelector((state) => state.user);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [logoutCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getNotificationsCall] = useGetNotificationsMutation();
  const [unread, setUnread] = useState(false);

  const logoutHandlder = async () => {
    try {
      const res = await logoutCall().unwrap();
      if (res.error) {
        generateError(res.error);
      } else {
        dispatch(logout());
        dispatch(setUserOffline(null));
        navigate("/");
      }
    } catch (error) {
      generateError(err?.data?.message || err.error);
    }
  };

  const fetchNotifications = async () => {
    try {
      if (userInfo) {
        const userId = userInfo?._id;
        const result = await getNotificationsCall(userId).unwrap();
        if (result.error) {
          generateError(result.error);
        } else {
          setNotification(result.notifications);
        }
      }
    } catch (error) {
      console.error(error);
      generateError(error.message);
    }
  };

  useEffect(() => {
    const handleNewNotification = async (notifications) => {
      try {
        console.log(notifications);
        setNotification(notifications);
      } catch (error) {
        console.error(error);
        generateError(error.message);
      }
    };
    socket?.on("newNotification", handleNewNotification);
    return () => {
      socket?.off("newNotification", handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    fetchNotifications();
  }, [userInfo]);

  useEffect(() => {
    dispatch(setUserOnline(userInfo));
  }, [userInfo]);

  useEffect(() => {
    const notread = notification.filter((not) => not.read === false);
    setUnread(notread.length > 0);
  }, [notification]);

  return (
    <div>
      <header className="bg-white w-screen z-50 shadow-lg ">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-2.5 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <NavLink to={"/"} className="-m-1.5 p-1.5">
              <img
                className="h-10 w-auto "
                src="https://res.cloudinary.com/dn6anfym7/image/upload/v1698481855/dreamHome/crmkxhhd0fhhcb8kbk0x.png"
                alt="logo"
              />
            </NavLink>
          </div>

          <div
            className={` lg:flex lg:gap-x-12 ${isNavOpen ? "block" : "hidden"}`}
          >
            <ul className="list-none lg:flex   " aria-hidden={!isNavOpen}>
              <li className="my-1">
                <NavLink
                  to="/properties"
                  className="text-sm font-semibold leading-6 hover:text-black hover:border hover:shadow-xl text-slate-900 p-5 w-full hover:bg-blue-gray-50"
                >
                  Properties
                </NavLink>
              </li>
              <li className="my-1">
                <NavLink
                  to={"/ownerBenefiets"}
                  className="text-sm font-semibold leading-6 hover:text-black hover:border hover:shadow-xl text-slate-900 p-5 w-full hover:bg-blue-gray-50"
                >
                  For Owners
                </NavLink>
              </li>
              {/* <li className="my-1">
                <NavLink
                  to={"/reservations"}
                  className="text-sm font-semibold leading-6 hover:text-black hover:border hover:shadow-xl text-slate-900 p-5 w-full hover:bg-blue-gray-50"
                >
                  Reservations
                </NavLink>
              </li> */}
              <li className="my-1">
                <NavLink
                  to="/blogs"
                  className="text-sm font-semibold leading-6 hover:text-black hover:border hover:shadow-xl text-slate-900 p-5 w-full hover:bg-blue-gray-50"
                >
                  Blogs
                </NavLink>
              </li>
            </ul>
          </div>

          <div className={`hidden lg:flex lg:flex-1 lg:justify-end `}>
            {userInfo ? (
              <>
                <NavLink
                  to="/chat"
                  className={`bg-White rounded p-2 text-coolblue border-1 border-grey`}
                >
                  <BsFillChatQuoteFill size={20} />
                </NavLink>
                <NavLink
                  to="/notifications"
                  className={`bg-White rounded p-2 text-coolblue border-1 border-grey`}
                >
                  {unread ? (
                    <img
                      className="h-6"
                      src="https://res.cloudinary.com/dn6anfym7/image/upload/v1704261832/dreamHome/icons/icons8-notification_ttmanm.gif"
                      alt="notification Bell"
                    />
                  ) : (
                    <VscBell size={20} />
                  )}
                </NavLink>
                <NavLink
                  to="/profile"
                  className={`flex justify-between gap-1 items-center text-sm font-semibold bg-White p-2 rounded leading-6 text-coolblue border-1 border-grey`}
                >
                  <FaUserTie size={20} />
                </NavLink>
                <NavLink
                  className={` p-2 rounded leading-6 text-black border-1 border-white`}
                  onClick={logoutHandlder}
                >
                  <FiLogOut size={20} />
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={`flex justify-between items-center text-sm font-semibold bg-White p-2 rounded leading-6 text-coolblue me-4 border-1 border-grey`}
                >
                  Log in
                  <span aria-hidden="true">
                    <BiLogIn />
                  </span>
                </NavLink>
                <NavLink
                  to="/owner/login"
                  className={`flex justify-between items-center text-sm font-semibold bg-blue-100 p-2 rounded leading-6 text-white border-1 border-white`}
                >
                  Post Property
                  <span aria-hidden="true">
                    <BsFillBuildingsFill className="mx-2" />
                  </span>
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
