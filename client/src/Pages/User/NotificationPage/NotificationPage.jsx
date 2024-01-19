import React, { useState } from "react";
import NotificationListing from "../../../components/User/NotificationListing/NotificationListing";

const NotificationPage = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <Loader />}
      <NotificationListing />
    </>
  );
};

export default NotificationPage;
