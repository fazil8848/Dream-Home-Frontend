import { Avatar } from "@material-tailwind/react";
import { Typography } from "@mui/material";
import React from "react";
import { BsCheck2All } from "react-icons/bs";
import { useSelector } from "react-redux";

const Message = ({ ownMessage, message }) => {
  const selectedChat = useSelector(
    (state) => state.chat.selectedUserConversation
  );

  const { userInfo } = useSelector((state) => state.user);

  const formattedTime = message.createdAt
  ? new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(message.createdAt))
  : "";

  return (
    <div>
      {ownMessage ? (
        <div className="flex gap-2 float-right self-end ">
          <Typography
            maxWidth={"340px"}
            className="bg-blue-400 p-2 rounded-md rounded-br-none shadow-lg"
          >
            {message.text}
            <div className="flex self-end gap-2">
              {message.read ? (
                <BsCheck2All size={16} color="blue" />
              ) : (
                <BsCheck2All size={16} />
              )}
              <p className="text-xs">{formattedTime}</p>
            </div>
          </Typography>
          <Avatar src={userInfo.profilePic} width={"7"} height={"7"} />
        </div>
      ) : (
        <div className="flex gap-2">
          <Avatar src={selectedChat.profilePic} width={"7"} height={"7"} />
          <Typography
            maxWidth={"340px"}
            className="bg-white p-2 rounded-md rounded-bl-none shadow-lg"
          >
            {message.text}
            <div className="flex self-end">
              <p className="text-xs">{formattedTime}</p>
            </div>
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Message;
