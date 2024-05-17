import React from "react";

const Footer = ({ isAdminLayout = false, classText='' }) => {
  return (
    <div
      className={`${
        !isAdminLayout && "ml-[300px] w-[calc(100vw-317px)]"
      } ${classText} bg-[#132238] text-white py-4`}
    >
      Copyright ©2024 All rights reserved | This template is made with by
      VuongLV
    </div>
  );
};

export default Footer;
