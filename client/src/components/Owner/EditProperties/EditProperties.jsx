import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LiaFanSolid } from "react-icons/lia";
import { FaParking, FaWifi } from "react-icons/fa";
import { MdLocalMall, MdOutlinePool } from "react-icons/md";
import { CiHospital1 } from "react-icons/ci";
import { GiTreeSwing } from "react-icons/gi";

import {
  useDeleteImageMutation,
  useEditPropertyMutation,
  useGetPropertyMutation,
} from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import GoogleMapComponent from "../../Dependencies/GoogleMap/GoogleMpa";
import { Button } from "@material-tailwind/react";

const EditProperties = () => {
  const [editLoading, setEditLoading] = useState(false);
  const [editproperties, { isError }] = useEditPropertyMutation();
  const [getProperty] = useGetPropertyMutation();

  const [deleteImage] = useDeleteImageMutation();
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);

  const [options, setOptions] = useState(1);
  const { ownerInfo } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  const [tittle, setTittle] = useState("");
  const [type, setType] = useState("");
  const [rent, setRent] = useState(0);
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [ImageUrls, setImageUrls] = useState([]);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [locality, setLocality] = useState("");
  const [zip, setZip] = useState(0);
  const [address, setAddress] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [area, setArea] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [furnishing, setFurnishing] = useState("");
  const [water, setWater] = useState("");
  const [carpetArea, setCarpetArea] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [powerBackup, setPowerBackup] = useState(null);
  const [flooring, setFlooring] = useState("");
  const [ac, setAc] = useState(0);
  const [wifi, setWifi] = useState(null);
  const [parking, setParking] = useState(0);
  const [shopping, setShopping] = useState(null);
  const [pool, setPool] = useState(null);
  const [playArea, setPlayArea] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [road, setRoad] = useState("");
  const [balconies, setBalconies] = useState(0);
  const [floors, setFloors] = useState(0);
  const [security, setSecurity] = useState(null);
  const [cctv, setCCTV] = useState(null);
  const { id } = useParams();
  const [doc, setDoc] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleOptions = () => {
    if (options >= 4) {
      return;
    } else {
      setOptions(options + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);

      if (
        tittle.trim() === "" ||
        type.trim() === "" ||
        rent <= 0 ||
        details.trim() === "" ||
        state.trim() === "" ||
        country.trim() === "" ||
        district.trim() === "" ||
        locality.trim() === "" ||
        address.trim() === "" ||
        zip.length <= 5 ||
        area <= 0 ||
        rooms <= 0 ||
        furnishing.trim() === "" ||
        water.trim() === "" ||
        carpetArea <= 0 ||
        bathrooms <= 0 ||
        powerBackup === null ||
        flooring.trim() === "" ||
        shopping === null ||
        ac < 0 ||
        wifi === null ||
        parking < 0 ||
        pool === null ||
        playArea === null ||
        hospital === null ||
        floors <= 0 ||
        balconies <= 0 ||
        road === null ||
        security === null ||
        doc === null ||
        cctv === null
      ) {
        generateError("Please Fill all the  Fields");
        return;
      }
      if (images.length < 1 && ImageUrls < 1) {
        generateError("Please insert Images");
        return;
      }

      const imageUrls = await uploadImagesToCloudinary();
      // Update property data with image URLs
      setImageUrls(imageUrls);

      // Create property data
       const propertyData = {
        property_name: tittle,
        property_type: type,
        property_rent: rent,
        property_description: details,
        ImageUrls: [coverImage, ...ImageUrls],
        doc,
        property_location: {
          country,
          state,
          district,
          locality,
          address,
          pin_code: zip,
          longitude,
          latitude,
        },
        owner: ownerInfo._id,
        details: {
          built_up_area: area,
          carpet_area: carpetArea,
          number_bedrooms: rooms,
          number_bathrooms: bathrooms,
          number_balconies: balconies,
          furinishing_status: furnishing,
          road_accessibility: road,
          water_accessibilty: water,
          power_backup: powerBackup,
          number_floors: floors,
          type_flooring: flooring,
        },
        amenities: {
          Wifi: wifi,
          AC: ac,
          parking,
          pool,
          shoping_facility: shopping,
          hospital_facility: hospital,
          play_area: playArea,
          security,
          cctv,
        },
      };

      // Update property using backend API
      const res = await editproperties({ propertyData, id }).unwrap();

      // Handle API response
      if (res.error) {
        generateError("Error while Editing Property please try again");
        return;
      } else {
        setEditLoading(false);
        generateSuccess("Property updated Successfully");
        setTimeout(() => {
          navigate("/owner/properties");
        }, 2000);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const uploadImagesToCloudinary = async () => {
    const urls = [...ImageUrls];

    for (let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append("file", images[i]);
      formData.append("folder", "propertyImages");
      formData.append("upload_preset", "dreamhomeapp");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dn6anfym7/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      const secureUrl = cloudinaryData.secure_url;
      urls.push(secureUrl);
    }

    return urls;
  };

  const handLatLongWidowOpen = async () => {
    try {
      window.open("https://www.latlong.net/convert-address-to-lat-long.html");
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPropertyData = async () => {
    try {
      const res = await getProperty(id).unwrap();
      const { property } = res;
      if (res.error) {
        generateError(res.error);
        return;
      } else {
        setTittle(property.property_name);
        setType(property.property_type);
        setRent(property.property_rent);
        setDetails(property.property_description);
        setImageUrls(property.ImageUrls);
        setCountry(property.property_location.country);
        setState(property.property_location.state);
        setDistrict(property.property_location.district);
        setLocality(property.property_location.locality);
        setZip(property.property_location.pin_code);
        setAddress(property.property_location.address);
        setLongitude(property.property_location.longitude);
        setLatitude(property.property_location.latitude);
        setArea(property.details.built_up_area);
        setRooms(property.details.number_bedrooms);
        setFurnishing(property.details.furinishing_status);
        setWater(property.details.water_accessibilty);
        setCarpetArea(property.details.carpet_area);
        setBathrooms(property.details.number_bathrooms);
        setPowerBackup(property.details.power_backup);
        setFlooring(property.details.type_flooring);
        setAc(property.amenities.AC);
        setWifi(property.amenities.Wifi);
        setParking(property.amenities.parking);
        setShopping(property.amenities.shoping_facility);
        setPool(property.amenities.pool);
        setPlayArea(property.amenities.play_area);
        setHospital(property.amenities.hospital_facility);
        setRoad(property.details.road_accessibility);
        setBalconies(property.details.number_balconies);
        setFloors(property.details.number_floors);
        setSecurity(property.amenities.security);
        setCCTV(property.amenities.cctv);
        setDoc(property.doc);
      }
    } catch (e) {
      console.log("error Getting the property data", e.message);
    }
  };

  useEffect(() => {
    getPropertyData();
  }, [id]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const selectedImages = [];

    for (
      let i = 0;
      i < files.length && selectedImages.length < 5 - ImageUrls.length;
      i++
    ) {
      selectedImages.push(files[i]);
    }
    setImages(selectedImages);
  };

  const handleDeleteImage = async (imgUrl) => {
    try {
      setDeleteImageLoading(true);
      const res = await deleteImage({ imgUrl, id }).unwrap();

      if (res.imageDeleted) {
        setImageUrls((prevImageUrls) =>
          prevImageUrls.filter((url) => url !== imgUrl)
        );
        setDeleteImageLoading(false);
        toast.done("Image deleted Succesfully");
      } else {
        generateError(res.error);
        return;
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setDeleteImageLoading(false);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "dreamhomeapp");
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dn6anfym7/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (cloudinaryData.error) {
        generateError(
          `Failed to upload image to Cloudinary: ${cloudinaryData.error.message}`
        );
        return;
      }
      const uploadedImageUrl = cloudinaryData.secure_url;

      return uploadedImageUrl;
    } catch (error) {
      generateError(
        `Failed to upload image to Cloudinary: ${cloudinaryData.error.message}`
      );
    }
  };

  const handleDocChange = async (e) => {
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setDoc(url);
    } catch (error) {
      generateError(error.message);
    }
  };

  const handleCoverImage = async (e) => {
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (error) {
      generateError(error.message);
    }
  };

  return (
    <>
      <div className="w-fullh-full p-4 ">
        <div className="">
          <h1 className="text-xl ">Add Properties</h1>
          <p className="text-sm text-gray-400">
            here you can add new property by including details like
            location,images of the property, amenities, status of the property
            etc..
          </p>
        </div>
        <div className="p-1">
          <div className="border rounded-md mx-2 p-4 flex justify-between px-10 my-2">
            <button
              onClick={() => setOptions(1)}
              className={
                options === 1
                  ? "border border-gray-400 bg-white rounded-md py-1 px-4"
                  : "border rounded-md py-1 px-4"
              }
            >
              Basic
            </button>
            <button
              onClick={() => setOptions(2)}
              className={
                options === 2
                  ? "border border-gray-400 bg-white rounded-md py-1 px-4"
                  : "border rounded-md py-1 px-4"
              }
            >
              Location
            </button>
            <button
              onClick={() => setOptions(3)}
              className={
                options === 3
                  ? "border border-gray-400 bg-white rounded-md py-1 px-4"
                  : "border rounded-md py-1 px-4"
              }
            >
              Details
            </button>
            <button
              onClick={() => setOptions(4)}
              className={
                options === 4
                  ? "border border-gray-400 bg-white rounded-md py-1 px-4"
                  : "border rounded-md py-1 px-4"
              }
            >
              Ameniteis
            </button>
          </div>
          <div className="w-full p-2">
            <form onSubmit={handleSubmit}>
              {options === 1 && (
                <div className=" w-full lg:flex md:justify-between gap-3 ">
                  <div className=" border w-full rounded-md bg-white p-4 lg:w-7/12 block">
                    <div className="my-2">
                      <h1 className=" text-xl font-poppins">Property Info</h1>
                      <p className="text-xs text-gray-400">
                        You can select what kind of property you have to add and
                        also select the property type from below dropdown.
                      </p>
                    </div>

                    <div>
                      <label className="block mb-1" htmlFor="">
                        Property Tittle
                      </label>
                      <input
                        onChange={(e) => setTittle(e.target.value)}
                        type="text"
                        value={tittle}
                        className="form-input block w-full border-none bg-ownFormbg rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block mb-1" htmlFor="">
                        Property Type
                      </label>
                      <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="form-input block w-full border-none bg-ownFormbg rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block mb-1" htmlFor="">
                        Expected Rent
                      </label>
                      <input
                        type="number"
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        className="form-input block w-full border-none bg-ownFormbg rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block mb-1" htmlFor="">
                        Property Details
                      </label>
                      <textarea
                        id="propertyDescription"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="form-textarea block w-full h-40 border-none bg-ownFormbg rounded-md"
                        placeholder="Enter property description"
                      ></textarea>
                    </div>

                    <div className=" flex gap-4">
                      <div>
                        <label className="block mb-1" htmlFor="">
                          Document
                        </label>
                        <input
                          type="file"
                          onChange={handleDocChange}
                          className="form-input block w-full border-none bg-ownFormbg rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block mb-1" htmlFor="">
                          Cover Image
                        </label>
                        <input
                          type="file"
                          onChange={handleCoverImage}
                          className="form-input block w-full border-none bg-ownFormbg rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 md:mt-0 border w-full  rounded-md bg-white p-4 lg:w-5/12">
                    <div className="mb-4">
                      <label
                        for="dropzone-file"
                        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span class="font-semibold">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          onChange={handleFileChange}
                          id="dropzone-file"
                          multiple
                          type="file"
                          class="hidden"
                        />
                      </label>
                    </div>
                    {deleteImageLoading ? (
                      <div className="w-full h-80 flex items-center justify-center">
                        <div className="h-12 w-12">
                          <Spinner />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap">
                        {ImageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="w-1/3 p-1 flex flex-col relative"
                          >
                            <IoMdCloseCircleOutline
                              onClick={() => handleDeleteImage(url)}
                              className="h-5 w-5 absolute self-end z-40 text-red-500 rounded-full bg-white-50"
                            />
                            <img
                              className="h-48 w-full"
                              src={url}
                              alt={`Image ${index}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {options === 2 && (
                <div className="flex flex-col lg:flex-row justify-between gap-3">
                  <div className="border rounded-md bg-white p-4 w-full lg:w-7/12 mb-4 lg:mb-0">
                    <div className="my-2">
                      <h1 className="text-xl font-poppins">
                        Location and Address
                      </h1>
                      <p className="text-xs text-gray-400">
                        Add the location of your property here. Select your
                        country, state, district, locality, etc.
                      </p>
                    </div>

                    <div>
                      <label className="block mb-1" htmlFor="">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="form-input block w-full border-none bg-ownFormbg rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block mb-1" htmlFor="">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-input block w-full border-none bg-ownFormbg rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block mb-1" htmlFor="">
                        District
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="form-input block w-full border-none bg-ownFormbg rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block mb-1" htmlFor="">
                        Locality / Street
                      </label>
                      <input
                        type="text"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="form-input block w-full border-none bg-ownFormbg rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block mb-1" htmlFor="">
                        ZipCode
                      </label>
                      <input
                        type="number"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="form-input block w-full border-none bg-ownFormbg rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block mb-1" htmlFor="">
                        Address
                      </label>
                      <textarea
                        value={address}
                        id="propertyDescription"
                        className="form-textarea block w-full h-40 border-none bg-ownFormbg rounded-md"
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter property description"
                      ></textarea>
                    </div>
                  </div>

                  <div className="border rounded-md bg-white p-4 w-full lg:w-5/12">
                    <div id="map">
                      <div className="my-2">
                        <h1 className="text-xl font-poppins">
                          Save the current Location
                        </h1>
                        <p className="text-xs text-gray-400">
                          Select your location from the map
                        </p>
                      </div>

                      <div className="w-full h-80 mx-auto">
                        <GoogleMapComponent
                          longitude={longitude}
                          latitude={latitude}
                          setLatitude={setLatitude}
                          setLongitude={setLongitude}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center my-6">
                      <div className="w-2/5 h-[1px] bg-gray-400" /> or{" "}
                      <div className="h-[1px] bg-gray-400 w-2/5" />
                    </div>

                    <div id="manual">
                      <div className="my-2">
                        <h1 className="text-xl font-poppins">
                          Enter location manually
                        </h1>
                        <p className="text-xs text-gray-400">
                          Get your longitude and latitude from the below website
                          and paste it in the field
                        </p>
                      </div>

                      <div className="my-2">
                        <label className="block mb-1" htmlFor="">
                          Longitude
                        </label>
                        <input
                          type="text"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          className="form-input block w-full border-none bg-ownFormbg rounded-md"
                        />
                        <div
                          className="text-sky-500 text-xs cursor-pointer m-1 underline"
                          onClick={handLatLongWidowOpen}
                        >
                          Get longitude from this website
                        </div>
                      </div>

                      <div className="my-2">
                        <label className="block mb-1" htmlFor="">
                          Latitude
                        </label>
                        <input
                          type="text"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          className="form-input block w-full border-none bg-ownFormbg rounded-md"
                        />
                        <div
                          className="text-sky-500 text-xs cursor-pointer m-1 underline"
                          onClick={handLatLongWidowOpen}
                        >
                          Get latitude from this website
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {options === 3 && (
                <div className="w-full flex flex-col lg:flex-row justify-between gap-3">
                  <div className="border rounded-md bg-white p-4 w-full block">
                    <div className="my-5">
                      <h1 className="text-xl font-poppins">Property Details</h1>
                      <p className="text-xs text-gray-400">
                        Fill the given fields with the information of your
                        property
                      </p>
                    </div>

                    <div className="w-full flex flex-col lg:flex-row justify-between gap-5">
                      <div className="w-full lg:w-1/3 font-semibold">
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            BuiltUp Area (Sq.Ft.)
                          </label>
                          <input
                            type="Number"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>

                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            No. of Bedrooms
                          </label>
                          <input
                            type="text"
                            value={rooms}
                            onChange={(e) => setRooms(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>

                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            Furnishing Status
                          </label>
                          <input
                            type="text"
                            value={furnishing}
                            onChange={(e) => setFurnishing(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>

                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            Water Availability
                          </label>
                          <input
                            type="text"
                            value={water}
                            onChange={(e) => setWater(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>
                      </div>

                      <div className="w-full lg:w-1/3 font-semibold">
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            Carpet Area (Sq.Ft.)
                          </label>
                          <input
                            type="number"
                            value={carpetArea}
                            onChange={(e) => setCarpetArea(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>

                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            No. of Bathrooms
                          </label>
                          <input
                            type="number"
                            value={bathrooms}
                            onChange={(e) => setBathrooms(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>

                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            Higway Accessibility
                          </label>
                          <select
                            value={wifi}
                            onChange={(e) => setRoad(e.target.value)}
                            className="form-select block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>

                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            No. of Floors
                          </label>
                          <input
                            type="number"
                            value={floors}
                            onChange={(e) => setFloors(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>
                      </div>

                      <div className="w-full lg:w-1/3 font-semibold">
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            No. of Balconies
                          </label>
                          <input
                            type="number"
                            value={balconies}
                            onChange={(e) => setBalconies(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>

                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            Power Backup
                          </label>
                          <select
                            value={powerBackup}
                            onChange={(e) => setPowerBackup(e.target.value)}
                            className="form-select block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>

                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            Type of Flooring
                          </label>
                          <input
                            type="text"
                            value={flooring}
                            onChange={(e) => setFlooring(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {options === 4 && (
                <div className="w-full flex justify-between gap-3">
                  <div className="border rounded-md bg-white p-4 w-full block">
                    <div className="my-5">
                      <h1 className="text-xl font-poppins">
                        Property Amenities
                      </h1>
                      <p className="text-xs text-gray-400">
                        Fill the given fields with the amenities of your
                        property
                      </p>
                    </div>

                    <div className="w-full lg:flex justify-between gap-5">
                      <div className="w-full font-semibold lg:px-2">
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <LiaFanSolid /> A/C
                            </div>
                          </label>
                          <input
                            type="number"
                            onChange={(e) => setAc(e.target.value)}
                            value={ac}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <FaParking /> Parking Area(No.of cars)
                            </div>
                          </label>
                          <input
                            type="number"
                            value={parking}
                            onChange={(e) => setParking(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          />
                        </div>
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <MdLocalMall /> Nearby shopping facility
                            </div>
                          </label>
                          <select
                            value={shopping}
                            onChange={(e) => setShopping(e.target.value)}
                            className="form-input block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <CiHospital1 /> Hospital Nearby
                            </div>
                          </label>
                          <select
                            onChange={(e) => setHospital(e.target.value)}
                            value={hospital}
                            className="form-select block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                      </div>

                      <div className="w-full font-semibold lg:px-2">
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <FaWifi /> WiFi
                            </div>
                          </label>
                          <select
                            value={wifi}
                            onChange={(e) => setWifi(e.target.value)}
                            className="form-select block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <MdOutlinePool /> Swimming pool
                            </div>
                          </label>
                          <select
                            value={pool}
                            onChange={(e) => setPool(e.target.value)}
                            className="form-select block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <GiTreeSwing /> Play Area
                            </div>
                          </label>
                          <select
                            value={playArea}
                            onChange={(e) => setPlayArea(e.target.value)}
                            className="form-select block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <GiTreeSwing /> Security
                            </div>
                          </label>
                          <select
                            value={security}
                            onChange={(e) => setSecurity(e.target.value)}
                            className="form-select block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="w-full font-semibold lg:px-2">
                        <div className="my-2">
                          <label className="block mb-1" htmlFor="">
                            <div className="flex items-center gap-2">
                              <GiTreeSwing /> CCTV
                            </div>
                          </label>
                          <select
                            value={cctv}
                            onChange={(e) => setCCTV(e.target.value)}
                            className="form-select block w-full border-none bg-ownFormbg rounded-md py-3"
                          >
                            <option selected value="" disabled>
                              Select--
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {options < 4 ? (
                <Link
                  onClick={handleOptions}
                  className=" float-right rounded-md bg-blue-100 hover:bg-blue-950 text-white py-2 px-8 mt-4 me-10"
                >
                  Next
                </Link>
              ) : (
                <>
                  {editLoading ? (
                    <div className=" px-4 py-1 flex justify-center items-center float-right rounded-md bg-black ">
                      <Spinner />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className=" float-right rounded-md bg-black hover:bg-transparent hover:border hover:border-black hover:text-black text-white "
                    >
                      Submit
                    </Button>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProperties;
