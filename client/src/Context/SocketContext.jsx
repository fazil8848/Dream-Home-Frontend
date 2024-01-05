import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notification, setNotification] = useState([]);
  const [ownerNotification, setOwnerNotification] = useState([]);
  const { userOnline } = useSelector((state) => state.chat);
  const { ownerOnline } = useSelector((state) => state.chat);

  useEffect(() => {
    const query = {};
    if (userOnline?._id) {
      query.userId = userOnline._id;
    }
    if (ownerOnline?._id) {
      query.ownerId = ownerOnline._id;
    }

    const newSocket = io("http://localhost:5000", {
      query,
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => newSocket.close();
  }, [userOnline?._id, ownerOnline?._id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        notification,
        setNotification,
        ownerNotification,
        setOwnerNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
