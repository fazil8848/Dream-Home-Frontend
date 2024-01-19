import React, { useState } from "react";
import UserProfile from "../../../components/User/Profile/Profile";
import { Loader } from "../../../components/Dependencies/Loader/Loader";

const UserProfilePage = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <Loader />}
      <UserProfile loading={loading} setLoading={setLoading} />
    </>
  );
};

export default UserProfilePage;
