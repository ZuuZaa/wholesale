import { useEffect, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

const CategoryTabs = ({categories, categoryId}) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;
      const activeSlideIndex = categories.findIndex(
        (cat) => cat.id === categoryId
      );
      swiper.slideTo(activeSlideIndex);
    }
  }, [categoryId, categories]);
  return (
    <div className="category-tabs-container">
      <Swiper ref={swiperRef} slidesPerView={"auto"} spaceBetween={12}>
        {categories?.map((cat) => (
          <SwiperSlide key={cat.id} className="swiper-slide-active">
            <Link href={`/category/${cat.id}`} passHref={true}>
              <div
                className={
                  cat.id === categoryId ? "category-tab active-tab" : "category-tab"
                }
              >
                {cat.name}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryTabs;
