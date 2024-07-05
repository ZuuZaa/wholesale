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

  const response = await fetch(
    `https://api.wscshop.co.uk/api/home/get-index?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + token,
      },
    }
  );

  const data = await response.json();
  console.log(data);
  return data.output;
}

export default function MainPage({ children }) {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    features: [],
    blogs: [],
    categoryImages: [],
    trendingProducts: [],
    bestSellProducts: [],
    dealsProducts: [],
    bannerImages: [],
    brands: [],
    offers: [],
    settings: [],
  });

  const [trendCategSection, setTrendCategSection] = useState(0);
  const [offersSection, setOffersSection] = useState(0);
  const [activeTab, setActiveTab] = useState("best sellers");

  async function fetchDataAsync() {
    const fetchedData = await fetchData();
    setData(fetchedData);
    setTrendCategSection(fetchedData.settings[0].trendCategSection);
    setOffersSection(fetchedData.settings[0].offersSection);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDataAsync();
  }, []);

  const products = [
    {
      name: "best sellers",
      items: data?.bestSellProducts,
      visible: true,
      link: "/products/2",
    },
    {
      name: "special offers",
      items: data?.dealsProducts,
      visible: !!offersSection,
      link: "/products/4",
    },
    {
      name: "trending",
      items: data?.trendingProducts,
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

  let addCart = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    const quantity = event.currentTarget.previousSibling.value;
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/cart/add-to-cart",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ProductId: prodid,
            Quantity: quantity,
            SessionId: session_id,
          }),
        }
      );


      if (res.status === 200) {
        const resJson = await res.json();
        const cart_id = resJson.output.cart[0].id;
        var add_cart_btns = document.querySelectorAll(".add_cart_btn");
        for (let i = 0; i < add_cart_btns.length; i++) {
          if (add_cart_btns[i].getAttribute("id") == prodid) {
            add_cart_btns[i].parentElement.innerHTML =
              '<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="' +
              quantity +
              '" id="' +
              prodid +
              '" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="' +
              cart_id +
              '"><button class="rounded-full font-bold inline-block text-base minus_button" id="' +
              prodid +
              '"><span>-</span></button><button class="rounded-full font-bold inline-block text-base plus_button" id="' +
              prodid +
              '"><span>+</span></button></div>';
            add_cart_btns[i].remove();
          }
        }
        var plus_btns = document.querySelectorAll(".plus_button");
        for (let i = 0; i < plus_btns.length; i++) {
          plus_btns[i].addEventListener("click", plusCart);
        }
        var minus_btns = document.querySelectorAll(".minus_button");
        for (let i = 0; i < minus_btns.length; i++) {
          minus_btns[i].addEventListener("click", minusCart);
        }
        var cart_quants = document.querySelectorAll(".cart_quant_update");
        for (let i = 0; i < cart_quants.length; i++) {
          cart_quants[i].addEventListener("keyup", updateInput);
        }
        document.getElementById("cart_drop").style.display = "block";
        var cart_dropdown = document.getElementById("cart_dropdown");
        var append_cart = ``;
        var cart = resJson.output.cart;
        for (let i = 0; i < cart.length; i++) {
          append_cart += `<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${
                cart[i].productImage
              } width="82" height="82" class='cover' alt="${
            cart[i].productName
          }"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                cart[i].quantity
              }x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${
                  cart[i].productId
                }'><h5 class='hover-red text-sm mb-1'>${
            cart[i].productName
          }</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>£${cart[
                  i
                ].price.toFixed(2)}</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${
              cart[i].id
            } tabindex=${cart[i].productId}><span>x</span></div>
              
            </div>
        </div>`;
        }
        cart_dropdown.innerHTML = append_cart;
        document.getElementById("cart_subtotal").innerText =
          "£" + resJson.output.subtotal.toFixed(2);
        document.getElementById("cart_quantity").innerText =
          resJson.output.totalQuantity;
        document.getElementById("cart_quantity").style.display = "flex";
        let remove_carts = document.getElementsByClassName("remove-cart");
        for (let i = 0; i < remove_carts.length; i++) {
          remove_carts[i].addEventListener("click", removeCart);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let removeCart = async (event) => {
    let cartid = event.currentTarget.getAttribute("id");
    let prodid = event.currentTarget.getAttribute("tabindex");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/cart/remove-from-cart",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            CartId: cartid,
            SessionId: session_id,
          }),
        }
      );

      if (res.status === 200) {
        const resJson = await res.json();
        var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
        for (let i = 0; i < min_plus_btns.length; i++) {
          if (min_plus_btns[i].getAttribute("id") == cartid) {
            min_plus_btns[i].parentElement.innerHTML =
              '<input class="cart_quant" type="number"  min="1" max="10000" value="1"/><button type="button" id="' +
              prodid +
              '" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>';

            //min_plus_btns[i].remove();
          }
        }
        var add_btns = document.querySelectorAll(".add_cart_btn");
        for (let i = 0; i < add_btns.length; i++) {
          add_btns[i].addEventListener("click", addCart);
        }
        var cart_dropdown = document.getElementById("cart_dropdown");
        var append_cart = ``;
        var cart = resJson.output.cart;
        if (cart.length == 0) {
          document.getElementById("cart_drop").style.display = "none";
          document.getElementById("cart_quantity").style.display = "none";
        } else {
          for (let i = 0; i < cart.length; i++) {
            append_cart += `<div class='cartdropdown-item flex gap-3'>
              <div class='img relative'>
                <img src=${
                  cart[i].productImage
                } width="82" height="82" class='cover' alt="${
              cart[i].productName
            }"></img>
                <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                  cart[i].quantity
                }x</span>
              </div>
              <div class='content'> 
                  <Link href='/product/${
                    cart[i].productId
                  }'><h5 class='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                  <h6 class='text-sm text-rose-600 font-semibold'>£${cart[
                    i
                  ].price.toFixed(2)}</h6>
              </div>
              <div class='remove-cart-item'>
              <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${
                cart[i].id
              } tabindex=${cart[i].productId}><span>x</span></div>
              </div>
          </div>`;
          }
          cart_dropdown.innerHTML = append_cart;
          document.getElementById("cart_subtotal").innerText =
            "£" + resJson.output.subtotal.toFixed(2);
          document.getElementById("cart_quantity").innerText =
            resJson.output.totalQuantity;
          let remove_carts = document.getElementsByClassName("remove-cart");
          for (let i = 0; i < remove_carts.length; i++) {
            remove_carts[i].addEventListener("click", removeCart);
          }
        }
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
              {data?.offers?.map((offer) => (
                <SwiperSlide key={offer.id}>
                  <figure className="banner-image">
                    <img src={offer.image} alt={offer.title} />
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
              {data?.categoryImages?.map((cat) => (
                <SwiperSlide key={cat.id}>
                  <Link href={`/category/${cat.id}`} passHref={true}>
                    <div className="category-card">
                      <figure className="category-image">
                        <img src={cat.mobImage} alt={cat.name} />
                        <figcaption>{cat.name.toLowerCase()}</figcaption>
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
              {data.featuredProducts?.map((product) => (
                <SwiperSlide key={product.id} className="product-card-slide">
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
