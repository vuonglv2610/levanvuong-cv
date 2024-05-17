import React from "react";
import { Link, useParams } from "react-router-dom";

const DetailPage = () => {
  const { id } = useParams();
  // const dataDetail = useGetQuery("/comments/2");
  // console.log("dataDetail", dataDetail);
  return (
    <div className="flex gap-[60px]">
      <div className="w-[60%] text-left">
        <img
          className="w-full max-w-[730px] max-h-[400px] object-cover mb-[24px]"
          src="https://preview.colorlib.com/theme/elen/images/image_1.jpg.webp"
          alt="#"
        />
        <Link to="#" className="text-[12px] text-[#f05d23]">
          TECHNOLOGY
        </Link>
        <div className="text-[28px] mb-[24px] mt-[4px] font-bold">
          The Newest Technology On This Year 2019 The {id}
        </div>
        <div className="text-[#999999] mb-4">
          Even the all-powerful Pointing has no control about the blind texts it
          is an almost unorthographic life One day however a small line of blind
          text by the name of Lorem Ipsum decided to leave for the far World of
          Grammar.
        </div>
        <div className="relative">
          <div className="flex gap-[20px] align-bottom">
            <img
              className="w-[60px] h-[60px] rounded-[50%]"
              src="https://preview.colorlib.com/theme/elen/images/person_1.jpg.webp"
              alt="#"
            />
            <div className="mt-[20px]">
              <div>Written by</div>
              <div>
                <Link
                  to="#"
                  className="font-bold text-[18px] border-b-[1px] border-[#000000]"
                >
                  Dave Lewis
                </Link>
                , <span>Nov 28, 2018</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 flex gap-[20px]">
            <span className="flex gap-[10px]">
              {/* <FontAwesomeIcon icon={faHeart} />3 */}
            </span>
            <span className="flex gap-[10px]">
              {/* <FontAwesomeIcon icon={faEye} />3 */}
            </span>
            <span className="flex gap-[10px]">
              {/* <FontAwesomeIcon icon={faComment} />3 */}
            </span>
          </div>
        </div>
      </div>
      {/* <CommercialComponent /> */}
    </div>
  );
};

export default DetailPage;
