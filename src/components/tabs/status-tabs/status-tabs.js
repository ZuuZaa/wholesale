import { useEffect, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./status-tabs.scss";
import { ORDER_STATUS } from "@/constans";

export const StatusTabs = ({ activeStatus, tabClickHandle }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;
      swiper.slideTo(activeStatus);
    }
  }, [activeStatus]);
  return (
    <div className="order-tabs-container">
      <Swiper ref={swiperRef} slidesPerView={"auto"} spaceBetween={4}>
        {Object.values(ORDER_STATUS).map((item) => (
          <SwiperSlide key={item.status} className="swiper-slide-active">
              <button
                className={
                  item.status === activeStatus
                    ? "order-tab active-tab"
                    : "order-tab"
                }
                onClick={() => tabClickHandle(item.status)}
              >
                {item.name}
              </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
