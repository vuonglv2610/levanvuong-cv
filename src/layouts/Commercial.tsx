import React from "react";
import { Link } from "react-router-dom";

const CommercialComponent = () => {
  return (
    <div className="flex-1 p-[25px]">
      <div className="mb-[50px]">
        <div className="text-[14px] font-bold tracking-[2px] mb-[30px] text-left">
          CATEGORIES
        </div>
        <ul>
          <li className="pb-[10px] mb-[10px] border-b-[1px] border-[#dee2e6] relative">
            <Link to="#" className="text-left block font-[500] text-[15px]">
              TECHNOLOGY
              <span className="absolute top-0 right-0 text-[#dee2e6]">(8)</span>
            </Link>
          </li>
          <li className="pb-[10px] mb-[10px] border-b-[1px] border-[#dee2e6] relative">
            <Link to="#" className="text-left block font-[500] text-[15px]">
              TECHNOLOGY
              <span className="absolute top-0 right-0 text-[#dee2e6]">(8)</span>
            </Link>
          </li>
          <li className="pb-[10px] mb-[10px] border-b-[1px] border-[#dee2e6] relative">
            <Link to="#" className="text-left block font-[500] text-[15px]">
              TECHNOLOGY
              <span className="absolute top-0 right-0 text-[#dee2e6]">(8)</span>
            </Link>
          </li>
          <li className="pb-[10px] mb-[10px] border-b-[1px] border-[#dee2e6] relative">
            <Link to="#" className="text-left block font-[500] text-[15px]">
              TECHNOLOGY
              <span className="absolute top-0 right-0 text-[#dee2e6]">(8)</span>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <div className="mb-[30px]">POPULAR PRODUCTS</div>
        <div className="flex gap-[24px] mb-[24px]">
          <img
            className="w-[80px] h-[80px] object-cover"
            src="https://preview.colorlib.com/theme/elen/images/image_2.jpg.webp"
            alt="#"
          />
          <div className="text-left">
            <div className="mb-[0.5rem] font-bold hover:text-[#f05d23]">
              <Link to="#">Even the all-powerful Pointing has no control</Link>
            </div>
            <div className="text-[#808080] text-[12px]">
              <Link to="#" className="mr-[5px]">
                {/* <FontAwesomeIcon icon={faCalendarDays} /> */}
                <span> Oct. 04, 2018</span>
              </Link>
              <Link to="#">
                {/* <FontAwesomeIcon icon={faUser} /> */}
                <span> Dave Lewis</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-[24px] mb-[24px]">
          <img
            className="w-[80px] h-[80px] object-cover"
            src="https://preview.colorlib.com/theme/elen/images/image_2.jpg.webp"
            alt="#"
          />
          <div className="text-left">
            <div className="mb-[0.5rem] font-bold hover:text-[#f05d23]">
              <Link to="#">Even the all-powerful Pointing has no control</Link>
            </div>
            <div className="text-[#808080] text-[12px]">
              <Link to="#" className="mr-[5px]">
                {/* <FontAwesomeIcon icon={faCalendarDays} /> */}
                <span> Oct. 04, 2018</span>
              </Link>
              <Link to="#">
                {/* <FontAwesomeIcon icon={faUser} /> */}
                <span> Dave Lewis</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-[24px]">
          <img
            className="w-[80px] h-[80px] object-cover"
            src="https://preview.colorlib.com/theme/elen/images/image_2.jpg.webp"
            alt="#"
          />
          <div className="text-left">
            <div className="mb-[0.5rem] font-bold hover:text-[#f05d23]">
              <Link to="#">Even the all-powerful Pointing has no control</Link>
            </div>
            <div className="text-[#808080] text-[12px]">
              <Link to="#" className="mr-[5px]">
                {/* <FontAwesomeIcon icon={faCalendarDays} /> */}
                <span> Oct. 04, 2018</span>
              </Link>
              <Link to="#">
                {/* <FontAwesomeIcon icon={faUser} /> */}
                <span> Dave Lewis</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialComponent;
