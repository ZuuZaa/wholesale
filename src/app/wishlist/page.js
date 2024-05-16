"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UilInfo,
  UilStar,
  UilHeart,
  UilComparison,
  UilTimesCircle,
} from "@iconscout/react-unicons";
import Loading from "@/components/loading";
import FavoriteCard from "./favorite-card";
import chevron from "@/assets/icons/chevron-down.svg";
import "./wishlist.scss";

const mainFunc = async () => {
  let status;
  let fav_data = [];

  const fetchData = async () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    let response = await fetch(
      `https://api.wscshop.co.uk/api/favorites/get-index`,
      {
        method: "GET",
        dataType: "json",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
      }
    );
    const resp = await response.json();
    status = resp.status;
    console.log(status);
    fav_data = resp.output;
    //return resp.output;
  };

  await fetchData();

  if (status === 401) {
    try {
      let token = "";
      let refreshToken = "";
      if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("jwtToken");
        refreshToken = localStorage.getItem("refreshToken");
      }
      console.log(token);
      console.log(refreshToken);
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
      console.log(response);
      const resp = await response.json();

      if (resp.status !== 400) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("refreshToken", resp.output.refreshToken);
          localStorage.setItem("jwtToken", resp.output.token);
        }

        await fetchData();
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        //go to login page
        //alert(1)
      }
    } catch {
      console.log("error");
    }
  } else {
    return fav_data;
  }
};
let removeFavorite = async (event) => {
  let prodid = event.currentTarget.getAttribute("id");
  let status;
  let token = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
  }
  let remote_button = event.currentTarget;
  //e.preventDefault();
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
          //go to login page
          //alert(1)
        }
      } catch {
        console.log("error");
      }
    } else {
      remote_button.parentElement.remove();
      if (resJson.output.favorites.length == 0) {
        console.log("empty");
        document.getElementById("favorites_div").innerHTML =
          "<p>There is no favorite product!</p>";
      }
      //setMessage("Added");
    }
    //}
    //else
    //{
    // console.log("Some error occured");
    //}
  } catch (err) {
    console.log(err);
  }
};

export default function Wishlist() {
  //mainFunc();
  const [data, setData] = useState({
    favorites: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await mainFunc();
      setData(fetchedData);
      setIsLoading(false);
    }
    fetchDataAsync();
  }, []);

  console.log(data);
  const favorites = data.favorites;

  return (
    <main>
      <div className="wishlist--desktop">
        {/* Breadcrumb */}
        <div className="breadcrumb-wrapper py-12">
          <div className="custom-container mx-auto">
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="/"
                    className="inline-flex items-center text-sm font-medium"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="ms-1 text-sm font-medium md:ms-2">
                      Wishlist
                    </span>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Wishlist  Section */}
        <section className="wishlist-main-section mt-5 pt-16">
          <div className="custom-container mx-auto" id="favorites_div">
            {favorites.length > 0 ? (
              <div className="wishlist-items-wrapper grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
                {favorites.map((product) => {
                  const items = [];

                  for (let i = 1; i <= 5; i++) {
                    if (product.starCount >= i) {
                      items.push(<UilStar size="18" color="red" />);
                    } else {
                      items.push(<UilStar size="18" color="#ffc400" />);
                    }
                  }

                  const images = [];
                  images.push(
                    <img
                      src={product.mainImage}
                      width="300"
                      height="400"
                      class="latest-product-swiper-item-img object-cover w-full h-full"
                      alt={product.name}
                    ></img>
                  );
                  if (product.secondImage == null) {
                    images.push(
                      <img
                        src={product.mainImage}
                        width="300"
                        height="400"
                        class="latest-product-swiper-item-img object-cover w-full h-full"
                        alt={product.name}
                      ></img>
                    );
                  } else {
                    images.push(
                      <img
                        src={product.secondImage}
                        width="300"
                        height="400"
                        class="latest-product-swiper-item-img object-cover w-full h-full"
                        alt={product.name}
                      ></img>
                    );
                  }
                  return (
                    <div className="zoom-img wishlist-wrapper-item mb-12 pb-5 relative">
                      <div className="wishlist-wrapper-item-img-wrap w-full overflow-hidden relative aspect-square">
                        {images}
                        {/* <div className='hover-item-wrap flex items-center justify-center gap-3'>
                                    <div className='wishlist-icon flex items-center justify-center hover-red-bg'>
                                        <UilHeart size="20" color="#ffffff" />
                                    </div>
                                    <div className='compare-icon flex items-center justify-center hover-red-bg'>
                                        <UilComparison size="20" color="#ffffff" />
                                    </div>
                                </div> */}
                      </div>
                      <div className="wishlist-wrapper-item-content pt-5 mt-1 px-3">
                        {/* {items} */}
                        <div className="name text-center my-2">
                          <Link href="" className="hover-red text-lg">
                            {product.name}
                          </Link>
                        </div>
                        <div className="price flex justify-center items-center gap-2">
                          <span className="inline-block text-lg font-bold ls-5">
                            £{product.price.toFixed(2)}
                          </span>
                          {/* <del className='inline-block text-sm'>$119.00</del> */}
                        </div>
                        {/* <div className='add-to-cart'>
                                    <div className='add-to-cart-wrap flex items-center justify-center gap-2'>
                                        <input className="" type="number" value={1}/>
                                        <button type='button' className='rounded-full font-bold inline-block text-base'>Add</button>
                                    </div>
                                </div> */}
                      </div>

                      <div
                        className="info-icon absolute flex items-center justify-center hover-red-bg"
                        onClick={removeFavorite}
                        id={product.productId}
                      >
                        <UilTimesCircle
                          size="41"
                          color="#cecece"
                          className="mx-auto remove-icon"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>There is no favorite product!</p>
            )}
          </div>
        </section>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="wishlist--mobile">
          <h2 className="page-header">Wishlist</h2>
          {favorites.length > 0 ? (
            <div>
              <div className="filter flex justify-end">
                <button className="flex gap-2 items-center">
                  <span>Sort by</span>
                  <Image src={chevron} alt="filter" />
                </button>
              </div>
              <ul className="flex flex-col gap-2 py-2">
                {favorites.map((item) => (
                  <FavoriteCard product={item} />
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center py-5">There is no favorite product!</p>
          )}
        </div>
      )}
    </main>
  );
}
