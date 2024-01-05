import React, { useEffect, useState } from "react";
import PropertyListing from "../../../components/Owner/PropertyListing/PropertyListing";
import { Button, Typography } from "@material-tailwind/react";
import { useGetPropertiesuserMutation } from "../../../Redux/Slices/userApi/usersApiSlice";

const PropertyListingPage = () => {
  const [getProperties] = useGetPropertiesuserMutation();
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [uniquePropertyTypes, setUniquePropertyTypes] = useState([]);
  const [uniqueLocatity, setUniqueLocatity] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [locationFilter, setLocationFilter] = useState("All");
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const totalPageCount = Math.ceil(filteredProperties.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getProperties().unwrap();
        if (res.error) {
          generateError(res.error);
          return;
        } else {
          const propertiesData = res.properties;
          setProperties(propertiesData);
          setAllProperties(propertiesData);
          setFilteredProperties(propertiesData);

          const uniqueTypes = Array.from(
            new Set(propertiesData.map((property) => property.property_type))
          );
          setUniquePropertyTypes(uniqueTypes);

          const uniquelocations = Array.from(
            new Set(
              propertiesData.map(
                (property) => property.property_location.locality
              )
            )
          );
          setUniqueLocatity(uniquelocations);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getData();
  }, [getProperties]);

  const applyFilters = () => {
    let tempProperties = [...allProperties];

    if (selectedType !== "All") {
      tempProperties = tempProperties.filter(
        (property) => property.property_type === selectedType
      );
    }

    if (searchQuery.trim() !== "") {
      tempProperties = tempProperties.filter((property) =>
        property.property_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationFilter !== "All") {
      tempProperties = tempProperties.filter(
        (property) =>
          property.property_location &&
          property.property_location.locality === locationFilter
      );
    }

    tempProperties.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.property_rent - b.property_rent;
      } else {
        return b.property_rent - a.property_rent;
      }
    });

    setFilteredProperties(tempProperties);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedType, searchQuery, locationFilter, sortOrder]);

  const handleTypeChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedType(selectedValue);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSortChange = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const handleLocationFilterChange = (event) => {
    const location = event.target.value;
    setLocationFilter(location);
  };
  if (!filteredProperties) {
    return (
      <div className="lg:w-9/12 min-h-screen mb-10 p-3 flex items-center justify-center">
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
      <div className="flex justify-center min-h-screen py-10 bg-gray-50">
        <div className="w-10/12 xl:w-9/12 mx-auto flex flex-col md:flex-row gap-4">
          <div className="w-full block md:hidden border h-fit p-3 bg-white mt-4 lg:mt-0">
            <Typography className="py-2" variant="lead">
              Find Your Property
            </Typography>

            <Typography className="py-2" variant="lead">
              <label className="text-base" htmlFor="">
                Property Type
              </label>{" "}
              <select
                className="w-full bg-blue-gray-50  border-none rounded-lg"
                name=""
                id=""
                value={selectedType}
                onChange={handleTypeChange}
              >
                <option value="All">All</option>
                {uniquePropertyTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Typography>

            <Typography className="py-2" variant="lead">
              <label className="text-base" htmlFor="">
                Search By Title
              </label>{" "}
              <input
                type="text"
                placeholder="type the name"
                className="w-full bg-blue-gray-50  border-none rounded-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Typography>

            <Typography className="py-2" variant="lead">
              <label className="text-base" htmlFor="">
                Sort By Rent
              </label>{" "}
              <Button
                className="w-full bg-blue-gray-50 text-black  border-none rounded-lg"
                onClick={handleSortChange}
              >
                {sortOrder === "asc" ? "Low to High" : "High to Low"}
              </Button>
            </Typography>

            <Typography className="py-2" variant="lead">
              <label className="text-base" htmlFor="">
                Filter By Locality
              </label>{" "}
              <select
                className="w-full bg-blue-gray-50 border-none rounded-lg"
                name=""
                id=""
                value={locationFilter}
                onChange={handleLocationFilterChange}
              >
                <option value="All">All</option>
                {uniqueLocatity.map((locality, i) => (
                  <option key={i} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>
            </Typography>
          </div>
          <div className="w-full lg:w-8/12">
            <div className="w-full">
              {filteredProperties.length > 0 ? (
                <PropertyListing properties={currentProperties} />
              ) : (
                <div className=" bg-white rounded shadow-md p-3 w-full flex flex-col lg:flex-row gap-3 mb-3">
                  No results Found...
                </div>
              )}
            </div>
            {filteredProperties.length > itemsPerPage && (
              <div className="flex justify-center mt-4">
                <ul className="flex gap-2">
                  {Array.from({ length: totalPageCount }).map((_, index) => (
                    <li key={index}>
                      <button
                        className={`${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-blue-200 text-blue-800"
                        } px-3 py-1 rounded`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="md:w-full hidden md:block lg:w-4/12 border h-fit p-3 bg-white mt-4 lg:mt-0">
            <Typography className="py-2" variant="lead">
              Find Your Property
            </Typography>

            <Typography className="py-2" variant="lead">
              <label className="text-base" htmlFor="">
                Property Type
              </label>{" "}
              <select
                className="w-full bg-blue-gray-50  border-none rounded-lg"
                name=""
                id=""
                value={selectedType}
                onChange={handleTypeChange}
              >
                <option value="All">All</option>
                {uniquePropertyTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Typography>

            <Typography className="py-2" variant="lead">
              <label className="text-base" htmlFor="">
                Search By Title
              </label>{" "}
              <input
                type="text"
                placeholder="type the name"
                className="w-full bg-blue-gray-50  border-none rounded-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Typography>

            <Typography className="py-2" variant="lead">
              <label className="text-base" htmlFor="">
                Sort By Rent
              </label>{" "}
              <Button
                className="w-full bg-blue-gray-50 text-black  border-none rounded-lg"
                onClick={handleSortChange}
              >
                {sortOrder === "asc" ? "Low to High" : "High to Low"}
              </Button>
            </Typography>

            <Typography className="py-2" variant="lead">
              <label className="text-base" htmlFor="">
                Filter By Locality
              </label>{" "}
              <select
                className="w-full bg-blue-gray-50 border-none rounded-lg"
                name=""
                id=""
                value={locationFilter}
                onChange={handleLocationFilterChange}
              >
                <option value="All">All</option>
                {uniqueLocatity.map((locality, i) => (
                  <option key={i} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyListingPage;
