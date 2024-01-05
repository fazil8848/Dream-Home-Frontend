import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  useBlockOwnerMutation,
  useGetOwnersMutation,
} from "../../../Redux/Slices/adminApi/adminApislice";
import { generateError } from "../../Dependencies/toast";

const TABLE_HEAD = ["Name", "Email", "Phone", "Block"];

function ConfirmationDialog({ open, blocked, handleOpen, handleBlocking }) {
  return (
    <Dialog className="w-5/12" open={open} handler={handleOpen}>
      <DialogHeader>
        {blocked ? (
          <Typography variant="h5" color="blue-gray">
            Confirm To Unblock this user
          </Typography>
        ) : (
          <Typography variant="h5" color="blue-gray">
            Confirm To Block this user
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

        {blocked ? (
          <Typography className="text-center font-normal">
            Are you sure you want to Unblock this user
          </Typography>
        ) : (
          <Typography className="text-center font-normal">
            Are you sure you want to Block this user
          </Typography>
        )}
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" color="blue-gray" onClick={handleOpen}>
          close
        </Button>
        {blocked ? (
          <Button
            variant="gradient"
            className="bg-green-600 text-white "
            onClick={handleBlocking}
          >
            Ok, Sure..!
          </Button>
        ) : (
          <Button
            variant="gradient"
            className="bg-red-600 text-white"
            onClick={handleBlocking}
          >
            Ok, Sure..!
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}

function OwnerList() {
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState("");
  const [blocked, setBlocked] = useState(null);
  const [getOwnersCall] = useGetOwnersMutation();
  const [open, setOpen] = React.useState(false);
  const [blockUserCall, { isLoading }] = useBlockOwnerMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOwnersCall().unwrap();
        if (response.error) {
          generateError(res.error);
          return;
        }
        setOwners(response.owners);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpen = (is_Blocked, _id) => {
    setBlocked(is_Blocked);
    setOwnerId(_id);
    setOpen(!open);
  };

  const handleBlocking = async () => {
    try {
      const res = await blockUserCall({ ownerId }).unwrap();
      if (res.error) {
        generateError(res.error);
        return;
      } else {
        setOwners(res.owners);
        setBlocked(res.result.is_Blocked);
        setOpen(!open);
      }
    } catch (err) {
      generateError(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Card className="h-full w-screen md:w-full rounded-md shadow-2xl border px-4">
        <table className="min-w-max table-auto text-left ">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {owners?.map(
              ({ _id, fullName, email, mobile, is_Blocked }, index) => {
                const isLast = index === owners.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={fullName}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {fullName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {email}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {mobile}
                      </Typography>
                    </td>
                    <td className={classes}>
                      {is_Blocked ? (
                        <button
                          type="button"
                          onClick={() => handleOpen(is_Blocked, _id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 hover:bg-green-800 rounded-md"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Unblock user
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpen(is_Blocked, _id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 hover:bg-red-800 rounded-md"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Block user
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </Card>

      {/* Render the ConfirmationDialog component */}
      <ConfirmationDialog
        open={open}
        blocked={blocked}
        handleOpen={handleOpen}
        handleBlocking={handleBlocking}
      />
    </>
  );
}

export default OwnerList;
