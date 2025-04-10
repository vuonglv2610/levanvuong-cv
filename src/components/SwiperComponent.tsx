import React from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface propsSwiperType {
  className?: 'string'
}

const SwiperComponent = (props: propsSwiperType) => {
  const dataSlide = [
    {
      url: 'https://lh3.googleusercontent.com/gVSB0hwR3PPffHSS8AFdHY-hmyooxWgDENN1rb_waJwfKGg7omvKuAcf9kZM0z8ssRNaGQOnecJzT1b05TTa_0IrxKkLOzK2=w1920-rw'
    },
    {
      url: 'https://lh3.googleusercontent.com/cofsekSEpfzV_lqJrmmhNesLeI1UW8QqwgR5hAUBq1-fG9_ZOextOH5ZDMwziSeQEEjmc5FGHbKVd8PuioC-l8NoLUgoqx5qRw=w1920-rw'
    },
    {
      url: 'https://lh3.googleusercontent.com/rJCDtUsgpEX9nOeGCJho-uPVG6MX28DldYmI1CMX0geuAl2cH_brh4O1ZspOaULSP2hwAPjEpP5SVhmXJZpqHe1iOF8D8TWJ=w1920-rw'
    },
    {
      url: 'https://lh3.googleusercontent.com/8tWnp6HsCgSj5e1WsDtsmaTk0FBuooQDLgIB61hlLPDE7mxo_HrelX7pxXEf_ItxZTAFQXqcifrTRVUb8TnwlMDAind-2w_ezQ=w1920-rw'
    },
    {
      url: 'https://lh3.googleusercontent.com/OCMJz9Jh_VMo6BoS2Sa4GataO_P2i86z9O2EtE5EaA-icp0jneNftk9-8zenLyho14aeNmK6hUV3W0BSx3wF7sV9AzN5syD9iA=w1920-rw'
    },
  ]

  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      className={`${props.className} flex h-[566px] [&_.swiper-wrapper]:flex overflow-hidden relative`}
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
      {
        dataSlide.map((item, index) => {
          return <>
            <SwiperSlide className="bg-orange-400" id={String(index)} key={index}>
              <img
                className="w-full h-full object-cover"
                src={item.url}
                alt="#"
              />
            </SwiperSlide>
          </>
        })
      }
    </Swiper>
  );
};

export default SwiperComponent;
