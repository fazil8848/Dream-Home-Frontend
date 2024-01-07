import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { generateError, generateSuccess } from "../../Dependencies/toast";
import { useNavigate } from "react-router-dom";

const PayPal = ({ property, paymentDone, setPaymentDone }) => {
  const createOrder = async (data, actions) => {
    console.log(data, "createOrder Data");
    const cost = Math.floor(property.property_rent / 80);

    return fetch(`${process.env.REACT_APP_USERS_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        property: {
          cost,
        },
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };

  const onApprove = async (data, actions) => {
    try {
      console.log(data, "dataa");
      const response = await fetch(
        `${process.env.REACT_APP_USERS_URL}/orders/${data.orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        generateError("Error capturing PayPal order");
      } else {
        const responseData = await response.json();
        if (responseData.status === "COMPLETED") {
          generateSuccess("Payment successful");
          setPaymentDone(true);
        } else {
          generateError(responseData.error);
        }
      }
    } catch (error) {
      console.error("Error in onApprove:", error);
    }
  };

  return (
    <>
      <PayPalButtons
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      />
    </>
  );
};

export default PayPal;
