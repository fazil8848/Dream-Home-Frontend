import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdVilla } from "react-icons/md";
import { useGetPropertiesMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { useSelector } from "react-redux";
import { generateError } from "../../Dependencies/toast";

const Properties = () => {
  const [getProperties] = useGetPropertiesMutation();
  const { ownerInfo } = useSelector((state) => state.owner);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getProperties({ id: ownerInfo._id }).unwrap();
        if (res.error) {
          generateError(res.error);
          return;
        } else {
          setProperties(res.properties);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getData();
  }, [getProperties, ownerInfo._id]);

  return (
    <>
      <div className="rounded-md border border-stroke bg-white shadow-default mb-4">
        <div className="py-3 px-4  flex items-center justify-between">
          <h4 className="text-xl font-semibold text-black ">Properties</h4>
          <Link
            to={"/owner/properties/addproperties"}
            className="flex justify-center font-semibold items-center bg-white gap-2 px-4 py-2 border border-gray-400 rounded-md hover:shadow-2xl hover:text-white hover:bg-blue-100"
          >
            <MdVilla /> Add
          </Link>
        </div>
      </div>
      {properties.map((property) => {
        return (
          <div
            key={property._id}
            className="bg-white rounded border shadow-md p-3 w-full flex gap-3 mb-3"
          >
            <div className="w-4/12 ">
              <img
                className="rounded w-full max-h-80 "
                src={property?.ImageUrls[0]}
                alt=""
              />
            </div>
            <div className="w-5/12">
              <div>
                <p className="font-semibold">{property.property_name}</p>
                <p className="font-semibold ">
                  {property.property_location.district},
                  {property.property_location.locality}
                </p>
                <p className="font-bold mt-1 mb-2">₹{property.property_rent}</p>
                <Link
                  to={`/owner/properties/editProperties/${property._id}`}
                  className="bg-blue-100 text-sm rounded px-2 py-1 text-white "
                >
                  More Actions ↓
                </Link>
              </div>
            </div>
            <div className=" w-3/12 flex justify-end">
              <div className="mt-10">
                <p className="border  border-sky-300 text-xs w-fit py-1 px-2 ">
                  FOR RENT
                </p>
                {property.isApproved ? (
                  <p className="text-green-500 font-medium">Approved</p>
                ) : (
                  <p className="text-red-500 font-medium">Not Approved</p>
                )}
                <p className="text-sm font-medium font-poppins text-gray-500">
                  POSTED ON:{" "}
                  {property.createdAt
                    ? new Date(property.createdAt).toISOString().slice(0, 10)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Properties;

{
  
}
