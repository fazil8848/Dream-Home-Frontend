import React, { useState } from "react";
import './style.css'
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Header from "../components/Admin/Header/Header";
import AdminNavbar from "../components/Admin/AdminNavbar/AdminNavbar";
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className=" overflow-hidden bg-gray-100">

      <div className="flex h-screen overflow-hidden">
        <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-auto card">
          <Header
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
    </div>
  );
}

export default AdminLayout;
