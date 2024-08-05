"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./main.scss";
import Loading from "@/components/loading";
import ProductCard from "@/components/cards/product-card";
import { fetchData } from "@/utils/fetch-api";

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bestSellProducts, setBestSellProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [trendCategSection, setTrendCategSection] = useState(0);
  const [offersSection, setOffersSection] = useState(0);
  const [activeTab, setActiveTab] = useState("best sellers");

  const [offers, setOffers] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);

  const fetchDataAsync = async () => {
    setIsLoading(true);
    try {
      const result = await fetchData("getMain", false);
      setBestSellProducts(result?.BestSellProducts);
      setTrendingProducts(result?.TrendingProducts);
      setDealsProducts(result?.DealsProducts);
      setFeaturedProducts(result?.FeaturedProducts);
      setTrendCategSection(result?.Settings?.[0]?.TrendCategSection);
      setOffersSection(result?.Settings?.[0]?.OffersSection);
      setOffers(result?.Offers);
      setCategoryImages(result?.CategoryImages);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAsync();
  }, []);

  const products = [
    {
      id: "bestsell",
      name: "best sellers",
      items: bestSellProducts,
      visible: true,
      link: "/products/2",
    },
    {
      id: "special",
      name: "special offers",
      items: dealsProducts,
      visible: !!offersSection,
      link: "/products/4",
    },
    {
      id: "trending",
      name: "trending",
      items: trendingProducts,
      visible: !!trendCategSection,
      link: "/products/3",
    },
  ];

  const tabClickHandler = (name) => setActiveTab(name);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="main-page--mobile">
          <section className="banner">
            <Swiper
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              slidesPerView={"auto"}
              spaceBetween={7}
              modules={[Autoplay]}
            >
              {offers?.map((offer) => (
                <SwiperSlide key={offer.Id}>
                  <figure className="banner-image">
                    <img src={offer.Image} alt={offer.Title} />
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
          <section className="categories">
            <div className="section-title">
              <h4 className="section-title color-green">Categories</h4>
            </div>
            <Swiper slidesPerView={"auto"} spaceBetween={12}>
              {categoryImages?.map((cat) => (
                <SwiperSlide key={cat.id}>
                  <Link href={`/category/${cat.id}`} passHref={true}>
                    <div className="category-card">
                      <figure className="category-image">
                        <img src={cat.mobimage} alt={cat.Name.toLowerCase()} />
                        <figcaption>{cat.Name.toLowerCase()}</figcaption>
                      </figure>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
          <section className="recommended">
            <div className="section-title flex justify-between">
              <h4 className="section-title color-green">New Products</h4>
              <Link href="products/1" className="view-all-link color-green">
                show all
              </Link>
            </div>
            <Swiper slidesPerView={"auto"} spaceBetween={3}>
              {featuredProducts?.map((product) => (
                <SwiperSlide key={product.Id} className="product-card-slide">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
          <section className="products">
            <div className="products-tabs-list flex justify-between items-center">
              <ul className="tabs">
                {products.map(
                  (item) =>
                    item.visible && (
                      <li
                        className={
                          activeTab === item.name ? "active-tab" : "tab"
                        }
                        onClick={() => tabClickHandler(item.name)}
                        key={item.id}
                      >
                        {item.name}
                      </li>
                    )
                )}
              </ul>
              <Link
                href={
                  products.find((item) => item.name === activeTab)?.link || "#"
                }
                className="color-green"
              >
                show all
              </Link>
            </div>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={3}
              className="products-list"
            >
              {products
                ?.find((item) => item.name === activeTab)
                ?.items?.map((product) => (
                  <SwiperSlide key={product.Id} className="product-card-slide">
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </section>
        </div>
      )}
    </main>
  );
}
