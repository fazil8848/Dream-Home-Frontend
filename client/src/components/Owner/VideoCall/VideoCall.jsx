import { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, ZEGO_SECRET } from "../../../Constants/Contstants";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAddNotificationOwnerMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall() {
  const { ownerInfo } = useSelector((state) => state.owner);
  const { roomID } = useParams();
  const [link, setLink] = useState("");
  const [sendNotificationCall] = useAddNotificationOwnerMutation();

  let myMeeting = async (element) => {
    const appID = APP_ID;
    const serverSecret = ZEGO_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      ownerInfo._id,
      ownerInfo.name
    );

    setLink(
      "http://localhost:3000/videocall/6551e295fa910977a5e6bc35" +
        "?roomID=" +
        roomID
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
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
        reciever: roomID,
        link,
      };
      await sendNotificationCall(data).unwrap();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    sendNotification();
  }, [link]);

  return (
    <div ref={myMeeting} style={{ width: "100vw", height: "100vh" }}></div>
  );
}
