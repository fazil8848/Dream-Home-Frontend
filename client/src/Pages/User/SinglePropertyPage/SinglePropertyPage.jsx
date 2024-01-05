import React, { useEffect, useState } from "react";
import PropertyDetails from "../../../components/User/PropertyDetails/PropertyDetails";
import { useGetSinglePropertyMutation } from "../../../Redux/Slices/userApi/usersApiSlice";
import { useParams } from "react-router-dom";
import RatingsAndReview from "../../../components/User/RatingsAndReview/RatingsAndReview";

const SinglePropertyPage = () => {
  const [property, setProperty] = useState();
  const [getSinglePropertyCall] = useGetSinglePropertyMutation();

  const { id } = useParams();

  const fetchProperty = async () => {
    try {
      const res = await getSinglePropertyCall(id).unwrap();
      setProperty(res.property);
    } catch (error) {
      throw new Error('System Error:- "Error While Fetching Property Data"');
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  if (!property) {
    return (
      <div className="border min-h-screen mb-10 p-3 flex items-center justify-center">
        <div className=" h-10">
          <div className="animate-spin h-20 w-20">
            <div className="h-full w-full border-4 border-t-blue-100 border-b-blue-100 rounded-[50%]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center mt-10 px-2 md:px-10 lg:px-30 xl:px-40">
        <PropertyDetails property={property} setProperty={setProperty} />
      </div>
      <div className="flex justify-center h-fit px-2 md:px-10 lg:px-30 xl:px-40">
        <RatingsAndReview property={property}/>
      </div>
    </>
  );
};

export default SinglePropertyPage;
