import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../../Redux/Slices/userApi/usersApiSlice";
import { setCredentials } from "../../../Redux/Slices/authSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner/Spinner";
import { generateError } from "../../Dependencies/toast";
import { Button } from "@material-tailwind/react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (email.trim() === "" || password.trim() === "") {
        toast.error("Please Fill all the fields");
        return;
      }
      const res = await login({ email, password }).unwrap();
      if (res.error) {
        generateError(res.error);
      } else {
        dispatch(setCredentials({ ...res }));
        navigate("/");
      }
    } catch (err) {
      generateError(err?.data?.message || err.error);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

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
          login({ email: res.data.email, password: res.data.id })
            .unwrap()
            .then((result) => {
              if (result.error) {
                generateError(result.error);
              } else {
                console.log(result);
                dispatch(setCredentials(result));
                navigate("/");
              }
            });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="min-h-[84vh] bg-gray-100 flex justify-center items-center">
      <div className="w-4/5 xl:w-2/5 lg:w-2/4 md:w-3/5 bg-white rounded-lg shadow-md px-6 pb-10">
        <div className="mb-6">
          <div className=" ml-6 pt-10 font-semibold text-[#252525] text-2xl leading-[48px]">
            Log in
          </div>
          <div className=" flex ml-8">
            <div className="font-normal text-[#696969] text-base">
              Not a User...?
            </div>
            <Link
              to={"/signup"}
              className="font-normal text-[#333333] text-base ml-2 underline"
            >
              Sign up
            </Link>
          </div>
        </div>
        <div></div>
        <form onSubmit={submitHandler}>
          <div className="mx-6 flex-row justify-between">
            <div className="w-ful">
              <label
                className="block text-gray-700 text-base mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                type="email"
                name="email"
                id="email"
                autoComplete="username"
                placeholder="Your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-full my-6">
              <label
                className="block text-gray-700 text-base mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full bg-gray-200 border border-gray-300 rounded px-4 py-3"
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            {isLoading ? (
              <Button
                onClick={(e) => e.preventDefault}
                className="w-3/12 mt-6 md:w-2/4 flex justify-center  bg-blue-100 text-white text-base font-medium py-3 rounded hover:bg-blue-950"
              >
                <Spinner />
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-3/12 mt-6 md:w-1/4  bg-blue-100 text-white text-base font-medium py-3 rounded hover:bg-blue-950"
              >
                Login
              </Button>
            )}
          </div>
          <div className="flex justify-center ml-6 md:justify-start">
            <p className="cursor-pointer text-gray-400 hover:text-gray-600 mt-1">
              {/* Forgot Password...? */}
            </p>
          </div>
        </form>
        <div className=" w-full flex justify-center gap-1 my-2 h-12 items-center">
          <div
            onClick={() => loginGoogle()}
            className=" flex justify-center items-center px-10 py-2 text-gray-400 border rounded-md text-sm font-light font-poppins"
          >
            Signup With <FcGoogle />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
