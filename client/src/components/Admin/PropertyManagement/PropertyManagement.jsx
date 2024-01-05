import React, { useEffect, useState } from "react";
import {
  usePropertyApprovalMutation,
  usePropertyManagementMutation,
} from "../../../Redux/Slices/adminApi/adminApislice";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import { Button } from "@material-tailwind/react";

const PropertyManagement = () => {
  const [getPropertiesCall] = usePropertyManagementMutation();
  const [propertyApprovalCall] = usePropertyApprovalMutation();
  const [properties, setProperties] = useState([]);

  const fetchData = async () => {
    try {
      const result = await getPropertiesCall().unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        setProperties(result.properties);
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  const handleApproval = async (e, option, id) => {
    e.preventDefault();
    try {
      const res = await propertyApprovalCall({ option, id }).unwrap();
      if (res.error) {
        generateError(res.error);
      } else {
        setProperties(res.properties);
        generateSuccess(res.message);
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPDF = (property) => {
    if (property?.doc) {
      window.open(property.doc, "_blank");
    }
  };

  return (
    <div className="border bg-white rounded-md shadow-xl">
      <div className=" border-t border-stroke py-4 px-4 flex md:px-6 2xl:px-7 justify-between ">
        <div className=" flex items-center justify-center w-full">
          <p className="font-medium">Property Name</p>
        </div>
        <div className=" flex items-center justify-center w-full">
          <p className="font-medium">Property Type</p>
        </div>
        <div className=" flex items-center justify-center w-full">
          <p className="font-medium">Document</p>
        </div>
        <div className=" flex items-center justify-center w-full">
          <p className="font-medium">Rent Amount</p>
        </div>
        <div className=" flex items-center justify-center w-full">
          <p className="font-medium">Aprroval</p>
        </div>
        <div className=" flex items-center justify-center w-full">
          <p className="font-medium">Manage</p>
        </div>
      </div>

      {properties.map((property) => {
        return (
          <div
            className=" flex justify-between border-t h-32 border-stroke py-4 px-4 dark:border-strokedark  2xl:px-7 w-full"
            key={property._id}
          >
            <div className="flex justify-center items-center w-full">
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                <div className="h-12 w-16">
                  <img
                    className="rounded-md h-full w-16"
                    src={property.ImageUrls[0]}
                    alt="Product"
                  />
                </div>
                <p className="text-sm text-black ">{property.property_name}</p>
              </div>
            </div>
            <div className="flex items-center justify-center w-full">
              <p className="text-sm text-black ">{property.property_type}</p>
            </div>
            <div className="flex items-center justify-center w-full">
              <div className="h-12 w-16">
                {/* Your PDF display component, or you can just use the button */}
                <button className="rounded-md h-full w-16" onClick={()=>openPDF(property)}>
                  Open PDF
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <p className="text-sm text-black ">{`₹${property.property_rent}`}</p>
            </div>
            <div className="jus flex justify-center items-center w-full">
              {property.isApproved ? (
                <IoMdCheckmarkCircleOutline className="h-6 w-6 text-green-400" />
              ) : (
                <IoMdCloseCircleOutline className="h-6 w-6  text-red-500 rounded-xl" />
              )}
            </div>
            <div className="flex justify-center items-center w-full gap-2">
              {!property.isApproved ? (
                <Button
                  onClick={(e) => handleApproval(e, true, property._id)}
                  className=" border text-xs hover:bg-green-600 hover:text-white font-semibold hover:drop-shadow-xl bg-white text-black border-gray-400 rounded py-2 px-4"
                >
                  Approve
                </Button>
              ) : (
                <Button
                  onClick={(e) => handleApproval(e, false, property._id)}
                  className=" border text-xs hover:bg-red-600 hover:text-white font-semibold hover:drop-shadow-xl bg-white text-black border-gray-400 rounded py-2 px-4"
                >
                  Disappove
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyManagement;
