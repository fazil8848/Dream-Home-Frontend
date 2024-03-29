import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { Avatar, Divider, Skeleton } from "@mui/material";
import { GoVerified } from "react-icons/go";
import Message from "../Message/Message";
import MessageInput from "../MessageInput/MessageInput";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetMessagesMutation,
  useUpdateMessageStatusUserMutation,
} from "../../../Redux/Slices/userApi/usersApiSlice";
import { generateError } from "../../Dependencies/toast";
import { useSocket } from "../../../Context/SocketContext";
import { setGlobalUserConversations } from "../../../Redux/Slices/chatSlices/userChatSlice";
import { Link } from "react-router-dom";
import { MdVideoCall } from "react-icons/md";

const MessageContainer = ({ messages, setMessages }) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { userInfo } = useSelector((state) => state.user);
  const selectedChat = useSelector(
    (state) => state.chat.selectedUserConversation
  );
  const [getMessagesCall] = useGetMessagesMutation();
  const [messagesLoading, setMessagesLoading] = useState(false);
  const userId = userInfo._id;
  const ownerId = selectedChat.ownerId;
  const allConversations = useSelector((state) => state.chat.conversations);
  const [updateMessageCall] = useUpdateMessageStatusUserMutation();

  useEffect(() => {
    if (!allConversations) {
      return;
    }

    const handleNewMessage = async (message) => {
      console.log(message);
      if (message.conversationId === selectedChat._id) {
        console.log(message, "message");
        const result = await updateMessageCall(message._id).unwrap();
        if (result.error) {
          generateError(result.error);
        } else {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      }

      const updatedConversations = allConversations.map((conversation) => {
        if (conversation._id === selectedChat._id) {
          return {
            ...conversation,
            lastMessage: {
              text: message.text,
              sender: message.sender,
            },
          };
        }
        return conversation;
      });

      dispatch(setGlobalUserConversations(updatedConversations));
    };

    const handleReadMessage = async (readMessage) => {
      console.log(readMessage, "messageRead");
      if (readMessage.length > 1) {
        setMessages(readMessage);
      } else {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message._id === readMessage._id ? readMessage : message
          )
        );
      }
    };

    socket?.on("newMessage", handleNewMessage);
    socket?.on("messageRead", handleReadMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("messageRead", handleReadMessage);
    };
  }, [socket]);

  const fetchMesssages = async () => {
    try {
      if (selectedChat.mock) {
        setMessages([]);
        return;
      }
      setMessagesLoading(true);
      const result = await getMessagesCall({
        userId,
        ownerId,
      }).unwrap();
      if (result.error) {
        // generateError(result.error);
      } else {
        setMessages(result.messages);
      }
    } catch (error) {
      generateError(error.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchMesssages();
  }, [selectedChat]);

  return (
    <>
      <span className="w-[300px] sm:w-full border mx-auto bg-blue-gray-50 rounded-md">
        <div className="px-4 flex items-center justify-between h-16 gap-2">
          <div className="flex">
            <Avatar src={selectedChat.profilePic} sizes="sm" />
            <Typography className="flex items-center">
              {selectedChat.ownerName} <GoVerified className="w-4 h-4 ml-1" />
            </Typography>
          </div>
          <div>
            <Link to={`/videocall/${ownerId}`} className="h-full">
              <MdVideoCall size={30} />
            </Link>
          </div>
        </div>
        <Divider />

        <div className="flex flex-col p-4 gap-4 my-4 h-[400px] overflow-y-auto">
          {messagesLoading &&
            [0, 1, 2, 3, 4, 5].map((_, i) => (
              <div
                key={i}
                className={`flex gap-2 items-center p-1 rounded-md ${
                  i % 2 === 0 ? "self-start" : "self-end"
                }`}
              >
                {i % 2 === 0 && (
                  <Skeleton
                    animation="pulse"
                    variant="circular"
                    width={50}
                    height={50}
                  />
                )}
                <div className="flex flex-col gap-2">
                  <Skeleton height={"8px"} width={"250px"} />
                  <Skeleton height={"8px"} width={"250px"} />
                  <Skeleton height={"8px"} width={"250px"} />
                </div>
                {i % 2 !== 0 && (
                  <Skeleton
                    animation="pulse"
                    variant="circular"
                    width={50}
                    height={50}
                  />
                )}
              </div>
            ))}

          {!messagesLoading &&
            messages.map((message, i) => (
              <Message
                message={message}
                ownMessage={message.sender === userId}
                key={i}
              />
            ))}
        </div>
        <MessageInput setMessages={setMessages} />
      </span>
    </>
  );
};

export default MessageContainer;
