import { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, ZEGO_SECRET } from "../../../Constants/Contstants";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAddNotificationMutation } from "../../../Redux/Slices/userApi/usersApiSlice";

export default function VideoCall() {
  const { userInfo } = useSelector((state) => state.user);
  const { roomID } = useParams();
  const [link, setLink] = useState("");
  const [sendNotificationCall] = useAddNotificationMutation();

  useEffect(() => {
    let zp;

    const myMeeting = async (element) => {
      const appID = APP_ID;
      const serverSecret = ZEGO_SECRET;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userInfo._id,
        userInfo.name
      );

      setLink("/owner/videocall/" + roomID + "?roomID=" + roomID);

      zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Call link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    };

    const sendNotification = async () => {
      try {
        if (link === "") return;
        const data = {
          message: `Call From: ${userInfo.name}`,
          sender: userInfo._id,
          receiver: roomID,
          link,
        };
        await sendNotificationCall(data).unwrap();
      } catch (error) {
        console.log(error.message);
      }
    };

    const cleanup = () => {
      if (zp) {
        zp.leaveRoom(); // Leave the room when the component is unmounted
      }
    };

    myMeeting(document.querySelector("#myMeeting"));

    return cleanup;
  }, [roomID, userInfo, link, sendNotificationCall]);

  return <div id="myMeeting" style={{ width: "90vw", height: "90vh" }}></div>;
}
