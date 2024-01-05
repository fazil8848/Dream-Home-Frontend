import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { IoMdSend } from "react-icons/io";
import { generateError } from "../../Dependencies/toast";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalOwnerConversations } from "../../../Redux/Slices/chatSlices/userChatSlice";
import { useSendOwnerMessageMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";

const MessageInput = ({ setMessages }) => {
  const allConversations = useSelector((state) => state.chat.ownerConversations);
  const { ownerInfo } = useSelector((state) => state.owner);
  const selectedChat = useSelector(
    (state) => state.chat.selectedOwnerConversation
  );
  const userId = ownerInfo._id;
  const ownerId = selectedChat.ownerId;
  const dispatch = useDispatch();

  const [messageText, setMessageText] = useState("");
  const [sendMessageCall] = useSendOwnerMessageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (messageText.trim() === "") {
        return;
      }
      const result = await sendMessageCall({
        ownerId,
        messageText,
        userId,
      }).unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        setMessages((messages) => [...messages, result]);

        const updatedConversations = allConversations.map((conversation) => {
          if (conversation._id === selectedChat._id) {
            return {
              ...conversation,
              lastMessage: {
                text: result.text,
                sender: result.sender,
              },
            };
          }
          return conversation;
        });

        // Dispatch the action to update the state
        dispatch(setGlobalOwnerConversations(updatedConversations));
        
        setMessageText("");
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="p-2 flex ">
          <Input
            label="type your message...."
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
            icon={<IoMdSend type="submit" onClick={handleSubmit} />}
            className="w-full py-1"
          />
        </div>
      </form>
    </>
  );
};


export default MessageInput;
