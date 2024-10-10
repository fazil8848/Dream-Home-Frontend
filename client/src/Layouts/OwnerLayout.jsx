import React, { useEffect, useState } from "react";
import OwnerHeader from "../components/Owner/OwnerHeader/OwnerHeader";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OwnerNav from "../components/Owner/OwnerNav/OwnerNav";

const OwnerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <OwnerNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-auto card">
          <OwnerHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <div
            className={`transition-margin duration-300 ${
              sidebarOpen ? "ml-64" : ""
            }`}
          >
            <ToastContainer />
            <main className=" w-full h-screen">
              <div className="mx-auto my-16 max-w-screen-2xl px-1 md:px-3 py-4 md:py-6 2xl:px-10">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerLayout;
