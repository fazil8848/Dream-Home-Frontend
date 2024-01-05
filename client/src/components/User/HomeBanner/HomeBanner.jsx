import React from "react";

function HomeBanner() {
  return (
    <>
      <div className="relative bg-bannerImg bg-cover bg-center h-128 flex items-center">
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold flex-row" style={{color: "lightgrey"}}>
              The Best Proerty Rental Website For You
            </h1>
            <p className="text-lg font-medium " style={{color: "lightgrey"}}>
              {" "}
              We provide you the best service for renting your property  <br /> and <br />to rent
              a property
            </p>
          </div>
          <div className="bg-white h-12 w80">
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeBanner;
