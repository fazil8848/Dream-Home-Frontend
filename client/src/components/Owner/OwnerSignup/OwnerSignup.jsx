import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../Spinner/Spinner";
import {
  useGoogleRegisterOwnerMutation,
  useOwnerSignupMutation,
} from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { setOwnerCredentials } from "../../../Redux/Slices/ownerApi/ownerAuthSlicel";

const OwnerSignup = () => {
  const [fisrtName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [register, { isLoading }] = useOwnerSignupMutation();
  const [googleRegister] = useGoogleRegisterOwnerMutation();

  const { ownerInfo } = useSelector((state) => state.owner);

  const [user, setUser] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const generateError = (err) => {
    toast.error(err, {
      position: "top-center",
    });
  };

  const generateSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
    });
  };

  useEffect(() => {
    if (ownerInfo) {
      navigate("/owner");
    }
  }),
    [ownerInfo];

  const handleMobileChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setMobile(numericValue);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (
      fisrtName === "" ||
      lastName === "" ||
      email === "" ||
      mobile === "" ||
      password === ""
    ) {
      generateError("Please fill all the required fields");
    } else if (
      password.length < 7 ||
      (password.length > 17 && !strongPasswordRegex.test(password))
    ) {
      generateError("Please enter a strong password");
    } else if (password !== confirmPassword) {
      generateError("Please Enter Matching Passwords");
    } else {
      try {
        const res = await register({
          fisrtName,
          lastName,
          email,
          password,
          mobile,
        }).unwrap();

        if (res.user) {
          generateSuccess("Verification mail Send, check your email");
          setTimeout(() => {
            window.open("https://mail.google.com/", "_blank");
          }, 2000);
        } else {
          generateError(res.error);
          return;
        }
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          googleRegister(res.data)
            .unwrap()
            .then((result) => {
              if (result.error) {
                generateError(result.error);
              } else {
                console.log(result.user);
                dispatch(setOwnerCredentials(result.user));
                navigate("/");
              }
            });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <>
      <div className="w-full  border bg-loginBg bg-cover bg-center pt-16">
        <div className="relative w-11/12 md:w-7/12 mx-auto m-12 px-8 bg-white-50 rounded-md shadow-2xl">
          <div className=" mx-auto ">
            <div className="relative pb-16">
              <div className=" ml-8 pt-10 font-semibold text-[#252525] text-2xl leading-[48px]">
                Create An Account
              </div>
              <div className=" flex ml-8">
                <div className="font-normal  text-[#696969] text-base">
                  Existing User..?
                </div>
                <Link
                  to={"/owner/login"}
                  className="font-normal text-[#333333] text-base ml-2 underline"
                >
                  Sign In
                </Link>
              </div>
              <div className="h-0.5 my-3 bg-blue-100 "></div>
              <div>
                <form onSubmit={submitHandler} className="mt-8">
                  <div className="px-2 w-full flex my-3 justify-between gap-4">
                    <div className="w-1/2 flex-col">
                      <div className="my-1">
                        <label className="text-gray-600">First name</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="w-full border-1 border-sky-100 bg-gray-200  rounded px-4 py-3"
                          placeholder="First name...."
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-1/2 flex-col">
                      <div className="my-1">
                        <label className="text-gray-600">Last name</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                          placeholder="Last name...."
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-2 w-full flex my-3 justify-between gap-4">
                    <div className="w-1/2 flex-col">
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
                        />
                      </div>
                    </div>
                    <div className="w-1/2 flex-col">
                      <div className="my-1">
                        <label className="text-gray-600">Mobile</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                          placeholder="Mobile...."
                          onChange={handleMobileChange}
                          value={mobile}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-2 w-full flex my-3 justify-between gap-4">
                    <div className="w-1/2 flex-col">
                      <div className="my-1">
                        <label className="text-gray-600">Password</label>
                      </div>
                      <div>
                        <input
                          type="password"
                          className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                          placeholder="Password...."
                          autoComplete="new-password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-1/2 flex-col">
                      <div className="my-1">
                        <label className="text-gray-600">
                          Confirm Password
                        </label>
                      </div>
                      <div>
                        <input
                          type="password"
                          className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                          placeholder="Confirm Password...."
                          autoComplete="new-password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" w-full flex justify-center ">
                    <button
                      type="submit"
                      className="w-3/4 md:w-2/4 bg-blue-100 text-white text-base font-medium py-3 rounded hover:bg-blue-950 mt-4"
                    >
                      {isLoading ? (
                        <div className="mx-[50%]">
                          <Spinner />
                        </div>
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                </form>
                <div className=" w-full flex justify-center gap-1 my-2 h-12 items-center">
                  <div
                    onClick={() => login()}
                    className=" flex justify-center items-center hover:text-black hover:bg-white bg-black px-10 py-2 text-white border rounded-md font-light font-poppins"
                  >
                    Signup With <FcGoogle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerSignup;
