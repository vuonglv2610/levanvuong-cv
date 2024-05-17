import React from "react";

const GalleryItem = () => {
  return (
    <div className="animation-parent gallery-item relative w-[400px] h-[400px] overflow-hidden">
      <img
        className="w-full h-full object-cover"
        src="https://preview.colorlib.com/theme/elen/images/image_3.jpg.webp"
        alt="Gallery"
      />
      <div className="animation-gallery absolute bottom-[-73px] left-1/2 translate-x-[-50%] bg-white text-black w-full py-3">
        <div className="mb-3">Gallery-name</div>
        <div className="text-[#dddddd]">Gallery-desc</div>
      </div>
    </div>
  );
};

export default GalleryItem;
