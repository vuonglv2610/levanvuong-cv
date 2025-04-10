import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const ClientLayout = () => {
  return (
    <div className="bg-[#f8f8fc]">
      <Header />
      {/* <SwiperComponent /> */}
      {/* <NavbarAdmin /> */}
      {/* <div className="ml-[300px] w-full"> */}
      <Outlet />
      {/* </div> */}
      <Footer />
    </div>
  );
};

export default ClientLayout;
