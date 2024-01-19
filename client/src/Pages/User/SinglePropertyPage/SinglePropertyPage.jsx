import React, { useEffect, useState } from "react";
import PropertyDetails from "../../../components/User/PropertyDetails/PropertyDetails";
import { useGetSinglePropertyMutation } from "../../../Redux/Slices/userApi/usersApiSlice";
import { useParams } from "react-router-dom";
import RatingsAndReview from "../../../components/User/RatingsAndReview/RatingsAndReview";
import { Loader } from "../../../components/Dependencies/Loader/Loader";

const SinglePropertyPage = () => {
  const [property, setProperty] = useState();
  const [loading, setLoading] = useState(false);

  const [getSinglePropertyCall] = useGetSinglePropertyMutation();

  const { id } = useParams();

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await getSinglePropertyCall(id).unwrap();
      setProperty(res.property);
    } catch (error) {
      throw new Error('System Error:- "Error While Fetching Property Data"');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  if (!property) {
    return (
      <div className="border min-h-screen mb-10 p-3 flex items-center justify-center">
        <div className=" h-10"></div>
      </div>
    );
  }

  return (
    <>
      {loading && <Loader />}
      <div className="flex justify-center mt-10 px-2 md:px-10 lg:px-30 xl:px-40">
        <PropertyDetails property={property} setProperty={setProperty} />
      </div>
      <div className="flex justify-center h-fit px-2 md:px-10 lg:px-30 xl:px-40">
        <RatingsAndReview property={property} />
      </div>
    </>
  );
};

export default SinglePropertyPage;
