import React from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface propsSwiperType {
  className?: string;
}

const SwiperComponent = (props: propsSwiperType) => {
  const dataSlide = [
    {
      url: 'https://lh3.googleusercontent.com/gVSB0hwR3PPffHSS8AFdHY-hmyooxWgDENN1rb_waJwfKGg7omvKuAcf9kZM0z8ssRNaGQOnecJzT1b05TTa_0IrxKkLOzK2=w1920-rw',
      title: 'Công nghệ tương lai',
      subtitle: 'Khám phá những sản phẩm tiên tiến nhất với chất lượng đỉnh cao',
      buttonText: 'Khám phá ngay',
      buttonLink: '/product'
    },
    {
      url: 'https://lh3.googleusercontent.com/cofsekSEpfzV_lqJrmmhNesLeI1UW8QqwgR5hAUBq1-fG9_ZOextOH5ZDMwziSeQEEjmc5FGHbKVd8PuioC-l8NoLUgoqx5qRw=w1920-rw',
      title: 'Siêu sale cuối tuần',
      subtitle: 'Giảm giá sốc lên đến 50% - Cơ hội vàng không thể bỏ lỡ',
      buttonText: 'Mua ngay',
      buttonLink: '/product'
    },
    {
      url: 'https://lh3.googleusercontent.com/rJCDtUsgpEX9nOeGCJho-uPVG6MX28DldYmI1CMX0geuAl2cH_brh4O1ZspOaULSP2hwAPjEpP5SVhmXJZpqHe1iOF8D8TWJ=w1920-rw',
      title: 'Chất lượng đỉnh cao',
      subtitle: 'Tin tưởng của hàng triệu khách hàng trên toàn thế giới',
      buttonText: 'Tìm hiểu thêm',
      buttonLink: '/product'
    },
    {
      url: 'https://lh3.googleusercontent.com/8tWnp6HsCgSj5e1WsDtsmaTk0FBuooQDLgIB61hlLPDE7mxo_HrelX7pxXEf_ItxZTAFQXqcifrTRVUb8TnwlMDAind-2w_ezQ=w1920-rw',
      title: 'Giao hàng miễn phí',
      subtitle: 'Miễn phí giao hàng toàn quốc cho đơn hàng từ 500.000đ',
      buttonText: 'Đặt hàng ngay',
      buttonLink: '/product'
    },
    {
      url: 'https://lh3.googleusercontent.com/OCMJz9Jh_VMo6BoS2Sa4GataO_P2i86z9O2EtE5EaA-icp0jneNftk9-8zenLyho14aeNmK6hUV3W0BSx3wF7sV9AzN5syD9iA=w1920-rw',
      title: 'Hỗ trợ 24/7',
      subtitle: 'Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ bạn',
      buttonText: 'Liên hệ ngay',
      buttonLink: '/contact'
    },
  ]

  return (
    <div className={`relative ${props.className}`}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        className="h-[600px] md:h-[700px] overflow-hidden"
        loop
        effect={"fade"}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
      >
        {dataSlide.map((item, index) => (
          <SwiperSlide key={index} className="relative">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover"
                src={item.url}
                alt={item.title}
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 right-10 hidden lg:block">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-3 h-3 bg-white/70 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
