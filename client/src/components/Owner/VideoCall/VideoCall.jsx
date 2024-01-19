import { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, ZEGO_SECRET } from "../../../Constants/Contstants";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAddNotificationOwnerMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall() {
  const { ownerInfo } = useSelector((state) => state.owner);
  const { roomID } = useParams();
  const [link, setLink] = useState("");
  const [sendNotificationCall] = useAddNotificationOwnerMutation();

  useEffect(() => {
    let zp;

    const myMeeting = async (element) => {
      const appID = APP_ID;
      const serverSecret = ZEGO_SECRET;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        ownerInfo._id,
        ownerInfo.name
      );

      setLink("/videocall/" + roomID + "?roomID=" + roomID);

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
          message: `Call From: ${ownerInfo.name}`,
          sender: ownerInfo._id,
          receiver: roomID, // Fix typo in the property name
          link,
        };
        await sendNotificationCall(data).unwrap();
      } catch (error) {
        console.log(error.message);
      }
    };

    const cleanup = () => {
      if (zp) {
        zp.leaveRoom();
      }
    };

    myMeeting(document.querySelector("#myMeeting"));

    return cleanup;
  }, [roomID, ownerInfo, link, sendNotificationCall]);

  return <div id="myMeeting" style={{ width: "100vw", height: "100vh" }}></div>;
}
