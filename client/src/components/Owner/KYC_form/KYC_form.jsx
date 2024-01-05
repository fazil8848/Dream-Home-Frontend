import React, { useState } from "react";
import { useAddKycMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner/Spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateError, generateSuccess } from "../../Dependencies/toast";

const KYC_form = () => {
  const [full_name, setFull_name] = useState("");
  const [email, setEmail] = useState("");
  const [PAN, setPAN] = useState("");
  const [country, setCountry] = useState("");
  const [Occupation, setOccupation] = useState("");
  const [State, setState] = useState("");
  const [Address, setAddress] = useState("");
  const [workDetails, setWorkDetails] = useState("");
  const [ZipCode, setZipCode] = useState("");
  const [City, setCity] = useState("");
  const [portrate, setPortrate] = useState(""); // Change to string to store Cloudinary URL

  const navigate = useNavigate();


  const { ownerInfo } = useSelector((state) => state.owner);

  const [addKYCCall, { isLoading }] = useAddKycMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      if (
        full_name.trim() === "" ||
        email.trim() === "" ||
        PAN.trim() === "" ||
        country.trim() === "" ||
        Occupation.trim() === "" ||
        State.trim() === "" ||
        Address.trim() === "" ||
        workDetails.trim() === "" ||
        ZipCode.trim() === "" ||
        City.trim() === ""
      ) {
        generateError("Please fill all the fields");
        return;
      }
  
      const url = await uploadImage();
  
      const KYC = {
        owner: ownerInfo._id,
        full_name,
        email,
        PAN,
        country,
        Occupation,
        State,
        Address,
        workDetails,
        ZipCode,
        City,
        portrate: url,
      };
  
      const result = await addKYCCall({ KYC }).unwrap();
  
      if (result.error) {
        generateError(result.error);
        return;
      } else {
        generateSuccess("KYC added successfully");
        navigate('/owner/profile')
      }
    } catch (error) {
      console.error("Error submitting KYC form:", error);
  
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
      generateError("An error occurred while processing your request");
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", portrate);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPortrate(file);
  };

  return (
    <>
      <div className="min-h-[85vh] bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Personal Details</p>
                  <p>Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2">
                  <form onSubmit={submitHandler} encType="multipart/form-data">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-5">
                        <label htmlFor="full_name">Full Name</label>
                        <input
                          onChange={(e) => setFull_name(e.target.value)}
                          type="text"
                          name="full_name"
                          id="full_name"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={full_name}
                          placeholder={
                            full_name ? full_name : "entert the fullname"
                          }
                        />
                      </div>

                      <div className="md:col-span-5">
                        <label htmlFor="email">Email Address</label>
                        <input
                          onChange={(e) => setEmail(e.target.value)}
                          type="text"
                          name="email"
                          id="email"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={email}
                          placeholder={email ? email : "Enter Your Email"}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="email">Pan Card</label>
                        <input
                          onChange={(e) => setPAN(e.target.value)}
                          type="text"
                          name="PAN"
                          id="PAN"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={PAN}
                          placeholder={PAN ? PAN : "Enter Your Pan"}
                        />
                      </div>

                      <div className="md:col-span-3 ">
                        <label htmlFor="portrate">Portrate</label>
                        <input
                          onChange={handleFileChange}
                          type="file"
                          accept="image/*" // Allow only image files
                          className="h-10 border-black mt-1 rounded p-2 w-full bg-gray-50"
                          placeholder=""
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label htmlFor="email">Occupation</label>
                        <input
                          onChange={(e) => setOccupation(e.target.value)}
                          type="text"
                          name="Occupation"
                          id="Occupation"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={Occupation}
                          placeholder={
                            Occupation ? Occupation : "Enter Your Occupation"
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="email">Work Details</label>
                        <input
                          onChange={(e) => setWorkDetails(e.target.value)}
                          type="text"
                          name="workDetails"
                          id="workDetails"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={workDetails}
                          placeholder={
                            workDetails ? workDetails : "Enter Work Details"
                          }
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label htmlFor="address">Address / Street</label>
                        <input
                          onChange={(e) => setAddress(e.target.value)}
                          type="text"
                          name="address"
                          id="address"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={Address}
                          placeholder={Address ? Address : "Enter Address"}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="city">City</label>
                        <input
                          onChange={(e) => setCity(e.target.value)}
                          type="text"
                          name="city"
                          id="city"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={City}
                          placeholder={City ? City : "Enter City"}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="country">Country / region</label>
                        <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <input
                            onChange={(e) => setCountry(e.target.value)}
                            name="country"
                            id="country"
                            placeholder="Enter country"
                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                            value={country}
                          />
                          <button
                            tabIndex="-1"
                            className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600"
                          >
                            <svg
                              className="w-4 h-4 mx-2 fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                          <button
                            tabIndex="-1"
                            htmlFor="show_more"
                            className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600"
                          >
                            <svg
                              className="w-4 h-4 mx-2 fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="state">State / province</label>
                        <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <input
                            onChange={(e) => setState(e.target.value)}
                            name="state"
                            id="state"
                            placeholder={State ? State : "Enter State"}
                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                            value={State}
                          />
                          <button
                            tabIndex="-1"
                            className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600"
                          >
                            <svg
                              className="w-4 h-4 mx-2 fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                          <button
                            tabIndex="-1"
                            htmlFor="show_more"
                            className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600"
                          >
                            <svg
                              className="w-4 h-4 mx-2 fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor="zipcode">Zipcode</label>
                        <input
                          onChange={(e) => setZipCode(e.target.value)}
                          type="text"
                          name="zip"
                          id="zip"
                          className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder="Enter Zip"
                          value={ZipCode}
                        />
                      </div>

                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                          <button
                            type="submit"
                            className="bg-blue-100 hover:bg-blue-950 text-white font-bold py-2 mt-3 px-5 rounded"
                          >
                            {isLoading ? <Spinner /> : "Submit"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KYC_form;

{
  /* <div className="md:col-span-2">
<label htmlFor="soda">How many soda pops?</label>
<div className="h-10 w-28 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
  <button
    tabIndex="-1"
    htmlFor="show_more"
    className="cursor-pointer outline-none focus:outline-none border-r border-gray-200 transition-all text-gray-500 hover:text-blue-600"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mx-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
  <input
  onChange={(e)=>set(e.target.value)}
    name="soda"
    id="soda"
    placeholder="0"
    className="px-2 text-center appearance-none outline-none text-gray-800 w-full bg-transparent"
    value="0"
  />
  <button
    tabIndex="-1"
    htmlFor="show_more"
    className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-500 hover:text-blue-600"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mx-2 fill-current"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</div>
</div> */
}
