import React, { useEffect, useState } from "react";
import { useGetEnquiriesMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { generateError } from "../../../components/Dependencies/toast";
import EnquiryListing from "../../../components/Owner/EnquiryListing/EnquiryListing";
import { useSelector } from "react-redux";

const EnquiryListingPage = () => {
  const { ownerInfo } = useSelector((state) => state.owner);
  const [enqiuries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);

  const [getEnquiriesCall] = useGetEnquiriesMutation();

  const fetchEnquiries = async () => {
    setEnquiriesLoading(true);
    try {
      const result = await getEnquiriesCall(ownerInfo._id).unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        setEnquiries(result.enquiries);
      }
    } catch (error) {
      generateError(error.message);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <>
      <EnquiryListing
        enquiriesLoading={enquiriesLoading}
        enqiuries={enqiuries}
        ownerInfo={ownerInfo}
        setEnquiries={setEnquiries}
      />
    </>
  );
};

export default EnquiryListingPage;
