import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { generateError } from "../../Dependencies/toast";
import { useGetBookedDetailsMutation } from "../../../Redux/Slices/userApi/usersApiSlice";

const BookingCompleted = () => {
  const { bookingId } = useParams();
  const [getBookingCall] = useGetBookedDetailsMutation();
  const [bookingDetail, setBookingDetail] = useState({});
  const [user, setUser] = useState({});
  const [property, setProperty] = useState({});

  const fetchBooking = async () => {
    try {
      const result = await getBookingCall({ bookingId }).unwrap();
      if (result.error) {
        return generateError(result.error);
      }
      const { user, property } = result.booking;
      setBookingDetail(result.booking);
      setUser(user);
      setProperty(property);
    } catch (error) {
      generateError(error.message);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  // const handlePrint = () => {
  //   // Create a new window for printing
  //   const printWindow = window.open('', '_blank');

  //   // Create a style element with print-only CSS
  //   const style = document.createElement('style');
  //   style.innerHTML = `
  //     @media print {
  //       body * {
  //         display: none;
  //       }
  //       .print-section, .print-section * {
  //         display: block;
  //       }
  //     }
  //   `;

  //   // Append the style to the print window
  //   printWindow.document.head.appendChild(style);

  //   // Clone the content of the card and append it to the print window
  //   const printContent = document.querySelector('.print-section').cloneNode(true);
  //   printWindow.document.body.appendChild(printContent);

  //   // Trigger the print dialog
  //   printWindow.print();
  // };

  // Use another useEffect to log the updated state

  if (!bookingDetail) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center ">
        <div className="">
          <div className="animate-spin h-28 w-28">
            <div className="h-full w-full border-4 border-t-blue-100 border-b-blue-100 rounded-[50%]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-5  flex items-center justify-center w-screen min-h-screen">
      <Card className="w-full max-w-[30rem] border hadow-lg">
        <div class="success-animation ">
          <svg
            class="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              class="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              class="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <CardBody>
          <div className="mb-4 flex items-center justify-center ">
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-medium  font-ubuntu"
            >
              Payment Successful
            </Typography>
          </div>
          <div className="">
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500 font-ubuntu">
                Payment Type
              </Typography>
              <Typography className="text-black font-ubuntu">PayPal</Typography>
            </div>
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500 font-ubuntu">
                Payment Amount
              </Typography>
              <Typography className="text-black font-ubuntu">
                {" "}
                {bookingDetail.tokenAmount}{" "}
              </Typography>
            </div>
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500 font-ubuntu">
                {" "}
                Full Name{" "}
              </Typography>
              <Typography className="text-black font-ubuntu">
                {user.fullName}
              </Typography>
            </div>
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500 font-ubuntu">
                {" "}
                Mobile{" "}
              </Typography>
              <Typography className="text-black font-ubuntu">
                {" "}
                {user.mobile}{" "}
              </Typography>
            </div>
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500  font-ubuntu">
                {" "}
                Email{" "}
              </Typography>
              <Typography className="text-black font-ubuntu">
                {" "}
                {user.email}{" "}
              </Typography>
            </div>
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500 font-ubuntu">
                {" "}
                Property Name{" "}
              </Typography>
              <Typography className="text-black font-ubuntu">
                {" "}
                {property.property_name}{" "}
              </Typography>
            </div>
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500 font-ubuntu">
                {" "}
                Re-location Date{" "}
              </Typography>
              <Typography className="text-black font-ubuntu">
                {" "}
                {new Date(bookingDetail.startDate).toDateString()}{" "}
              </Typography>
            </div>
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500 font-ubuntu">
                {" "}
                Property Address
              </Typography>
              <Typography className="text-black font-ubuntu">
                {" "}
                {property.property_location?.address}{" "}
              </Typography>
            </div>
            <div className="flex justify-between py-1">
              <Typography className="text-gray-500 font-ubuntu">
                {" "}
                Property rent{" "}
              </Typography>
              <Typography className="text-black font-ubuntu">
                {" "}
                {property.property_rent}{" "}
              </Typography>
            </div>
          </div>
          <div className="group mt-4 inline-flex flex-wrap items-center gap-3">
            <Tooltip content="$129 per night">
              <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                    clipRule="evenodd"
                  />
                  <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                </svg>
              </span>
            </Tooltip>
            <Tooltip content="Free wifi">
              <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.371 8.143c5.858-5.857 15.356-5.857 21.213 0a.75.75 0 010 1.061l-.53.53a.75.75 0 01-1.06 0c-4.98-4.979-13.053-4.979-18.032 0a.75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.182 3.182c4.1-4.1 10.749-4.1 14.85 0a.75.75 0 010 1.061l-.53.53a.75.75 0 01-1.062 0 8.25 8.25 0 00-11.667 0 .75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.204 3.182a6 6 0 018.486 0 .75.75 0 010 1.061l-.53.53a.75.75 0 01-1.061 0 3.75 3.75 0 00-5.304 0 .75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.182 3.182a1.5 1.5 0 012.122 0 .75.75 0 010 1.061l-.53.53a.75.75 0 01-1.061 0l-.53-.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Tooltip>
            <Tooltip content="2 bedrooms">
              <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              </span>
            </Tooltip>
            <Tooltip content={`65" HDTV`}>
              <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M19.5 6h-15v9h15V6z" />
                  <path
                    fillRule="evenodd"
                    d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v11.25C1.5 17.16 2.34 18 3.375 18H9.75v1.5H6A.75.75 0 006 21h12a.75.75 0 000-1.5h-3.75V18h6.375c1.035 0 1.875-.84 1.875-1.875V4.875C22.5 3.839 21.66 3 20.625 3H3.375zm0 13.5h17.25a.375.375 0 00.375-.375V4.875a.375.375 0 00-.375-.375H3.375A.375.375 0 003 4.875v11.25c0 .207.168.375.375.375z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Tooltip>
            <Tooltip content="Fire alert">
              <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Tooltip>
            <Tooltip content="And +20 more">
              <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                +20
              </span>
            </Tooltip>
          </div>
        </CardBody>
        <CardFooter className="pt-3 flex gap-5">
          <Button
            className="bg-gray-500 hover:bg-black text-white hover:text-white border"
            size="lg"
            fullWidth={true}
          >
            Close
          </Button>
          <Button
            className="bg-blue-100 hover:bg-white hover:text-black shadow-none"
            size="lg"
            fullWidth={true}
            onClick={handlePrint}
          >
            Print
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingCompleted;
