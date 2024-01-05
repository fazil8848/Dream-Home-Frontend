import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import VerificationSpinner from "../../../components/Owner/Spinner/VerificationSpinner";
import { useOwnerVerifyMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";

const generateError = (err) => {
  toast.error(err, {
    position: "top-center",
  });
};


const VerificationOwner = () => {
  const [verifyUser] = useOwnerVerifyMutation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [msg,setMsg] = useState(false)


  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyUser(id).unwrap();

        setTimeout(() => {
          setMsg(true)
        }, 2000);

        setTimeout(() => {
          navigate('/owner/login')
        }, 4000);
        
      } catch (err) {
        generateError(err?.data?.message || err.error);
      }
    };

    verify();
  }, [id, verifyUser, dispatch]);
  return (
    <div>
      <VerificationSpinner msg={msg} />
    </div>
  );
};

export default VerificationOwner;
