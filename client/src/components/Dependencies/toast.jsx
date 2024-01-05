import { toast } from "react-toastify";

export const generateSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
    });
};

export const generateError = (err) => {
    toast.error(err, {
      position: "top-center",
    });
};
  