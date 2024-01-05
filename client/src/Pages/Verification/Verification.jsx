import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVerifyUserMutation } from "../../Redux/Slices/userApi/usersApiSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import VerificationSpinner from "../../components/User/Spinner/VerificationSpinner";

const generateError = (err) => {
  toast.error(err, {
    position: "top-center",
  });
};


const Verification = () => {
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [msg,setMsg] = useState(false)


  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyUser(id).unwrap();
        console.log('');

        setTimeout(() => {
          setMsg(true)
        }, 2000);

        setTimeout(() => {
          navigate('/login')
        }, 4000);
        
      } catch (err) {
        generateError(err?.data?.message || err.error);
      }
    };

    verify();
  }, [id, verifyUser, dispatch]);
  return (
    <div >
      <VerificationSpinner msg={msg} />
    </div>
  );
};

export default Verification;
