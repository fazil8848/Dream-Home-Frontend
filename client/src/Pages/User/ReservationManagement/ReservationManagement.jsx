import React from "react";
import ReservationListing from "../../../components/User/ReservationListing/ReservationListing";
import { Loader } from "../../../components/Dependencies/Loader/Loader";

const ReservationManagement = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <Loader />}
      <div className="w-screen flex justify-center bg-gray-50 min-h-screen pt-10">
        <div className="w-full lg:w-8/12">
          <div className="w-full">
            <ReservationListing loading={loading} setLoading={setLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationManagement;
