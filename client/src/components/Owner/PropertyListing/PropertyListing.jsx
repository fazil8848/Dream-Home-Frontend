import React from "react";
import { GiBathtub } from "react-icons/gi";
import { IoIosBed } from "react-icons/io";
import { SiBlueprint } from "react-icons/si";
import { Link } from "react-router-dom";

const PropertyListing = ({ properties }) => {
  return (
    <>
      {properties.map((property, i) => {
        const id = [
          property?._id.slice(0, Math.floor(property?._id.length / 2)),
          property?._id.slice(Math.floor(property?._id.length / 2)),
        ];
        const [tt, ID] = id;
        return (
          <Link
            to={`/property/${property._id}`}
            className="cursor-pointer"
            key={i}
          >
            <div
              key={property._id}
              className="bg-white rounded shadow-md p-3 w-full flex flex-col lg:flex-row gap-3 mb-3"
            >
              <div className="w-full lg:w-1/3">
                <div>
                  <img
                    className="rounded w-full max-h-80 "
                    src={property?.ImageUrls[0]}
                    alt=""
                  />
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
              </div>
              <div className="w-full lg:w-2/3">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full lg:w-2/3">
                    <div>
                      <p className="font-semibold">{property.property_name}</p>
                      <p className="font-semibold ">
                        {property.property_location.district},
                        {property.property_location.locality}
                      </p>
                      <p className="font-bold mt-1 mb-2">
                        ₹{property.property_rent}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full flex justify-end mt-2 lg:mt-0">
                    <div>
                      <div className="flex items-center  gap-2">
                        <p className="border rounded-md border-sky-300 text-xs h-fit w-fit py-1 px-2 ">
                          FOR RENT
                        </p>

                        <p className="border text-white shadow-inner rounded-md bg-green-500 text-xs w-fit p-2 ">
                          &#10003; Verified
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <p className="text-sm font-medium font-poppins text-sky-400">
                          ID: {ID}
                        </p>
                        <p className="text-sm font-medium font-poppins text-gray-500">
                          {property.createdAt
                            ? new Date(property.createdAt)
                                .toISOString()
                                .slice(0, 10)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className=" text-sm font-light text-gray-500 font-poppins">
                    {property.property_description.length > 125
                      ? property.property_description.slice(0, 125) + " ...."
                      : property.property_description.length}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default PropertyListing;
