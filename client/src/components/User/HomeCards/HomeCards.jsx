import React, { useEffect, useState } from "react";
import { GiBathtub } from "react-icons/gi";
import { SiBlueprint } from "react-icons/si";
import { IoIosBed } from "react-icons/io";
import { useGetPropertiesuserMutation } from "../../../Redux/Slices/userApi/usersApiSlice";
import { Link } from "react-router-dom";
import { generateError } from "../../Dependencies/toast";
import "./style.css";

export const HomeCards = () => {
  const [properties, setProperties] = useState(null);
  const [getPropertiesCall] = useGetPropertiesuserMutation();
  const fetchProperties = async () => {
    try {
      const res = await getPropertiesCall().unwrap();
      if (res.error) {
        generateError(res.error);
        return;
      } else {
        setProperties(res.properties);
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (!properties) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-10">
          <div className="animate-spin h-20 w-20">
            <div className="h-full w-full border-4 border-t-blue-100 border-b-blue-100 rounded-[50%]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="frame container mx-auto my-8 lg:px-8 ">
      <div className="main-section">
        <div className="flex flex-col md:flex-row justify-between items-center p-4">
          <div className="md:w-1/2 w-full mb-4 md:mb-0">
            <p className="text-2xl font-bold mb-2">
              Best Properties Available For You To Choose
            </p>
            <div className="h-1 bg-sky-500 w-12 my-2"></div>
            <p className="text-sm">
              Here is the list of properties for sale in Kerala, that include
              apartments, flats, office spaces, and houses for sale in Kerala.
            </p>
          </div>
          <Link
            to={"/properties"}
            className="text-blue-500 text-lg cursor-pointer border p-2 rounded bg-sky-50"
          >
            See all properties &#8594;
          </Link>
        </div>
        <div className=" xl:w-1\3  ">
          <div className="flex h-[33rem] card overflow-x-scroll overflow-y-hidden gap-5 p-5">
            {properties.map((property, index) => (
              <Link
                to={`/property/${property._id}`}
                className="cursor-pointer"
                key={index}
              >
                <div className="bg-white px-0.5 pb- shadow-2xl w-56 md:w-64 lg:w-72  border border-gray-100">
                  <div className="text-xl font-bold mb-2">
                    <img
                      className="h-64 w-full rounded"
                      src={property.ImageUrls[0]}
                      alt=""
                    />
                  </div>
                  <div className="m-2 p-4">
                    <div className="text-lg font-bold mb-2 border-b h-16 flex items-center">
                      {property.property_name}
                    </div>
                    <div className="flex my-2 justify-between">
                      <div className="flex mt-2  ">
                        <IoIosBed className="w-full h-6 mr-1 text-sky-500" />
                        <div className="text-gray-700">
                          {property.details.number_bedrooms}Br
                        </div>
                      </div>
                      <div className="flex mt-2 ">
                        <GiBathtub className="w-full h-6 mr-1 text-sky-500" />
                        <div className="text-gray-700">
                          {property.details.number_bathrooms}Ba
                        </div>
                      </div>
                      <div className="flex mt-2 ">
                        <SiBlueprint className="w-full h-6 mr-1 text-sky-500" />
                        <div className="text-gray-700">
                          {property.details.built_up_area}sq.ft.
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between border-t">
                      <div className="text-xl font-bold mt-2">
                        ₹{property.property_rent}
                      </div>
                      <div className="text-blue-500 mt-2 cursor-pointer">
                        View Details
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCards;
