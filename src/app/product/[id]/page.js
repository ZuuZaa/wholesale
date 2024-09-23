"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import starIcon from "@/assets/icons/star.svg";
import "./product.scss";


// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules

import Loading from "@/components/loading";
import ProductCard from "@/components/cards/product-card";
import FavoriteIcon from "@/components/favorite-icon/favorite-icon";
import { fetchData } from "@/utils/fetch-api";

export default function ProductDetail() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getProductDetails", true, {
          ProductId: params?.id,
        });
        console.log("result: ", result);
        setCategory(result.Category);
        setReviews(result.Reviews);
        if (result?.Products?.length > 0) {
          setProductDetails(result.Products[0]);
          setCount(result.Products[0].Quantity);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  // async function fetchData() {
  //   let token = "";
  //   let session_id = "";
  //   if (typeof localStorage !== "undefined") {
  //     token = localStorage.getItem("jwtToken");
  //     session_id = localStorage.getItem("sessionId");
  //   }
  //   const params = new URLSearchParams();
  //   params.append("Id", id);
  //   params.append("SessionId", session_id);

  //   const response = await fetch(
  //     `https://api.wscshop.co.uk/api/details/get-index?${params.toString()}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json, text/plain",
  //         "Content-Type": "application/json;charset=UTF-8",
  //         Authorization: "Bearer " + token,
  //       },
  //     }
  //   );
  //   const data = await response.json();
  //   return data.output;
  // }

  // const products = data.products;
  // const similarProducts = data.similarProducts;
  // const reviews = data.reviews;
  // const attributes = data.productAttributes;
  // const groups = data.groups;
  // const accessories = data.accessories;
  // const userType = data.userType;

  //  useEffect(() => {
  //     async function fetchDataAsync() {

  //     }
  //     fetchDataAsync();
  //   }, []);

  const updateQuantity = async (quantity) => {
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }

    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/cart/update-cart",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ProductId: data.products[0].productId,
            Quantity: quantity,
            SessionId: session_id,
          }),
        }
      );

      if (res.status === 200) {
        const data = await res.json();
        setCount(data.output.cart[0].quantity);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const add = () => {
    updateQuantity(count + 1);
  };

  const remove = () => {
    if (count > 1) {
      updateQuantity(count - 1);
    }
  };


  let addCart = async (event) => {
    let prodid = event?.currentTarget?.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    if (token === null) {
      window.location.href = "/login";
    }
    const quantity = event?.currentTarget?.previousSibling?.value || count;
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
      const resJson = await res.json();
      const cart_id = resJson.output.cart[0].id;

      if (res.status === 200) {
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


  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="product-page">
          {productDetails ? (
            <>
              <ul className="breadcrumb">
                <li>
                  <Link href="/">Home &gt;</Link>
                </li>
                {category?.length > 0 && (
                  <li>
                    <Link href={`/category/${category[0]?.id}`}>
                      {category[0]?.name} &gt;
                    </Link>
                  </li>
                )}
                <li>{productDetails.Name}</li>
              </ul>
              <section className="product-main-info">
                <figure className="product-main-image">
                  <img
                    src={productDetails.MainImage}
                    onError={(e) =>
                      productDetails.CatImage &&
                      (e.target.src = productDetails.CatImage)
                    }
                    alt={productDetails.Name}
                  />
                </figure>
                <div className="product-details">
                  <div className="flex justify-between">
                    <h3>{productDetails.Name}</h3>
                    <FavoriteIcon
                      productId={productDetails.ProductId}
                      isFavorite={productDetails.Favorite}
                    />
                  </div>

                  <div className="product-review">
                    <span>{productDetails?.StarCount?.toFixed(1)}</span>
                    <ul className="stars">
                      {Array.from({ length: 5 }).map((item) => (
                        <li key={item}>
                          <Image
                            src={starIcon}
                            className="star-icon"
                            alt="star"
                          />
                        </li>
                      ))}
                    </ul>
                    <span>{`${reviews.length} reviews`}</span>
                  </div>
                  <p className="price">{`₤${productDetails?.Price?.toFixed(
                    2
                  )}`}</p>
                  <div className="actions">
                    <div className="card-actions">
                      <button className="btn-remove" onClick={remove}>
                        -
                      </button>
                      <span className="count color-green">{count}</span>
                      <button className="btn-add" onClick={add}>
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-success"
                      id={productDetails.Id}
                      onClick={addCart}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </section>
              {similarProducts?.length > 0 && (
                <section className="similar-products">
                  <h3>Items You Might Like</h3>
                  <Swiper
                    slidesPerView={"auto"}
                    spaceBetween={3}
                    className="similar-products-list"
                  >
                    {similarProducts?.map((product) => (
                      <SwiperSlide
                        key={product.Id}
                        className="product-card-slide"
                      >
                        <ProductCard product={product} cardHeight="160px" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
              )}
              {reviews.length > 0 && (
                <section className="review">
                  <div className="review-title flex justify-between">
                    <h3>Reviews</h3>
                    <Link href="#">read more</Link>
                  </div>

                  <ul className="reviews-list">
                    {reviews.map((review) => (
                      <li className="review-item p-3 ">
                        <div className="flex gap-2">
                          <ul className="stars">
                            {Array.from({ length: 5 }).map((item) => (
                              <li key={item}>
                                <Image
                                  src={starIcon}
                                  className="star-icon"
                                  alt="star"
                                />
                              </li>
                            ))}
                          </ul>
                          <p className="reviewer">**** *****</p>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {/* <section className="product-properties">
                <ul className="product-property-list">
                  {categories.map((item) => (
                    <li className="product-property-item" key={item.id}>
                      <span className="dot"></span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </section> */}
            </>
          ) : (
            <p className="text-center py-5">Product is not available.</p>
          )}
        </div>
      )}
    </main>
  );
}
