import React from "react";
import HomeBanner from "../../../components/User/HomeBanner/HomeBanner";
import HomeCards from "../../../components/User/HomeCards/HomeCards";

const HomePage = () => {
  return (
    <>
      <HomeBanner />
      <div className="xl:px-40">
        <HomeCards />
      </div>
    </>
  );
};

export default HomePage;
