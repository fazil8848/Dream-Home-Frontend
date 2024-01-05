import React from "react";
import { Routes, Route } from "react-router-dom";
import OwnerLayout from "../../Layouts/OwnerLayout";
import OwnerHome from "../../Pages/Owner/Home/OwnerHome";
import OwnerProperties from "../../Pages/Owner/Properties/OwnerProperties";
import PrivateRoutesOwner from "./Private/PrivateRoutesOwner";
import OwnerLoginPage from "../../Pages/Owner/Login/OwnerLogin";
import OwnerSignupPage from "../../Pages/Owner/Signup/OwnerSignupPage";
import ProfilePage from "../../Pages/Owner/ProfilePage/ProfilePage";
import KycPage from "../../Pages/Owner/KycPage/KycPage";
import AddPropertiesPage from "../../Pages/Owner/AddPropertiesPage/AddPropertiesPage";
import EditPropertiesPage from "../../Pages/Owner/EditPropertiesPage/EditPropertiesPage";
import ChatPage from "../../Pages/Owner/ChatPage/ChatPage";
import EnquiryListingPage from "../../Pages/Owner/EnquiryListingPage/EnquiryListingPage";
import BookingManagement from "../../Pages/Owner/BookingManagement/BookingManagement";
import VideoCallpageOwner from "../../Pages/Owner/VideoCallPage/VideoCallpage";
import NotificationPage from "../../Pages/Owner/NotificationPage/NotificationPage";

const OwnerRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<OwnerLoginPage />} />
      <Route path="signup" element={<OwnerSignupPage />} />
      <Route path="/" element={<OwnerLayout />}>
        <Route path="" element={<PrivateRoutesOwner />}>
          <Route index element={<OwnerHome />} />
          <Route path="properties" element={<OwnerProperties />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/kyc" element={<KycPage />} />
          <Route
            path="properties/addproperties"
            element={<AddPropertiesPage />}
          />
          <Route
            path="properties/editProperties/:id"
            element={<EditPropertiesPage />}
          />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:customerId" element={<ChatPage />} />
          <Route path="enquiries" element={<EnquiryListingPage />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="videocall/:roomID" element={<VideoCallpageOwner />} />
          <Route path="notifications" element={<NotificationPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default OwnerRoutes;
