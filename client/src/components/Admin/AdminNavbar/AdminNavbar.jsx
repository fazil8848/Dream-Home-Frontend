import React from "react";
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  AccordionHeader,
  Typography,
  AccordionBody,
  Accordion,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { BsBuildingsFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa6";

import { NavLink } from "react-router-dom";

function AdminNavbar({ sidebarOpen, setSidebarOpen }) {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };


  return (
    <Card
    className={`${
      !sidebarOpen
        ? "hidden fixed top-0 left-0 z-40 w-64 mt-[3.8rem] h-screen drop-shadow-lg transition-transform -translate-x-full sm:translate-x-0"
        : "block fixed top-0 left-0 z-40 w-64 mt-[3.8rem] h-screen drop-shadow-lg transition-transform sm:translate-x-0"
    }`}>
      <List>
        <div className="px-2 pt-8">

          <NavLink
            to={"/admin"}
            end
            className={({ isActive }) =>
              isActive ? `bg-gray-200 text-gray-700 font-semibold` : ""
            }
          >
            <ListItem className=" p-2 hover:bg-gray-200">
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5 me-3" />
              </ListItemPrefix>
              Dashboard
            </ListItem>
          </NavLink>

          <NavLink
            to={"/admin/users"}
            className={({ isActive }) =>
              isActive ? `bg-gray-200 text-gray-700 font-semibold` : ""
            }
          >
            <ListItem className=" p-2 hover:bg-gray-200">
              <ListItemPrefix>
                <FaUsers className="h-5 w-5 me-3" />
              </ListItemPrefix>
              Users
            </ListItem>
          </NavLink>

          <Accordion
            open={open === 1}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  open === 1 ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5 me-2" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Owner
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">

                <NavLink
                  to={"/admin/owners"}
                  className={({ isActive }) =>
                    isActive ? `bg-gray-200 text-gray-700 font-semibold` : ""
                  }
                >
                  <ListItem className=" p-2 hover:bg-gray-200">
                    <ListItemPrefix>
                      <FaUsers className="h-5 w-5 me-3" />
                    </ListItemPrefix>
                    Owners
                  </ListItem>
                </NavLink>

                <NavLink
                  to={"/admin/kycs"}
                  className={({ isActive }) =>
                    isActive ? `bg-gray-200 text-gray-700 font-semibold` : ""
                  }
                >
                  <ListItem className=" p-2 hover:bg-gray-200">
                    <ListItemPrefix>
                      <FaUsers className="h-5 w-5 me-3" />
                    </ListItemPrefix>
                    KYC Management
                  </ListItem>
                </NavLink>

              </List>
            </AccordionBody>
          </Accordion>

          <NavLink
            to={"/admin/properties"}
            className={({ isActive }) =>
              isActive ? `bg-gray-200 text-gray-700 font-semibold` : ""
            }
          >
            <ListItem className=" p-2 hover:bg-gray-200">
              <ListItemPrefix>
                <BsBuildingsFill className="h-5 w-5 me-3" />
              </ListItemPrefix>
              Properties
            </ListItem>
          </NavLink>

          <NavLink>
            <ListItem className=" p-2 hover:bg-gray-200">
              <ListItemPrefix>
                <InboxIcon className="h-5 w-5 me-3" />
              </ListItemPrefix>
              Inbox
              <ListItemSuffix>
                {' '}
              </ListItemSuffix>
            </ListItem>
          </NavLink>

          <NavLink>
            <ListItem className=" p-2 hover:bg-gray-200">
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5 me-3" />
              </ListItemPrefix>
              Settings
            </ListItem>
          </NavLink>

        </div>
      </List>
    </Card>
  );
};

export default AdminNavbar;
