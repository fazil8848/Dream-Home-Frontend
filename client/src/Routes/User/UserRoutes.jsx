import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../../Pages/User/HomePage/HomePage.jsx";
import LoginPage from "../../Pages/User/LoginPage/LoginPage.jsx";
import SignupPage from "../../Pages/User/SignupPage/SignupPage.jsx";
import Layout from "../../Layouts/Layout.jsx";
import PrivateRoutes from "./Private/PrivateRoutes.jsx";
import SinglePropertyPage from "../../Pages/User/SinglePropertyPage/SinglePropertyPage.jsx";
import UserProfilePage from "../../Pages/User/ProfilePage/ProfilePage.jsx";
import BookingPage from "../../Pages/User/BookingPage/BookingPage.jsx";
import ChatPage from "../../Pages/User/ChatPage/ChatPage.jsx";
import BookingCompletedPage from "../../Pages/User/BookingCompletedPage/BookingCompletedPage.jsx";
import PropertyListingPage from "../../Pages/User/PropertyListingPage/PropertyListingPage.jsx";
import BookingManagment from "../../Pages/User/BookingManagment/BookingManagment.jsx";
import ReservationManagement from "../../Pages/User/ReservationManagement/ReservationManagement.jsx";
import ForOwners from "../../Pages/User/ForOwners/ForOwners.jsx";
import BlogsPage from "../../Pages/User/BlogsPage/BlogsPage.jsx";
import VideoCallpage from "../../Pages/User/VideoCallPage/VideoCallpage.jsx";
import NotificationPage from "../../Pages/User/NotificationPage/NotificationPage.jsx";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="properties" element={<PropertyListingPage />} />
        <Route path="property/:id" element={<SinglePropertyPage />} />
        <Route path="ownerBenefiets" element={<ForOwners />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="" element={<PrivateRoutes />}>
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="booking/:id" element={<BookingPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:ownerId" element={<ChatPage />} />
          <Route path="reservations" element={<ReservationManagement />} />
          <Route path="bookings" element={<BookingManagment />} />
          <Route
            path="bookingSuccessful/:bookingId"
            element={<BookingCompletedPage />}
          />
          <Route path="reservations" element={<BookingCompletedPage />} />
          <Route path="videocall/:roomID" element={<VideoCallpage />} />
          <Route path="notifications" element={<NotificationPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRouter;
