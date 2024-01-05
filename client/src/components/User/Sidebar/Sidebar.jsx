import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";

import { useLogoutMutation } from "../../../Redux/Slices/userApi/usersApiSlice";
import { generateError } from "../../Dependencies/toast";
import { logout } from "../../../Redux/Slices/authSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TbLogout2 } from "react-icons/tb";
import { BiLogIn } from "react-icons/bi";
import { BsFillBuildingsFill, BsFillChatQuoteFill } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { useSocket } from "../../../Context/SocketContext";
import { useEffect } from "react";
import { VscBell } from "react-icons/vsc";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "white", // Set the background color to white
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "flex-end",
}));

export default function Sidebar() {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutCall] = useLogoutMutation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { notification } = useSocket();
  const [unread, setUnread] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logoutHandlder = async () => {
    try {
      const res = await logoutCall().unwrap();
      console.log(res);
      if (res.error) {
        generateError(res.error);
      } else {
        dispatch(logout());
        navigate("/");
      }
    } catch (err) {
      generateError(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    const notread = notification.filter((not) => not.read === false);
    setUnread(notread.length > 0);
  }, [notification]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar className="bg-white" position="fixed" open={open}>
        <Toolbar className="flex justify-between">
          <div className="flex">
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <NavLink to={"/"} className="-m-1.5 p-1.5">
              <Typography variant="h6" noWrap component="div">
                <img
                  className="h-10 w-auto "
                  src="https://res.cloudinary.com/dn6anfym7/image/upload/v1698481855/dreamHome/crmkxhhd0fhhcb8kbk0x.png"
                  alt="logo"
                />
              </Typography>
            </NavLink>
          </div>
          {userInfo && (
            <div className="flex items-center h-full">
              <NavLink
                to="/chat"
                className={`rounded p-2 border-1 border-grey`}
              >
                <BsFillChatQuoteFill size={28} className="text-black" />
              </NavLink>
              <NavLink to="/notifications" className={`text-black`}>
                {unread ? (
                  <img
                    className="h-6"
                    src="https://res.cloudinary.com/dn6anfym7/image/upload/v1704261832/dreamHome/icons/icons8-notification_ttmanm.gif"
                    alt="notification Bell"
                  />
                ) : (
                  <VscBell size={20} />
                )}
              </NavLink>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <NavLink
            to="/properties"
            className={({ isActive }) => {
              isActive
                ? "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black bg-gray-100"
                : "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black";
            }}
          >
            <ListItem key={"Properties"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Properties"} />
              </ListItemButton>
            </ListItem>
          </NavLink>
          <Divider />
          <NavLink
            to="/ownerBenefiets"
            className={({ isActive }) => {
              isActive
                ? "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black bg-gray-100"
                : "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black";
            }}
          >
            <ListItem key={"For Owners"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={"For Owners"} />
              </ListItemButton>
            </ListItem>
          </NavLink>
          <Divider />
          {/* <NavLink
            to="/reservations"
            className={({ isActive }) => {
              isActive
                ? "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black bg-gray-100"
                : "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black";
            }}
          >
            <ListItem key={"Reservations"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FaUserTie />
                </ListItemIcon>
                <ListItemText primary={"Reservations"} />
              </ListItemButton>
            </ListItem>
          </NavLink>
          <Divider /> */}
          <NavLink
            to="/blogs"
            className={({ isActive }) => {
              isActive
                ? "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black bg-gray-100"
                : "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black";
            }}
          >
            <ListItem key={"Blogs"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Blogs"} />
              </ListItemButton>
            </ListItem>
          </NavLink>
          <Divider />

          {userInfo ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => {
                  isActive
                    ? "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black bg-gray-100"
                    : "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black";
                }}
              >
                <ListItem key={"Profile"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <FaUserTie />
                    </ListItemIcon>
                    <ListItemText primary={"Profile"} />
                  </ListItemButton>
                </ListItem>
              </NavLink>
              <Divider />

              <NavLink
                className={({ isActive }) => {
                  isActive
                    ? "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black bg-gray-100"
                    : "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black";
                }}
                onClick={logoutHandlder}
              >
                <ListItem key={"Logout"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <TbLogout2 />
                    </ListItemIcon>
                    <ListItemText primary={"Logout"} />
                  </ListItemButton>
                </ListItem>
              </NavLink>
              <Divider />
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black bg-gray-100"
                    : "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black"
                }
              >
                <ListItem key={"Log in"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <BiLogIn />
                    </ListItemIcon>
                    <ListItemText primary={"Log in"} />
                  </ListItemButton>
                </ListItem>
              </NavLink>
              <Divider />
              <NavLink
                to="/owner/login"
                className={({ isActive }) => {
                  isActive
                    ? "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black bg-gray-100"
                    : "text-sm leading-6 text-gray-500 flex items-center py-1 hover:text-black";
                }}
              >
                <ListItem key={"Post Property"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <BsFillBuildingsFill className="mx-2" />
                    </ListItemIcon>
                    <ListItemText primary={"Post Property"} />
                  </ListItemButton>
                </ListItem>
              </NavLink>
              <Divider />
            </>
          )}
        </List>
      </Drawer>
    </Box>
  );
}
