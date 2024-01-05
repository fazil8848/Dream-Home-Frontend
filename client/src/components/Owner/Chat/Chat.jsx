import React, { useEffect, useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { Skeleton } from "@mui/material";
import { BiSearch } from "react-icons/bi";
import { GiConversation } from "react-icons/gi";
import { useParams } from "react-router-dom";

import Conversations from "../Conversations/Conversations";
import MessageContainer from "../MessageContainer/MessageContainer";
import { generateError } from "../../Dependencies/toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setGlobalOwnerConversations,
  setSelectedOwnerConversation,
} from "../../../Redux/Slices/chatSlices/userChatSlice";
import {
  useGetClickedUserMutation,
  useGetOwnerConversationsMutation,
} from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { useSocket } from "../../../Context/SocketContext";

const Chat = () => {
  const { onlineUsers, socket } = useSocket();
  const { ownerInfo } = useSelector((state) => state.owner);
  const userId = ownerInfo._id;
  const [conversations, setConversations] = useState([]);
  const [conversationLoading, setConversationsLoading] = useState(false);
  const selectedChat = useSelector(
    (state) => state.chat.selectedOwnerConversation
  );
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const allConversations = useSelector(
    (state) => state.chat.ownerConversations
  );
  const [getConversationsCall] = useGetOwnerConversationsMutation();
  const [getClickedUserCall] = useGetClickedUserMutation();

  const { customerId } = useParams();

  const fetchConversations = async () => {
    try {
      setConversationsLoading(true);
      const result = await getConversationsCall(userId).unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        dispatch(setGlobalOwnerConversations(result.conversations));
        setConversations(result.conversations);
      }
    } catch (error) {
      generateError(error.message);
    } finally {
      setConversationsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    setConversations(allConversations);
  }, [allConversations]);

  const fetchClickedUser = async () => {
    try {
      const result = await getClickedUserCall({ customerId }).unwrap();

      if (result.error) return generateError(result.error);

      const conversationExists = conversations.find(
        (conv) => conv.participants[0]._id === result.user._id
      );

      if (result.user) {
        if (conversationExists) {
          // dispatch(
          //   setSelectedOwnerConversation({
          //     mock: conversationExists.mock,
          //     _id: conversationExists._id,
          //     ownerId: result.user._id,
          //     ownerName: result.user.fullName,
          //     profilePic: result.user.profilePic,
          //   })
          // );
        } else {
          const mockConversation = {
            mock: true,
            lastMessage: {
              text: "",
              sender: "",
            },
            _id: Date.now(),
            participants: [
              {
                _id: result.user._id,
                fullName: result.user.fullName,
                profilePic: result.user.profilePic,
              },
            ],
          };

          setConversations([...conversations, mockConversation]);
        }
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  // useEffect(() => {
  //   if (!socket) {
  //     return;
  //   }

  //   const handleNewMessage = (newMessage) => {
  //     if (!selectedChat || selectedChat._id !== newMessage.conversationId) {
  //       if (!notifications.includes(newMessage)) {
  //         setNotifications([newMessage, ...notifications]);
  //       }
  //     } else {
  //     }
  //   };

  //   socket.on("newMessage", handleNewMessage);
  //   return () => {
  //     socket.off("newMessage", handleNewMessage);
  //   };
  // }, [socket, selectedChat, setNotifications]);

  useEffect(() => {
    if (customerId) {
      fetchClickedUser();
    }
  }, [customerId, conversations]);

  const handleNewConversation = async (data) => {
    try {
      setMessages([...messages, data.newMessage]);
      setConversations([...conversations, data.newConversation]);
    } catch (error) {
      console.log(error);
      generateError(error.message);
    }
  };

  useEffect(() => {
    socket?.on("newConversation", handleNewConversation);
    return () => {
      socket?.off("newConversation", handleNewConversation);
    };
  }, [socket]);

  return (
    <>
      <div className="flex justify-center">
        <div className="py-4 w-full md:w-[90%] lg:w-[850px] p1 md:p-4 border shadow-xl mt-4 rounded-md">
          <div className="flex flex-col md:flex-row gap-4 max-w-full mx-auto">
            <span className="lg:w-[300px] p-3 gap-2 flex-col mx-auto">
              <Typography className="">Your Conversations</Typography>
              <form>
                <Typography className="flex items-center gap-2">
                  <Input type="text" placeholder="search for the user" />
                  <Button className="border bg-black hover:bg-white hover:text-black">
                    <BiSearch size={16} />
                  </Button>
                </Typography>
              </form>

              <div className="overflow-y-auto sm:h-[200px] md:h-[465px] card">
                {conversationLoading &&
                  [0, 1, 2, 3, 4].map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-center rounded-md p-1"
                    >
                      <div>
                        <Skeleton
                          animation="pulse"
                          variant="circular"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="w-full">
                        <Skeleton animation="pulse" width={90} height={20} />
                        <Skeleton animation="pulse" width={"90%"} height={16} />
                      </div>
                    </div>
                  ))}

                <div className="my-2">
                  {Array.isArray(conversations) &&
                    conversations.map((conversation, i) => (
                      <Conversations
                        isOnline={onlineUsers.includes(
                          conversation.participants[0]._id
                        )}
                        conversation={conversation}
                        userId={userId}
                        key={i}
                      />
                    ))}
                </div>
              </div>
            </span>
            {!selectedChat ? (
              <span className="w-[300px] sm:w-full border mx-auto bg-blue-gray-50 rounded-md flex flex-col items-center justify-center">
                <GiConversation size={100} />
                <Typography className="text-lg">
                  {" "}
                  Select a conversation to start texting
                </Typography>
              </span>
            ) : (
              <MessageContainer setMessages={setMessages} messages={messages} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
