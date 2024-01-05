import React from "react";
import Hourglass from "../../Dependencies/Hourglass/Hourglass";
import SuccessTick from "../../Dependencies/Successtik/Successtik";

const VerificationSpinner = ({ msg }) => {
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex justify-center items-center w-80 h-64 bg-white rounded-md shadow-2xl">
        {!msg ? (
          <>
            <div className="flex-row text-center ">
              <p className=" w-40 mb-1 text-lg font-semibold">Please Wait...</p>
              <p className="w-40 mb-8 ">your account is being verified.</p>
              <div className="flex items-center justify-center animate-bounce">
                <div className="w-20 h-20 border-t-4 border-b-4 border-blue-100 rounded-full animate-spin "></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-row text-center ">
              <p className=" w-40 mb-1 text-lg font-semibold ">Success..</p>
              <p className="w-40 mb-8 ">Account Verified Successfully.</p>
              <div className="flex items-center justify-center ">
                <SuccessTick />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationSpinner;
