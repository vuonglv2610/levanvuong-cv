import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  className?: string;
}

const Card = ({ className = "" }: CardProps) => {
  return (
    <div className={`text-left w-[380px] px-[15px] ${className}`}>
      <Link to="/admin/product/1">
        <img
          className="w-[350px] h-[330px] object-cover"
          src="https://preview.colorlib.com/theme/elen/images/image_1.jpg.webp"
          alt="img-post"
        />
      </Link>
      <div className="mt-[16px] pt-[8px]">
        <Link
          to="#"
          className="text-[#f05d23] uppercase text-[12px] tracking-[1px] mb-3 block"
        >
          TECHNOLOGY
        </Link>
        <div className="text-[22px] font-bold mb-4 text-black">
          The Newest Technology On This Year 2019
        </div>
        <div className="text-[#999999] text-[15px] font[500] leading-[1.8] mb-4">
          Even the all-powerful Pointing has no control about the blind texts it
          is an almost
        </div>
        <Link
          to="1"
          className="continue-read text-[#f05d23] flex items-center gap-2"
        >
          {/* Continue Reading <FontAwesomeIcon icon={faAngleRight} /> */}
        </Link>
      </div>
    </div>
  );
};

export default Card;
