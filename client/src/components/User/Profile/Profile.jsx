import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import {
  useCheckPassMutation,
  useGetUserInfoMutation,
  useUpdatePassMutation,
  useUpdateUserMutation,
} from "../../../Redux/Slices/userApi/usersApiSlice";
import { FaCameraRetro } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [getUsrInfoCall] = useGetUserInfoMutation();
  const [updateUserCall] = useUpdateUserMutation();
  const [checkPasswordCall] = useCheckPassMutation();
  const [updatePasswordCall] = useUpdatePassMutation();

  const { userInfo } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passVerified, setPassVerified] = useState(false);
  const [checkPassLoading, setCheckPassLoading] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const getUser = async () => {
    try {
      const result = await getUsrInfoCall(userInfo._id).unwrap();
      if (result.error) {
        generateError(result.error);
      } else {
        setUser(result.user);
        setEmail(result.user.email);
        setFullName(result.user.fullName);
        setMobile(result.user.mobile);
        setProfilePic(result.user.profilePic);
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        email.trim() === "" ||
        fullName.trim() === "" ||
        profilePic.trim() === "" ||
        mobile.trim() === ""
      ) {
        generateError("Please Fill the password fields");
        return;
      }

      const id = userInfo._id;
      const result = await updateUserCall({
        id,
        data: { email, fullName, mobile, profilePic },
      }).unwrap();

      if (result.error) {
        generateError(result.error);
      } else {
        generateSuccess(result.message);
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  const handlePassCheck = async (e) => {
    e.preventDefault();
    setCheckPassLoading(true);
    try {
      if (currentPass.trim() === "") {
        generateError("Please Fill the password fields");
        return;
      }
      const id = userInfo._id;
      const result = await checkPasswordCall({
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

      const id = userInfo._id;
      const result = await updatePasswordCall({
        id,
        data: { password },
      }).unwrap();

      if (result.error) {
        generateError(result.error);
      } else {
        generateSuccess(result.message);
        setPassVerified(false);
        setCurrentPass("");
        setConfirmPass("");
        setPassword("");
      }
    } catch (error) {
      generateError(error.message);
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

  useEffect(() => {
    getUser();
  }, [userInfo]);

  return (
    <>
      <div className="lg:h-screen h-[120vh] bg-blue-gray-50 xl:px-40 py-10 p-10">
        <div className="h-[60vh] grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3 h-full ">
            <div className="rounded-md border border-stroke bg-white shadow-default  h-full">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark flex gap-4">
                <Link to={"/profile"} className="font-medium text-black">
                  Profile
                </Link>
                <Link to={"/bookings"} className="font-medium text-black">
                  Bookings
                </Link>
                <Link to={"/reservations"} className="font-medium text-black">
                  Reservations
                </Link>
              </div>

              <div className="flex justify-center items-center h-24 ">
                <div class="relative">
                  <img
                    class="rounded-full w-20 h-20 bg-black"
                    src={profilePic}
                    alt={" "}
                  />
                  <span
                    class="bottom-0 left-14 absolute w-3.5 h-3.5 border-2 rounded-full "
                    onClick={handleOpen}
                  >
                    {" "}
                    <FaCameraRetro />
                  </span>
                </div>
              </div>

              <div className="p-7">
                <form action="#" onSubmit={handleSubmit}>
                  <div className="mb-5 flex flex-col gap-5 sm:flex-row ">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black"
                        htmlFor="fullName"
                      >
                        Full Name
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
                          className=" w-full rounded border border-stroke bg-gray py-3 pl-12 pr-4 text-black focus:border-primary focus-visible:outline-none"
                          type="text"
                          name="fullName"
                          id="fullName"
                          placeholder="Devid Jhon"
                          defaultValue={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none"
                        type="number"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="+990 3343 7865"
                        defaultValue={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="emailAddress"
                    >
                      Email Address
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
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-12 pr-4 text-black focus:border-primary focus-visible:outline-none"
                        type="email"
                        name="emailAddress"
                        id="emailAddress"
                        placeholder="devidjond45@gmail.com"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      className="flex justify-center rounded bg-white py-2 px-6 font-medium text-black"
                      type="submit"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray "
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-span-5 xl:col-span-2 h-full">
            <div className="rounded-md border border-stroke bg-white shadow-default  h-full">
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
          </div>
        </div>

        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div class="flex items-center justify-center w-full">
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
                      <span class="font-semibold">Click to upload</span> or drag
                      and drop
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    class="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
