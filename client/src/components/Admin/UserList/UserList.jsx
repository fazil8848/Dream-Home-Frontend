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
  useBlockUserMutation,
  useGetUsersMutation,
} from "../../../Redux/Slices/adminApi/adminApislice";
import { generateError, generateSuccess } from "../../Dependencies/toast";

const TABLE_HEAD = ["Name", "Email", "Phone", "Block"];

function UserList() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [blocked, setBlocked] = useState(null);
  const [getUsersCall] = useGetUsersMutation();
  const [open, setOpen] = React.useState(false);
  const [blockUserCall, { isLoading }] = useBlockUserMutation();
 
 
  const fetchData = async () => {
    try {
      const response = await getUsersCall().unwrap();
      if (response.error) {
        generateError(response.error);
      } else {
        setUsers(response.users);
      }
    } catch (error) {
      generateError("Error fetching users", error);
    }
  };
  
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (is_Blocked, _id) => {
    setBlocked(is_Blocked);
    setUserId(_id);
    setOpen(!open);
  };

  const handleBlocking = async () => {
    try {
      const res = await blockUserCall({ userId }).unwrap();
      if (res.error) {
        generateError(res.error);
        return;
      } else {
        generateSuccess("User updated successfully");
        setUsers(res.users);
        setOpen(!open);
      }
    } catch (err) {
      generateError(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Card className="h-full w-screen lg:w-full rounded-md shadow-2xl border px-4">
        <table className="w-full min-w-max table-auto text-left">
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
            {users.map(
              ({ _id, fullName, email, mobile, is_Blocked }, index) => {
                const isLast = index === users.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
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
                      {/* <button
                    type="button"
                    data-modal-target="edit-user-modal"
                    data-modal-toggle="edit-user-modal"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-900 rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Edit user
                  </button> */}
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

      <Dialog className="w-5/12 " open={open} handler={handleOpen}>
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
    </>
  );
}

export default UserList;
