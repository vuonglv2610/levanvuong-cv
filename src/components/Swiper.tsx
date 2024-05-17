import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

const SwiperComponent = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      className="flex w-[calc(100vw-320px)] h-screen [&_.swiper-wrapper]:flex overflow-hidden relative"
      // onSlideChange={() => console.log("slide change")}
      // onSwiper={(swiper) => console.log(swiper)}
      loop
      effect={"fade"}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
    >
      <SwiperSlide className="bg-red-400">
        <img
          className="w-full h-full object-cover"
          src="https://preview.colorlib.com/theme/elen/images/image_6.jpg.webp"
          alt="#"
        />
      </SwiperSlide>
      <SwiperSlide className="bg-blue-400">
        <img
          className="w-full h-full object-cover"
          src="https://preview.colorlib.com/theme/elen/images/image_5.jpg.webp"
          alt="#"
        />
      </SwiperSlide>
      <SwiperSlide className="bg-yellow-400">
        <img
          className="w-full h-full object-cover"
          src="https://preview.colorlib.com/theme/elen/images/image_4.jpg.webp"
          alt="#"
        />
      </SwiperSlide>
      <SwiperSlide className="bg-orange-400">
        <img
          className="w-full h-full object-cover"
          src="https://preview.colorlib.com/theme/elen/images/image_3.jpg.webp"
          alt="#"
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default SwiperComponent;
