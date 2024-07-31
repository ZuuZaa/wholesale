"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Autoplay } from "swiper/modules";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./main.scss";
import Loading from "@/components/loading";
import ProductCard from "@/components/cards/product-card";

async function fetchData() {
  let token = "";
  let session_id = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
  }

  const params = new URLSearchParams();
  params.append("SessionId", session_id);

  const requestBody = JSON.stringify({
        UserId: 0,
        Method: "getMain",
        Postcode: "",
        SessionId: session_id,
      })

  const response = await fetch(
    `https://ws.wscshop.co.uk/api/main/get-request`,
    {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        Body: requestBody,
      }),
    }
  );

  const data = await response.json();

  console.log("data", JSON.parse(data.output));
  return JSON.parse(data.output);
}

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bestSellProducts, setBestSellProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [trendCategSection, setTrendCategSection] = useState(0);
  const [offersSection, setOffersSection] = useState(0);
  const [activeTab, setActiveTab] = useState("best sellers");

  const [offers, setOffers] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);


  async function fetchDataAsync() {
    setIsLoading(true);
    const data = await fetchData();
    console.log(data)
    setBestSellProducts(data?.BestSellProducts);
    setTrendingProducts(data?.TrendingProducts);
    setDealsProducts(data?.DealsProducts);
    setFeaturedProducts(data?.FeaturedProducts);
    setTrendCategSection(data?.settings?.[0]?.TrendCategSection);
    setOffersSection(data?.settings?.[0]?.OffersSection);
    setOffers(data?.Offers);
    setCategoryImages(data?.CategoryImages);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDataAsync();
  }, []);

  const products = [
    {
      name: "best sellers",
      items: bestSellProducts,
      visible: true,
      link: "/products/2",
    },
    {
      name: "special offers",
      items: dealsProducts,
      visible: !!offersSection,
      link: "/products/4",
    },
    {
      name: "trending",
      items: trendingProducts,
      visible: !!trendCategSection,
      link: "/products/3",
    },
  ];

  const tabClickHandler = (name) => setActiveTab(name);

  let addFavorite = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let status;
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/favorites/add-favorite",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            Id: prodid,
          }),
        }
      );
      const resJson = await res.json();

      //if (res.status === 200) {
      status = resJson.status;
      if (status === 401) {
        try {
          let token = "";
          let refreshToken = "";
          if (typeof localStorage !== "undefined") {
            token = localStorage.getItem("jwtToken");
            refreshToken = localStorage.getItem("refreshToken");
          }
          let response = await fetch(
            `https://api.wscshop.co.uk/api/account/refresh-token?userRefreshToken=${refreshToken}`,
            {
              method: "POST",
              dataType: "json",
              headers: {
                Accept: "application/json, text/plain",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + token,
              },
            }
          );

          async function fetchDataAsync() {
            setIsLoading(true);
            const fetchedData = await fetchData();
            setData(fetchedData);
            setIsLoading(false);
          }
          fetchDataAsync();
          const resp = await response.json();
          if (resp.status !== 400) {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("refreshToken", resp.output.refreshToken);
              localStorage.setItem("jwtToken", resp.output.token);
            }

            await addFavorite();
          } else {
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } catch {
          console.log("error");
        }
      } else {
        var fav_icons = document.querySelectorAll(".fav_icon_reg");
        for (let i = 0; i < fav_icons.length; i++) {
          if (fav_icons[i].getAttribute("id") == prodid) {
            fav_icons[i].style.display = "none";
            fav_icons[i].nextSibling.style.display = "block";
          }
        }
      }
      //}
      //else
      //{
      //console.log("Some error occured");
      //}
    } catch (err) {
      console.log(err);
    }
  };

  let removeFavorite = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let status;
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/favorites/remove-favorite",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            Id: prodid,
          }),
        }
      );
      const resJson = await res.json();

      status = resJson.status;

      if (status === 401) {
        try {
          let token = "";
          let refreshToken = "";
          if (typeof localStorage !== "undefined") {
            token = localStorage.getItem("jwtToken");
            refreshToken = localStorage.getItem("refreshToken");
          }
          let response = await fetch(
            `https://api.wscshop.co.uk/api/account/refresh-token?userRefreshToken=${refreshToken}`,
            {
              method: "POST",
              dataType: "json",
              headers: {
                Accept: "application/json, text/plain",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + token,
              },
            }
          );
          const resp = await response.json();
          if (resp.status !== 400) {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("refreshToken", resp.output.refreshToken);
              localStorage.setItem("jwtToken", resp.output.token);
            }
            await removeFavorite();
          } else {
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } catch {
          console.log("error");
        }
      } else {
        var fav_icons = document.querySelectorAll(".fav_icon_solid");
        for (let i = 0; i < fav_icons.length; i++) {
          if (fav_icons[i].getAttribute("id") == prodid) {
            fav_icons[i].style.display = "none";
            fav_icons[i].previousSibling.style.display = "block";
          }
        }
        event.target?.classList?.toggle("favorite");
        fetchDataAsync();
      }
    } catch (err) {
      console.log(err);
    }
  };

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
                        <img src={cat.mobImage} alt={cat.Name} />
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
                        className={activeTab === item.name && "active-tab"}
                        onClick={() => tabClickHandler(item.name)}
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
                  <SwiperSlide key={product.id} className="product-card-slide">
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
