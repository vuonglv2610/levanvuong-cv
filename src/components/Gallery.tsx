import React from "react";
import GalleryItem from "./GalleryItem";
import SwiperComponent from "./Swiper";

const Gallery = () => {
  return (
    <>
      <SwiperComponent />
      <div className="flex flex-wrap">
       <GalleryItem />
       <GalleryItem />
       <GalleryItem />
       <GalleryItem />
       <GalleryItem />
       <GalleryItem />
       <GalleryItem />
       <GalleryItem />
      </div>
    </>
  );
};

export default Gallery;
