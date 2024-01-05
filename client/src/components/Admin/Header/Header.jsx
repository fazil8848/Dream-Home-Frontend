import React from "react";
import { Button } from "@material-tailwind/react";
import { adminLogout } from "../../../Redux/Slices/adminAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAdminLogoutMutation } from "../../../Redux/Slices/adminApi/adminApislice";
import { NavLink, useNavigate } from "react-router-dom";
import { TbLayoutSidebarRightExpand, TbLogout2 } from "react-icons/tb";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { generateError } from "../../Dependencies/toast";

function Header({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const [logoutCall] = useAdminLogoutMutation();
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state) => state.admin);

  const logoutHandlder = async () => {
    try {
      const res = await logoutCall().unwrap();
      if (res.error) {
        generateError(res.error);
      } else {
        const data = dispatch(adminLogout());
        navigate("/admin/login");
      }
    } catch (err) {
      generateError(err?.data?.message || err.error);
    }
  };

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="fixed px-8 top-0 z-50 flex w-full bg-white drop-shadow-md">
      <nav
        className="mx-auto flex w-full justify-between p-2.5 lg:px-8"
        aria-label="Global"
      >
        <div className="flex  ">
          <NavLink to={"/admin"} className="-m-1.5 p-1.5">
            <span className="text-2xl text-blue-100 ">Admin Panel</span>
            {/* <img
              className="h-10 w-auto "
              src="https://res.cloudinary.com/dn6anfym7/image/upload/v1698481855/dreamHome/crmkxhhd0fhhcb8kbk0x.png"
              alt="logo"
            /> */}
          </NavLink>
        </div>

        <div className={`flex gap-4`}>
          <>
            {adminInfo && (
              <>
                <Button
                  variant="outlined"
                  color="gray"
                  className="flex gap-2 font-normal text-black me-5 justify-center items-center"
                  onClick={logoutHandlder}
                >
                  LogOut
                  <span aria-hidden="true">
                    <TbLogout2 />
                  </span>
                </Button>

                <NavLink
                  onClick={handleToggle}
                  className={`flex justify-between items-center text-sm font-semibold`}
                >
                  {sidebarOpen ? (
                    <AiOutlineCloseCircle className="w-8 h-8 mt-1 text-blue-100 my-auto" />
                  ) : (
                    <TbLayoutSidebarRightExpand className="w-8 h-8 mt-1 text-blue-100 my-auto" />
                  )}
                </NavLink>
              </>
            )}
          </>
        </div>
      </nav>
    </header>
  );
}

export default Header;
