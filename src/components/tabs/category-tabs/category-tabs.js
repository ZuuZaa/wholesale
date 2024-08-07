import { useEffect, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

import "./category-tabs.scss";

export const CategoryTabs = ({categories, currentCategoryId}) => {
  const swiperRef = useRef(null);
  console.log("first", categories, currentCategoryId)

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;
      const activeSlideIndex = categories.findIndex(
        (cat) => cat.Id == currentCategoryId
      );
      swiper.slideTo(activeSlideIndex);
    }
  }, [currentCategoryId, categories]);

  return (
    <div className="category-tabs-container">
      <Swiper ref={swiperRef} slidesPerView={"auto"} spaceBetween={12}>
        {categories?.map((category) => (
          <SwiperSlide key={category.Id} className="swiper-slide-active">
            <Link href={`/category/${category.Id}`} passHref={true}>
              <div
                className={
                  category.Id == currentCategoryId
                    ? "category-tab active-tab"
                    : "category-tab"
                }
              >
                {category.Name}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
