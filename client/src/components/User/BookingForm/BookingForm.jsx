import React, { useEffect, useState } from "react";
import {
  useBookPropertyMutation,
  useGetSinglePropertyMutation,
} from "../../../Redux/Slices/userApi/usersApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useFormik } from "formik";
import * as Yup from "yup";
import PayPal from "../PayPal/PayPal";
import SuccessTick from "../../Dependencies/Successtik/Successtik";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import { useSelector } from "react-redux";
import { IoIosInformationCircleOutline } from "react-icons/io";
import BookingFormToggle from "../../Dependencies/BookingFormToggle/BookingFormToggle";

const BookingForm = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [property, setProperty] = useState();
  const [paymentDone, setPaymentDone] = useState(false);
  const [getSinglePropertyCall] = useGetSinglePropertyMutation();
  const { id } = useParams();
  const [bookingCall, { isLoading }] = useBookPropertyMutation();
  const [option, setOption] = useState("Book");
  const [showInfo, setShowInfo] = useState(false);

  const fetchProperty = async () => {
    try {
      const res = await getSinglePropertyCall(id).unwrap();
      setProperty(res.property);
    } catch (error) {
      throw new Error('System Error:- "Error While Fetching Property Data"');
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  const handleSubmit = async (bookingData) => {
    try {
      const bookingInfo = {};
      bookingInfo.tokenPaid = paymentDone;
      bookingInfo.email = bookingData.email;
      bookingInfo.user = userInfo._id;
      bookingInfo.mobile = bookingData.mobile;
      bookingInfo.fullName = bookingData.fName;
      bookingInfo.tokenAmount = property.property_rent;
      bookingInfo.property = id;
      option === "Book"
        ? (bookingInfo.startDate = bookingData.sdate)
        : (bookingInfo.interest = bookingData.interest);
      bookingInfo.owner = property.owner;

      const result = await bookingCall({ bookingInfo }).unwrap();
      if (result.error) {
        return generateError(result.error);
      } else {
        console.log(result);
        generateSuccess(result.message);
        if (paymentDone) {
          navigate(`/bookingSuccessful/${result.booked._id}`);
        } else {
          navigate(`/reservations`);
        }
        return;
      }
    } catch (error) {
      generateError(error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      fName: "",
      sdate: "",
      mobile: "",
      email: "",
      interest: "",
    },

    validationSchema: Yup.object().shape({
      fName: Yup.string().required("Full Name is required"),
      sdate:
        option === "Book"
          ? Yup.date()
              .required("Re-Location Date is required")
              .test("valid-date", "Invalid date format", function (value) {
                return value instanceof Date && !isNaN(value);
              })
              .test("valid-date", "Insert an available date", function (value) {
                return value > new Date();
              })
          : Yup.date(),
      mobile: Yup.string().required("Mobile is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      interest:
        option === "Reserve"
          ? Yup.string().required("Interest is required")
          : Yup.string(),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  if (!property) {
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

  const initialOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="min-h-[80vh] bg-blue-gray-50 xl:px-80 xl:py-10 lg:px-48 md:px-28 md:py-10 p-10">
        <div className="col-span-5 xl:col-span-3 h-full ">
          <div className="rounded-md border border-stroke bg-white shadow-xl pb-10 h-full">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="text-2xl font-medium font-poppins text-blue-100 py-3">
                Book Property
              </h3>
            </div>

            <div className="p-7">
              <form onSubmit={formik.handleSubmit}>
                <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3 lg:w-1/2">
                    <div className="mb-5">
                      <label
                        htmlFor="fName"
                        className="mb-3 block text-base font-medium text-[#07074D]"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fName"
                        id="fName"
                        placeholder="Full Name"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fName}
                      />
                      {formik.touched.fName && formik.errors.fName ? (
                        <div className="text-red-500">
                          {formik.errors.fName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {option === "Book" ? (
                    <div className="w-full px-3 lg:w-1/2">
                      <div className="mb-5">
                        <label
                          htmlFor="sdate"
                          className="mb-3 block text-base font-medium text-[#07074D]"
                        >
                          Re-Location Date
                        </label>
                        <input
                          type="date"
                          name="sdate"
                          id="sdate"
                          placeholder="Re-Location Date"
                          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.sdate}
                        />
                        {formik.touched.sdate && formik.errors.sdate ? (
                          <div className="text-red-500">
                            {formik.errors.sdate}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full px-3 lg:w-1/2">
                      <div className="mb-5">
                        <label
                          htmlFor="interest"
                          className="mb-3 block text-base font-medium text-[#07074D]"
                        >
                          Interest{" "}
                          <span className="text-sm font-light">(optional)</span>
                        </label>
                        <select
                          name="interest"
                          id="interest"
                          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.interest}
                        >
                          <option value="" disabled>
                            Select a level of interest
                          </option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="veryHigh">Very High</option>
                        </select>
                        {formik.touched.interest && formik.errors.interest ? (
                          <div className="text-red-500">
                            {formik.errors.interest}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3 lg:w-1/2">
                    <div className="mb-5">
                      <label
                        htmlFor="Mobile"
                        className="mb-3 block text-base font-medium text-[#07074D]"
                      >
                        Mobile
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        id="mobile"
                        placeholder="Mobile"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.mobile}
                      />
                      {formik.touched.mobile && formik.errors.mobile ? (
                        <div className="text-red-500">
                          {formik.errors.mobile}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full px-3 lg:w-1/2">
                    <div className="mb-5">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-base font-medium text-[#07074D]"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Email"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mx-4 my-2">
                  <BookingFormToggle setOption={setOption} />
                </div>

                <div
                  className={`mx-4 my-4 transition-opacity duration-1000 ${
                    option === "Reserve" ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {option === "Book" && (
                    <>
                      <div className=" ml-4 text-2xl font-ubuntu font-semibold flex items-center gap-2">
                        <span>Pay Token : </span>
                      </div>
                      <div className="ms-4 lg:flex flex-wrap">
                        <div className="w-full px-3 ">
                          <div>
                            <div className="h-16 text-lg font-ubuntu font-semibold flex items-center">
                              <span className="">
                                Token Amount :{" "}
                                <span className="text-green-600 ">$</span>
                                {property.property_rent / 80}
                              </span>
                            </div>

                            {paymentDone ? (
                              <div className="flex justify-center">
                                <div className="flex justify-center items-center">
                                  <p className="text-base font-ubuntu font-semibold">
                                    Token Payment Done
                                  </p>
                                  <SuccessTick />
                                </div>
                              </div>
                            ) : (
                              <PayPal
                                property={property}
                                paymentDone={paymentDone}
                                setPaymentDone={setPaymentDone}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`mx-4 my-4 transition-opacity duration-1000 ${
                    option === "Reserve" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {option === "Reserve" && (
                    <>
                      <div className="flex text-sm w-2/3 font-light text-gray-700">
                        <span
                          className={
                            showInfo ? "text-lg " : "text-lg text-sky-400"
                          }
                        >
                          <IoIosInformationCircleOutline
                            className="hover:cursor-pointer"
                            onClick={() => {
                              setShowInfo(!showInfo);
                            }}
                          />
                        </span>
                        <span className="h-16">
                          Reserving A property means
                          {!showInfo && <span>..... </span>}{" "}
                          {showInfo && (
                            <span>
                              that others can also reserve the property and
                              there is a chance that someone will beat you to
                              the booking process. We do not recommend you to
                              reserve the property, as it does not give you any
                              benefits.
                            </span>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  type="submit"
                  className="border float-right border-black rounded-md bg-white py-3 px-8 text-center text-base font-semibold text-black hover:bg-black hover:text-white"
                >
                  {option}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default BookingForm;
