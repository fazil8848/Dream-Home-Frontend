import React, { useState } from "react";
import HomeBanner from "../../../components/User/HomeBanner/HomeBanner";
import HomeCards from "../../../components/User/HomeCards/HomeCards";
import { Loader } from "../../../components/Dependencies/Loader/Loader";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <Loader />}
      <HomeBanner />
      <div className="xl:px-40">
        <HomeCards setLoading={setLoading} />
      </div>
    </>
  );
};

export default HomePage;
