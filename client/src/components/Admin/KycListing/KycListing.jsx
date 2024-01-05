import React, { useEffect, useState } from "react";
import {
  useApproveKycMutation,
  useGetKYCsMutation,
} from "../../../Redux/Slices/adminApi/adminApislice";
import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { FcApprove, FcDisapprove } from "react-icons/fc";
import { toast } from "react-toastify";
import { generateError, generateSuccess } from "../../Dependencies/toast";

const KycListing = () => {
  const [getKycs] = useGetKYCsMutation();
  const [approveKycCall] = useApproveKycMutation();
  const [Kycs, setKycs] = useState([]);
  const [kycId, setKycId] = useState("");
  const [approval, setApproval] = useState(null);
  const [open, setOpen] = useState(false);

  const getData = async () => {
    try {
      const result = await getKycs().unwrap();
      if (result.error) {
        return generateError(result.error);
      } else {
        setKycs(result.kycs);
      }
    } catch (error) {
      console.log("error getting kyc data", error.message);
    }
  };

  const handleOpen = (option, id) => {
    setApproval(option);
    setKycId(id);
    setOpen(true);
  };

  const handleApproval = async () => {
    try {
      const res = await approveKycCall({ approval, kycId }).unwrap();
      if (res.result) {
        setKycs(res.kycs);
        setOpen(false);
        generateSuccess(`KYC ${approval} successfully`);
      } else {
        generateError(res.error);
        return;
      }
    } catch (err) {
      generateError(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const TABLE_HEAD = ["Name", "Kyc ID", "Portrate", "PAN", "Approval"];

  return (
    <>
      <Card className="h-full w-screen lg:w-full rounded-md shadow-2xl border px-4">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={
                      index < TABLE_HEAD.length - 1
                        ? `font-normal border-r-2 border-gray-500 text-center leading-none opacity-70`
                        : `font-normal border-gray-500 text-center leading-none opacity-70`
                    }
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Kycs?.map(
              ({ _id, full_name, PAN, isApproved, portrate }, index) => {
                const isLast = index === Kycs.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal h-20 text-center flex items-center justify-center border-r-2 border-gray-500 leading-none opacity-70`}
                      >
                        {full_name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal h-20 text-center flex items-center justify-center border-r-2 border-gray-500 leading-none opacity-70`}
                      >
                        {_id}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal h-20 text-center flex items-center justify-center border-r-2 border-gray-500 leading-none opacity-70`}
                      >
                        <img className="w-20 h-20" src={portrate} alt="" />
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal h-20 text-center flex items-center justify-center border-r-2 border-gray-500 leading-none opacity-70`}
                      >
                        {PAN}
                      </Typography>
                    </td>
                    <td className={`${classes} `}>
                      {isApproved === "false" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpen("Disapproved", _id)}
                            data-modal-target="edit-user-modal"
                            data-modal-toggle="edit-user-modal"
                            className="me-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 hover:bg-red-800 rounded-md"
                          >
                            <FcDisapprove />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpen("Approved", _id)}
                            data-modal-target="edit-user-modal"
                            data-modal-toggle="edit-user-modal"
                            className="me-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 hover:bg-green-800 rounded-md"
                          >
                            <FcApprove />
                          </button>
                        </>
                      ) : (
                        <>
                          {isApproved === "Approved" && (
                            <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-green-500">
                              Approved
                            </p>
                          )}
                          {isApproved === "Disapproved" && (
                            <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-red-500">
                              Disapproved
                            </p>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </Card>
      <Dialog
        className="w-5/12"
        open={open}
        handler={handleOpen}
        style={{ backdropFilter: "blur(4px)" }}
      >
        <DialogHeader>
          {approval === "Approve" ? (
            <Typography variant="h5" color="blue-gray">
              Confirm To Approve this KYC
            </Typography>
          ) : (
            <Typography variant="h5" color="blue-gray">
              Confirm To Disapprove this KYC
            </Typography>
          )}
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-16 w-16 text-red-500"
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clipRule="evenodd"
            />
          </svg>

          {approval === "Approve" ? (
            <Typography className="text-center font-normal">
              Are you sure you want to Approve this KYC
            </Typography>
          ) : (
            <Typography className="text-center font-normal">
              Are you sure you want to Disapprove this KYC
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            close
          </Button>
          {approval === "Approve" ? (
            <Button
              variant="gradient"
              className="bg-green-600 text-white "
              onClick={handleApproval}
            >
              Ok, Sure..!
            </Button>
          ) : (
            <Button
              variant="gradient"
              className="bg-red-600 text-white"
              onClick={handleApproval}
            >
              Ok, Sure..!
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default KycListing;
