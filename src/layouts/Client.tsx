import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ClientLayout = () => {
  return (
    <>
      <div className="flex text-white">
        <Navbar />
        <div className="ml-[300px] w-full">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClientLayout;
