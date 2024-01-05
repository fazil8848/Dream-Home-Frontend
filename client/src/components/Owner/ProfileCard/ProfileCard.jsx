import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  useCheckPassOwnerMutation,
  useGetOwnerMutation,
  useUpdateOwnerMutation,
  useUpdatePassOwnerMutation,
} from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { setOwnerCredentials } from "../../../Redux/Slices/ownerApi/ownerAuthSlicel";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import { FaCameraRetro } from "react-icons/fa";
import { Box, Modal } from "@mui/material";
import { Button } from "@material-tailwind/react";

const ProfileCard = () => {
  const [fisrtName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [getOwnerCall] = useGetOwnerMutation();
  const [setOwnerCall] = useUpdateOwnerMutation();
  const [updateOwnerPasswordCall] = useUpdatePassOwnerMutation();
  const [checkOwnerPassCall] = useCheckPassOwnerMutation();

  const dispatch = useDispatch();
  const [KYCAdded, setKYCAdded] = useState(true);
  const [currentPass, setCurrentPass] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passVerified, setPassVerified] = useState(false);
  const [checkPassLoading, setCheckPassLoading] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [passOpen, setPassOpen] = React.useState(false);
  const handlePassOpen = () => setPassOpen(true);
  const handlePassClose = () => setPassOpen(false);

  const { ownerInfo } = useSelector((state) => state.owner);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const stylePass = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 450,
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
  };

  const handlePassCheck = async (e) => {
    e.preventDefault();
    setCheckPassLoading(true);
    try {
      if (currentPass.trim() === "") {
        generateError("Please Fill the password fields");
        return;
      }
      const id = ownerInfo._id;
      const result = await checkOwnerPassCall({
        id,
        data: { password: currentPass },
      }).unwrap();

      if (result.error) {
        generateError(result.error);
        setCheckPassLoading(false);
      } else {
        generateSuccess(result.message);
        setPassVerified(true);
        setCheckPassLoading(false);
      }
    } catch (error) {
      generateError(error.message);
      setCheckPassLoading(false);
    } finally {
      setCheckPassLoading(false);
    }
  };

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  const handlePasschange = async (e) => {
    e.preventDefault();
    try {
      if (password.trim() === "" || confirmPass.trim() === "") {
        generateError("Please Fill the password fields");
        return;
      } else if (password !== confirmPass) {
        generateError("Please Enter Matching password");
        return;
      } else if (!strongPasswordRegex.test(password)) {
        generateError("Please Enter a Strong Password");
        return;
      }

      const id = ownerInfo._id;
      const result = await updateOwnerPasswordCall({
        id,
        data: { password },
      }).unwrap();

      if (result.error) {
        generateError(result.error);
      } else {
        generateSuccess(result.message);
        setPassOpen(false);
        setPassVerified(false);
        setCurrentPass("");
        setConfirmPass("");
        setPassword("");
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  const fetchOwner = async () => {
    try {
      const result = await getOwnerCall(ownerInfo._id).unwrap();

      if (result.error) {
        generateError(result.error);
      } else {
        const { fullName, email, mobile, kycAdded, profilePic } = result.owner;
        const [fName, sName] = fullName.split(" ");
        kycAdded ? setKYCAdded(true) : setKYCAdded(false);
        setFirstName(fName);
        setEmail(email);
        setLastName(sName);
        setMobile(mobile);
        setProfilePic(profilePic);
      }
    } catch (err) {
      generateError(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, [ownerInfo._id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      email.trim() === "" ||
      fisrtName.trim() === "" ||
      lastName.trim() === "" ||
      profilePic.trim() === "" ||
      mobile.trim() === ""
    ) {
      return generateError("Please fill all the fields");
    }

    try {
      const res = await setOwnerCall({
        id: ownerInfo._id,
        fisrtName,
        lastName,
        email,
        mobile,
        profilePic,
      }).unwrap();

      if (res.error) {
        generateError(res.error);
        return;
      } else {
        generateSuccess("Account updation success");
        const { owner, ownerinfo } = res;
        const [first, sp, last] = owner.fullName.split(" ");

        dispatch(setOwnerCredentials(ownerinfo));
        setEmail(owner.email);
        setFirstName(first);
        setLastName(last);
        setMobile(owner.mobile);
        setProfilePic(owner.profilePic);
      }
    } catch (err) {
      generateError(err?.data?.message || err.error);
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

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setProfilePic(url);
    } catch (error) {
      generateError(error.message);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-md min-h-screen bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="mx-auto lg:p-12 p-10 bg-white w-9/12 lg:w-7/12 shadow-xl min-h-full">
            <div className=" mx-auto  w-full ">
              <div className="relative ">
                <div className="flex justify-between">
                  <div className="  font-semibold text-[#252525] text-2xl leading-[48px]">
                    Profile
                  </div>
                  {!KYCAdded && (
                    <NavLink
                      className="px-4  py-2 text-center rounded-md bg-black hover:bg-transparent hover:border hover:border-black hover:text-black text-white"
                      to={"kyc"}
                    >
                      Add Kyc
                    </NavLink>
                  )}
                </div>
                <div className="h-0.5 my-3 bg-blue-100 "></div>
                <div>
                  <div className=" flex justify-center items-center h-20 ">
                    <div className="relative">
                      <img
                        className="rounded-full w-20 h-20 bg-black"
                        src={profilePic}
                        alt={" "}
                      />
                      <span
                        className="bottom-0 left-14 absolute w-3.5 h-3.5 border-2 rounded-full "
                        onClick={handleOpen}
                      >
                        {" "}
                        <FaCameraRetro />
                      </span>
                    </div>
                  </div>

                  <form onSubmit={submitHandler} className="">
                    <div className=" w-full md:flex my-3 justify-between gap-4">
                      <div className="md:md:w-1/2 flex-col">
                        <div className="my-1">
                          <label className="text-gray-600">First name</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="w-full border-1 border-gray-300 bg-gray-200  rounded px-4 py-3"
                            placeholder="First name...."
                            onChange={(e) => setFirstName(e.target.value)}
                            value={fisrtName}
                          />
                        </div>
                      </div>
                      <div className="md:w-1/2 flex-col">
                        <div className="my-1">
                          <label className="text-gray-600">Last name</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                            placeholder="Last name...."
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" w-full md:flex my-3 justify-between gap-4">
                      <div className="md:w-1/2 flex-col">
                        <div className="my-1">
                          <label className="text-gray-600">Email</label>
                        </div>
                        <div>
                          <input
                            type="email"
                            className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                            placeholder="Email...."
                            autoComplete="username"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </div>
                      </div>
                      <div className="md:w-1/2 flex-col">
                        <div className="my-1">
                          <label className="text-gray-600">Mobile</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                            placeholder="Mobile...."
                            onChange={(e) => setMobile(e.target.value)}
                            value={mobile}
                          />
                        </div>
                      </div>
                    </div>

                    <p
                      className="mx-2 my-3 text-sm font-ubuntu font-extralight text-gray-600"
                      onClick={handlePassOpen}
                    >
                      Update Password
                    </p>
                    <div className=" w-full flex justify-center ">
                      <button
                        type="submit"
                        className="w-3/4 md:w-2/4 bg-blue-100 text-white text-base font-medium py-3 rounded hover:bg-blue-950 mt-4"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Modal
          open={passOpen}
          onClose={handlePassClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={stylePass}>
            <div className="mx-auto bg-white  shadow-xl ">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black">Update Password</h3>
              </div>
              <div className="p-7 ">
                {!passVerified && (
                  <form action="#" onSubmit={handlePassCheck}>
                    <div className="w-full mb-4">
                      <label
                        className="mb-3 block text-sm font-medium text-black"
                        htmlFor="fullName"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-4 ">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className=" w-full rounded border border-stroke bg-gray py-3 pl-12 pr-4 text-black focus:border-primary focus-visible:outline-none"
                          type="password"
                          name="fullName"
                          id="fullName"
                          placeholder="Enter Current password"
                          onChange={(e) => setCurrentPass(e.target.value)}
                          value={currentPass}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray "
                        type="submit"
                      >
                        Confirm
                      </Button>
                    </div>
                  </form>
                )}

                {passVerified && (
                  <form action="#" onSubmit={handlePasschange}>
                    <div className="w-full">
                      <label
                        className="mb-3 block text-sm font-medium text-black"
                        htmlFor="fullName"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-12 pr-4 text-black focus:border-primary focus-visible:outline-none"
                          type="password"
                          name="password"
                          id="password"
                          placeholder="New password"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                      </div>

                      <div className="w-full my-5">
                        <label
                          className="mb-3 block text-sm font-medium text-black"
                          htmlFor="fullName"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-4">
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g opacity="0.8">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                  fill=""
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                  fill=""
                                />
                              </g>
                            </svg>
                          </span>
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-12 pr-4 text-black focus:border-primary focus-visible:outline-none"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Confirm nes password"
                            defaultValue={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                        type="submit"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Box>
        </Modal>
      </div>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="flex items-center justify-center w-full">
              <label
                for="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default ProfileCard;
