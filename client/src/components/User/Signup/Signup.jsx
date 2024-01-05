import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGoogleRegisterMutation,
  useRegisterMutation,
} from "../../../Redux/Slices/userApi/usersApiSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner/Spinner";
import { Button } from "@material-tailwind/react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { setCredentials } from "../../../Redux/Slices/authSlice";

const Signup = () => {
  const [fisrtName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [user, setUser] = useState([]);
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [userRegisterGoogle] = useGoogleRegisterMutation();

  const { userInfo } = useSelector((state) => state.user);

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

  const handleMobileChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setMobile(numericValue);
  };
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }),
    [userInfo];

  const submitHandler = async (e) => {
    e.preventDefault();
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (
      fisrtName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      mobile.trim() === "" ||
      password.trim() === ""
    ) {
      return generateError("Please fill all the required fields");
    } else if (
      password.length < 7 ||
      (password.length > 17 && !strongPasswordRegex.test(password))
    ) {
      return generateError("Please enter a strong password");
    } else if (password !== confirmPassword) {
      return generateError("Please Enter Matching Passwords");
    } else {
      try {
        const res = await register({
          fisrtName,
          lastName,
          email,
          password,
          mobile,
        }).unwrap();

        console.log(res);
        if (res.user) {
          generateSuccess("Verification mail Send, check your email");
          setTimeout(() => {
            window.open("https://mail.google.com/", "_blank");
          }, 2000);
        } else {
          return generateError(res.error);
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
          userRegisterGoogle(res.data)
            .unwrap()
            .then((result) => {
              if (result.error) {
                generateError(result.error);
              } else {
                console.log(result.user);
                dispatch(setCredentials(result.user));
                navigate("/owner");
              }
            });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <>
      <div className="w-full  border bg-gray-100">
        <div className="relative w-11/12 lg:w-7/12 md:w-9/12 mx-auto m-12 px-8 bg-white rounded-md shadow-md">
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
                  to={"/login"}
                  className="font-normal text-[#333333] text-base ml-2 underline"
                >
                  Sign In
                </Link>
              </div>
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
                    {isLoading ? (
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="w-3/4 md:w-2/4 bg-blue-100 text-white text-base font-medium py-3 rounded hover:bg-blue-950 mt-4"
                      >
                        <div className="mx-[50%]">
                          <Spinner />
                        </div>
                      </button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-3/4 md:w-2/4 bg-blue-100 text-white text-base font-medium py-3 rounded hover:bg-blue-950 mt-4"
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </form>

                <div className=" w-full flex justify-center gap-1 my-2 h-12 items-center">
                  <div
                    onClick={() => login()}
                    className=" flex justify-center items-center px-10 py-2 text-gray-400 border rounded-md text-sm font-light font-poppins"
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

export default Signup;
