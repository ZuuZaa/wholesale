"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UilStar, UilInfo, UilComparison } from "@iconscout/react-unicons";
import { UisStar } from "@iconscout/react-unicons-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import starIcon from "@/assets/icons/star.svg";
import favoriteIcon from "@/assets/icons/favorite.svg";
import "./product.scss";

import Pcard from "../../../../public/images/footer/Payment2.png";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation, HashNavigation } from "swiper/modules";

import { Tabs, Tab } from "../Tabs";
import Gallery from "../Gallery";

async function getHeader() {
  let token = "";
  let session_id = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
  }
  const params = new URLSearchParams();
  params.append("SessionId", session_id);
  const response = await fetch(
    `https://api.wscshop.co.uk/api/layout/get-header?${params.toString()}`,
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
  console.log("getheader", data.output);
  return data.output;
}

export default function ProductDetail() {
  const pathname = useParams();
  const id = pathname.id;
  const location = usePathname();
    const customReviews = [
      {
        id: 1,
        text: "product overview product overview product overview product overview product",
      },
      {
        id: 2,
        text: "product overview product",
      },
    ];

  async function fetchData() {
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    const params = new URLSearchParams();
    params.append("Id", id);
    params.append("SessionId", session_id);

    const response = await fetch(
      `https://api.wscshop.co.uk/api/details/get-index?${params.toString()}`,
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
    console.log("data", data.output);
    return data.output;
  }

  async function fetchData1() {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    const params = new URLSearchParams();
    params.append("Id", id);

    const response = await fetch(
      `https://api.wscshop.co.uk/api/details/get-desc?${params.toString()}`,
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
    console.log(data.output);
    return data.output;
  }
  const [data, setData] = useState({
    products: [],
    productAttributes: [],
    groups: [],
    reviews: [],
    myReviews: [],
    category: [],
    similarProducts: [],
    accessories: [],
    userType: [],
  });

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await fetchData();
      setData(fetchedData);
      const fetchedData1 = await fetchData1();
      document.getElementById("prod_desc").innerHTML = fetchedData1;
    }
    fetchDataAsync();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);
  const products = data.products;
  const similarProducts = data.similarProducts;
  const reviews = data.reviews;
  const attributes = data.productAttributes;
  const groups = data.groups;
  const accessories = data.accessories;
  const userType = data.userType;

  //  useEffect(() => {
  //     async function fetchDataAsync() {

  //     }
  //     fetchDataAsync();
  //   }, []);

  const [dataHeader, setDataHeader] = useState({
    header: [],
    isLogin: [],
  });
  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await getHeader();
      setDataHeader(fetchedData);
    }
    fetchDataAsync();
  }, []);

  const isLogin = dataHeader.isLogin;

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
          const resp = await response.json();
          if (resp.status !== 400) {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("refreshToken", resp.output.refreshToken);
              localStorage.setItem("jwtToken", resp.output.token);
            }

            await addFavorite();
          } else {
            window.location.href = "/login";
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
  let addFavoriteDetails = async (event) => {
    let fav_div = event.currentTarget;
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
          const resp = await response.json();
          if (resp.status !== 400) {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("refreshToken", resp.output.refreshToken);
              localStorage.setItem("jwtToken", resp.output.token);
            }

            await addFavorite();
          } else {
            window.location.href = "/login";
          }
        } catch {
          console.log("error");
        }
      } else {
        // var fav_icons=document.querySelectorAll(".fav_icon_reg")
        // for (let i = 0; i < fav_icons.length; i++) {
        //   if(fav_icons[i].getAttribute('id')==prodid){
        //      fav_icons[i].style.display='none'
        //      fav_icons[i].nextSibling.style.display='block'
        //   }
        // }
        fav_div.style.display = "none";
        fav_div.nextSibling.style.display = "block";
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
            window.location.href = "/login";
            //go to login page
            //alert(1)
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
  let removeFavoriteDetails = async (event) => {
    let fav_div = event.currentTarget;
    let prodid = event.currentTarget.getAttribute("id");
    let status;
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
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
            window.location.href = "/login";
            //go to login page
            //alert(1)
          }
        } catch {
          console.log("error");
        }
      } else {
        // var fav_icons=document.querySelectorAll(".fav_icon_solid")
        //   for (let i = 0; i < fav_icons.length; i++) {
        //     if(fav_icons[i].getAttribute('id')==prodid){
        //        fav_icons[i].style.display='none'
        //        fav_icons[i].previousSibling.style.display='block'
        //     }
        //   }
        fav_div.style.display = "none";
        fav_div.previousSibling.style.display = "block";
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
  let addCartDetails = async (event) => {
    let cart_div = event.currentTarget;
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
      const resJson = await res.json();
      const cart_id = resJson.output.cart[0].id;

      if (res.status === 200) {
        cart_div.parentElement.innerHTML =
          '<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="' +
          quantity +
          '" id="' +
          prodid +
          '" name="cart_quant_update" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="' +
          cart_id +
          '"><button class="rounded-full font-bold inline-block text-base minus_button" id="' +
          prodid +
          '" name="minus_button"><span>-</span></button><button class="rounded-full font-bold inline-block text-base plus_button" id="' +
          prodid +
          '" name="plus_button"><span>+</span></button></div>';
        cart_div.remove();

        var plus_btns = document.getElementsByName("plus_button");
        plus_btns[0].addEventListener("click", plusCartDetails);

        var minus_btns = document.getElementsByName("minus_button");
        minus_btns[0].addEventListener("click", minusCartDetails);

        var cart_quants = document.getElementsByName("cart_quant_update");
        cart_quants[0].addEventListener("keyup", updateInputDetails);
        // for (let i = 0; i < plus_btns.length; i++)
        // {
        //   plus_btns[i].addEventListener('click',plusCartDetails)
        // }
        // var minus_btns=cart_div.parentElement.querySelectorAll(".minus_button")
        // for (let i = 0; i < minus_btns.length; i++)
        // {
        //   minus_btns[i].addEventListener('click',minusCartDetails)
        // }
        // var cart_quants=cart_div.parentElement.querySelectorAll(".cart_quant_update")
        // for (let i = 0; i < cart_quants.length; i++)
        // {
        //   cart_quants[i].addEventListener('keyup',updateInputDetails)
        // }
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
      const resJson = await res.json();

      if (res.status === 200) {
        var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
        for (let i = 0; i < min_plus_btns.length; i++) {
          if (min_plus_btns[i].getAttribute("id") == cartid) {
            min_plus_btns[i].parentElement.innerHTML =
              '<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="' +
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
  let plusCart = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let cartid = event.currentTarget.parentElement.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let quantity = event.currentTarget.parentElement.previousSibling.value;
    quantity++;
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
            ProductId: prodid,
            Quantity: quantity,
            SessionId: session_id,
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
        for (let i = 0; i < min_plus_btns.length; i++) {
          if (min_plus_btns[i].getAttribute("id") == cartid) {
            min_plus_btns[i].previousSibling.value = quantity;
          }
        }
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
        let remove_carts = document.getElementsByClassName("remove-cart");
        for (let i = 0; i < remove_carts.length; i++) {
          remove_carts[i].addEventListener("click", removeCart);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let plusCartDetails = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let cartid = event.currentTarget.parentElement.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let quantity = event.currentTarget.parentElement.previousSibling.value;
    quantity++;
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
            ProductId: prodid,
            Quantity: quantity,
            SessionId: session_id,
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
        for (let i = 0; i < min_plus_btns.length; i++) {
          if (min_plus_btns[i].getAttribute("id") == cartid) {
            min_plus_btns[i].previousSibling.value = quantity;
          }
        }
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
        let remove_carts = document.getElementsByClassName("remove-cart");
        for (let i = 0; i < remove_carts.length; i++) {
          remove_carts[i].addEventListener("click", removeCart);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let minusCart = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let cartid = event.currentTarget.parentElement.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let quantity = event.currentTarget.parentElement.previousSibling.value;
    quantity--;
    if (quantity > 0) {
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
              ProductId: prodid,
              Quantity: quantity,
              SessionId: session_id,
            }),
          }
        );
        const resJson = await res.json();

        if (res.status === 200) {
          var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
          for (let i = 0; i < min_plus_btns.length; i++) {
            if (min_plus_btns[i].getAttribute("id") == cartid) {
              min_plus_btns[i].previousSibling.value = quantity;
            }
          }
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
          let remove_carts = document.getElementsByClassName("remove-cart");
          for (let i = 0; i < remove_carts.length; i++) {
            remove_carts[i].addEventListener("click", removeCart);
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
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
        const resJson = await res.json();

        if (res.status === 200) {
          var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
          for (let i = 0; i < min_plus_btns.length; i++) {
            if (min_plus_btns[i].getAttribute("id") == cartid) {
              min_plus_btns[i].parentElement.innerHTML =
                '<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="' +
                prodid +
                '" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>';

              //min_plus_btns[i].remove();
            }
          }
          var add_btns = document.querySelectorAll(".add_cart_btn");
          for (let i = 0; i < add_btns.length; i++) {
            add_btns[i].addEventListener("click", addCart);
          }
          var cart = resJson.output.cart;
          if (cart.length == 0) {
            document.getElementById("cart_drop").style.display = "none";
            document.getElementById("cart_quantity").style.display = "none";
          } else {
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
            let remove_carts = document.getElementsByClassName("remove-cart");
            for (let i = 0; i < remove_carts.length; i++) {
              remove_carts[i].addEventListener("click", removeCart);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  let minusCartDetails = async (event) => {
    let minus_btn = event.currentTarget;
    let prodid = event.currentTarget.getAttribute("id");
    let cartid = event.currentTarget.parentElement.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let quantity = event.currentTarget.parentElement.previousSibling.value;
    quantity--;
    if (quantity > 0) {
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
              ProductId: prodid,
              Quantity: quantity,
              SessionId: session_id,
            }),
          }
        );
        const resJson = await res.json();

        if (res.status === 200) {
          var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
          for (let i = 0; i < min_plus_btns.length; i++) {
            if (min_plus_btns[i].getAttribute("id") == cartid) {
              min_plus_btns[i].previousSibling.value = quantity;
            }
          }
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
          let remove_carts = document.getElementsByClassName("remove-cart");
          for (let i = 0; i < remove_carts.length; i++) {
            remove_carts[i].addEventListener("click", removeCart);
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
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
        const resJson = await res.json();

        if (res.status === 200) {
          // var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
          // for (let i = 0; i < min_plus_btns.length; i++)
          // {
          //   if(min_plus_btns[i].getAttribute('id')==cartid){

          //     min_plus_btns[i].parentElement.innerHTML='<input class="cart_quant" type="number" value="1"/><button type="button" id="'+prodid+'" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>'

          //     //min_plus_btns[i].remove();
          //     }

          // }
          minus_btn.parentElement.parentElement.innerHTML =
            '<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="' +
            prodid +
            '" class="rounded-full font-bold inline-block text-base add_cart_btn" name="add_cart_btn">Add</button></div>';

          var add_btns = document.getElementsByName("add_cart_btn");
          //for(let i = 0; i < add_btns.length; i++){
          add_btns[0].addEventListener("click", addCartDetails);
          //}
          var cart = resJson.output.cart;

          if (cart.length == 0) {
            document.getElementById("cart_drop").style.display = "none";
            document.getElementById("cart_quantity").style.display = "none";
          } else {
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
            let remove_carts = document.getElementsByClassName("remove-cart");
            for (let i = 0; i < remove_carts.length; i++) {
              remove_carts[i].addEventListener("click", removeCart);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  let updateInput = (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let quantity = event.currentTarget.value;
    let cartid = event.currentTarget.nextSibling.getAttribute("id");
    event.currentTarget.parentElement.innerHTML =
      '<input class="cart_quant" type="number" min="1" max="10000" value="' +
      quantity +
      '" id="' +
      prodid +
      '"  /><button type="button" class="rounded-full font-bold inline-block text-base update_button" id="' +
      cartid +
      '"><span>Update</span></button>';
    var update_btns = document.querySelectorAll(".update_button");
    for (let i = 0; i < update_btns.length; i++) {
      update_btns[i].addEventListener("click", updateCart);
    }
  };
  let updateInputDetails = (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let quantity = event.currentTarget.value;
    let cartid = event.currentTarget.nextSibling.getAttribute("id");
    event.currentTarget.parentElement.innerHTML =
      '<input class="cart_quant" type="number" min="1" max="10000" value="' +
      quantity +
      '" id="' +
      prodid +
      '"  /><button type="button" class="rounded-full font-bold inline-block text-base update_button" name="update_button" id="' +
      cartid +
      '"><span>Update</span></button>';
    var update_btns = document.getElementsByName("update_button");
    //for(let i = 0; i < update_btns.length; i++){
    update_btns[0].addEventListener("click", updateCartDetails);
    //}
  };
  let updateCart = async (event) => {
    let prodid = event.currentTarget.previousSibling.getAttribute("id");
    let quantity = event.currentTarget.previousSibling.value;
    let cartid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let update_button = event.currentTarget;
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
            ProductId: prodid,
            Quantity: quantity,
            SessionId: session_id,
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        update_button.parentElement.innerHTML =
          '<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="' +
          quantity +
          '" id="' +
          prodid +
          '" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="' +
          cartid +
          '"><button class="rounded-full font-bold inline-block text-base minus_button" id="' +
          prodid +
          '"><span>-</span></button><button class="rounded-full font-bold inline-block text-base plus_button" id="' +
          prodid +
          '"><span>+</span></button></div>';
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
        let remove_carts = document.getElementsByClassName("remove-cart");
        for (let i = 0; i < remove_carts.length; i++) {
          remove_carts[i].addEventListener("click", removeCart);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  let updateCartDetails = async (event) => {
    let prodid = event.currentTarget.previousSibling.getAttribute("id");
    let quantity = event.currentTarget.previousSibling.value;
    let cartid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let update_button = event.currentTarget;
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
            ProductId: prodid,
            Quantity: quantity,
            SessionId: session_id,
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        update_button.parentElement.innerHTML =
          '<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="' +
          quantity +
          '" id="' +
          prodid +
          '" name="cart_quant_update" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="' +
          cartid +
          '"><button class="rounded-full font-bold inline-block text-base minus_button" id="' +
          prodid +
          '" name="minus_button"><span>-</span></button><button class="rounded-full font-bold inline-block text-base plus_button" id="' +
          prodid +
          '" name="plus_button"><span>+</span></button></div>';
        var plus_btns = document.getElementsByName("plus_button");
        //for (let i = 0; i < plus_btns.length; i++)
        //{
        plus_btns[0].addEventListener("click", plusCartDetails);
        //}
        var minus_btns = document.getElementsByName("minus_button");
        //for (let i = 0; i < minus_btns.length; i++)
        //{
        minus_btns[0].addEventListener("click", minusCartDetails);
        //}
        var cart_quants = document.getElementsByName("cart_quant_update");
        //for (let i = 0; i < cart_quants.length; i++)
        //{
        cart_quants[0].addEventListener("keyup", updateInputDetails);
        //}
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
        let remove_carts = document.getElementsByClassName("remove-cart");
        for (let i = 0; i < remove_carts.length; i++) {
          remove_carts[i].addEventListener("click", removeCart);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let addCompare = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/compare/add-compare",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ProductId: prodid,
            SessionId: session_id,
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [Icon, setRating] = useState(1);
  const [message, setMessage] = useState("");

  let submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/details/add-review",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            ProductId: id,
            Star: star,
            Title: title,
            Summary: text,
          }),
        }
      );
      const resJson = await res.json();
      if (res.status === 200) {
        setTitle("");
        setText("");
        setRating(1);
        setMessage("Review created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div className="product--desktop">
        {/* Breadcrumb */}
        <div className="breadcrumb-wrapper py-12">
          <div className="custom-container mx-auto">
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="#"
                    className="inline-flex items-center text-sm font-medium"
                  >
                    {" "}
                    Home{" "}
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">
                      {" "}
                    </a>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
        {/* Product Detail Section */}
        <section className="product-main-section my-20 py-3">
          {/* Product Detail - Tabs Section */}
          {products.map((product) => {
            const items = [];

            for (let i = 1; i <= 5; i++) {
              if (product.starCount >= i) {
                items.push(<UisStar size="18" color="#ffc400" />);
              } else {
                items.push(<UilStar size="18" color="#ffc400" />);
              }
            }
            const fav_icon = [];
            if (product.favorite == 0) {
              fav_icon.push(
                <div className="addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md">
                  <FontAwesomeIcon
                    className="fav_icon_reg"
                    icon={regularHeart}
                    style={{ fontSize: 22 }}
                    color="#ffffff"
                    onClick={addFavoriteDetails}
                    id={product.id}
                  />
                  <FontAwesomeIcon
                    style={{ display: "none", fontSize: 22 }}
                    className="fav_icon_solid"
                    icon={solidHeart}
                    color="#ffffff"
                    onClick={removeFavoriteDetails}
                    id={product.id}
                  />
                </div>
              );
            } else {
              fav_icon.push(
                <div className="addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md">
                  <FontAwesomeIcon
                    style={{ display: "none", fontSize: 22 }}
                    className="fav_icon_reg"
                    icon={regularHeart}
                    color="#ffffff"
                    onClick={addFavoriteDetails}
                    id={product.id}
                  />
                  <FontAwesomeIcon
                    className="fav_icon_solid"
                    icon={solidHeart}
                    style={{ fontSize: 22 }}
                    color="#ffffff"
                    onClick={removeFavoriteDetails}
                    id={product.id}
                  />
                </div>
              );
            }
            const add_cart_div = [];
            if (product.quantity > 0) {
              add_cart_div.push(
                <div className="add-to-cart-wrap pm flex items-center justify-center gap-2">
                  <input
                    class="cart_quant cart_quant_update"
                    type="number"
                    min="1"
                    max="10000"
                    defaultValue={product.quantity}
                    onKeyUp={updateInputDetails}
                    id={product.id}
                  />
                  <div
                    className="flex gap-2 pm-wrap minus_plus_btn"
                    id={product.cartId}
                  >
                    <button
                      type="button"
                      className="rounded-full font-bold inline-block text-base minus_button"
                      onClick={minusCartDetails}
                      id={product.id}
                    >
                      <span>-</span>
                    </button>
                    <button
                      type="button"
                      className="rounded-full font-bold inline-block text-base plus_button"
                      onClick={plusCartDetails}
                      id={product.id}
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>
              );
            } else {
              add_cart_div.push(
                <div className="add-to-cart-wrap flex items-center justify-center gap-2">
                  <input
                    class="cart_quant"
                    type="number"
                    min="1"
                    max="10000"
                    defaultValue="1"
                  />
                  <button
                    type="button"
                    onClick={addCartDetails}
                    id={product.id}
                    className="rounded-full font-bold inline-block text-base add_cart_btn"
                  >
                    Add
                  </button>
                </div>
              );
            }

            let price_div = [];
            if (userType == 1) {
              price_div.push(
                <div className="product-detail-price-box">
                  <h5>Wholesale Price</h5>
                  <h3 className="product-price text-red-500 text-2xl font-semibold">
                    £{product.wholeSalePrice.toFixed(2)}
                  </h3>{" "}
                </div>
              );
            } else if (userType == 2) {
              price_div.push(
                <div className="product-detail-price-box">
                  <h5>Wholesale Price</h5>
                  <h3 className="product-price text-red-500 text-2xl font-semibold">
                    £{product.wholeSalePrice.toFixed(2)}
                  </h3>{" "}
                </div>
              );
              price_div.push(
                <div className="product-detail-price-box">
                  <h5>Diller Price</h5>
                  <h3 className="product-price text-red-500 text-2xl font-semibold">
                    £{product.dillerPrice.toFixed(2)}
                  </h3>{" "}
                </div>
              );
            } else if (userType == 3) {
              price_div.push(
                <div className="product-detail-price-box">
                  <h5>Wholesale Price</h5>
                  <h3 className="product-price text-red-500 text-2xl font-semibold">
                    £{product.wholeSalePrice.toFixed(2)}
                  </h3>{" "}
                </div>
              );
              price_div.push(
                <div className="product-detail-price-box">
                  <h5>Diller Price</h5>
                  <h3 className="product-price text-red-500 text-2xl font-semibold">
                    £{product.dillerPrice.toFixed(2)}
                  </h3>{" "}
                </div>
              );
              price_div.push(
                <div className="product-detail-price-box">
                  <h5>Special Price</h5>
                  <h3 className="product-price text-red-500 text-2xl font-semibold">
                    £{product.specialPrice.toFixed(2)}
                  </h3>{" "}
                </div>
              );
            }
            const limit_div = [];
            if (product.stock <= 0) {
              limit_div.push(
                <h2 className="product-availability text-base mb-3 text-red-500">
                  Not available
                </h2>
              );
            } else if (product.stock <= product.minLimit) {
              limit_div.push(
                <h2 className="product-availability text-base mb-3 text-red-500">
                  Limited number
                </h2>
              );
            }
            return (
              <section className="custom-products-section pb-6">
                <div className="frd-container mx-auto mb-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="product-detail-gallery px-4 mb-16">
                      <Gallery prod_id={product.id}></Gallery>
                    </div>
                    <div className="product-detail-info px-4">
                      <h3 className="product-name text-4xl mb-3">
                        {product.name}
                      </h3>
                      {userType > 0 && product.stock > 0 ? (
                        <h4 className="product-availability text-base mb-3 text-stone-800">
                          Availability:{" "}
                          <span className="text-green-400 ">
                            {product.stock} in stock
                          </span>
                        </h4>
                      ) : (
                        <h4></h4>
                      )}
                      {limit_div}
                      <div className="product-thin-st w-full rounded-lg relative bg-slate-100 ">
                        <span className="w-1/4 bg-slate-700 absolute inset-0 rounded-lg"></span>
                      </div>
                      <p className="product-paragraph text-md text-gray-600 mt-6">
                        {product.about}
                      </p>
                      <h4 className="product-sku text-base mt-6 text-stone-800 flex items-center gap-9">
                        Code: {product.code}
                        <div className="rating flex justify-center items-center ">
                          {items}
                          <span className="text-sm ml-1 text-slate-700">
                            {reviews.length} review
                          </span>
                        </div>
                      </h4>
                      <div className="product-price-wrap flex gap-5 py-4 mt-6 mb-6 items-center">
                        <h3 className="product-price text-red-500 text-2xl font-semibold">
                          £{product.price.toFixed(2)}
                        </h3>
                        {/* <del className='text-sm text-slate-500'>$ 140.00</del>
                                        <span className='discount-span text-xs rounded-3xl py-2 px-5 bg-gray-800 text-white'> -15% </span> */}
                      </div>
                      {userType > 0 ? (
                        <div className="product-price-wrap grid grid-cols-2 md:grid-cols-4 gap-3 py-4 mt-6 mb-6 items-center">
                          {price_div}
                                    {" "}
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div id="prod_desc" className="mb-6"></div>
                      {product.dahuaLink != null ? (
                        <div className="product-cards mb-6 flex gap-3">
                          <Link
                            className="text-sm text-red-600 mb-3"
                            href={product.dahuaLink}
                            target="blank"
                          >
                            You can find Datasheet of product by clicking here
                          </Link>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div className="product-add-wrap flex items-center gap-4">
                        <div className="add-to-cart" style={{ margin: "0" }}>
                          {add_cart_div}
                        </div>
                        {/* <CounterInput initialValue={5} min={0} max={10} /> */}
                        {/* <button className='addtocart-btn link-design1-cancel hover-red-bg py-2 px-4  md:px-12 lg:px-16 rounded-md'>Add to Cart</button> */}

                        {fav_icon}
                        <div
                          className="addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md"
                          onClick={addCompare}
                          id={product.id}
                        >
                          <UilComparison size="20" color="#ffffff" />
                        </div>
                        {/* <button className='addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md'><UilHeart size="20" color="#ffffff" /></button> */}
                      </div>
                      <div className="product-cards mt-6">
                        <p className="text-sm text-gray-600 mb-3">
                          Guaranteed safe checkout
                        </p>
                        <div className="flex">
                          <Image
                            src={Pcard}
                            width={200}
                            height={200}
                            alt="Picture of the author"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}

          {/* Product Detail - Tabs Section */}
          <section className="custom-products-section pb-6">
            <div className="frd-container mx-auto mb-10">
              <Tabs>
                <Tab label="SPECIFICATIONS">
                  <div className="py-4">
                    <div className="py-2 specification-table">
                      {groups.map((group) => {
                        return (
                          <div className="section-title ">
                            <div className="sp-table-head">{group}</div>
                            <div className="sp-table-body">
                              {attributes
                                .filter((a) => a.attributeGroup == group)
                                .map((attr) => {
                                  return (
                                    <div className="flex justify-between">
                                      <h4>{attr.attributeName}</h4>
                                      <h4>{attr.attributeValue}</h4>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Tab>
                <Tab label="ACCESSORIES">
                  <div className="accessories-products-grid grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {accessories.map((product) => {
                      const items = [];

                      for (let i = 1; i <= 5; i++) {
                        if (product.starCount >= i) {
                          items.push(<UisStar size="18" color="#ffc400" />);
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
                        <div className="zoom-img custom-product-swiper-item mb-12 pb-5 relative">
                          <div className="custom-product-swiper-item-img-wrap w-full overflow-hidden relative aspect-square">
                            <Link href={`/product/${product.id}`} className="">
                              {images}
                            </Link>
                            {/* <div className='hover-item-wrap flex items-center justify-center gap-3'>
                                              <div className='wishlist-icon flex items-center justify-center hover-red-bg'>
                                                  <UilHeart size="20" color="#ffffff" />
                                              </div>
                                              <div className='compare-icon flex items-center justify-center hover-red-bg'>
                                                  <UilComparison size="20" color="#ffffff" />
                                              </div>
                                          </div> */}
                          </div>
                          <div className="custom-product-swiper-item-content pt-5 mt-1 px-3">
                            <div className="rating flex gap-1 justify-center">
                              {items}
                            </div>
                            <div className="name text-center my-2">
                              <Link
                                href={`/product/${product.id}`}
                                key={product.id}
                                passHref={true}
                                className="hover-red text-lg"
                              >
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
                                                  <input className="" type="number"/>
                                                  <button className='rounded-full font-bold inline-block text-base'>Add</button>
                                              </div>
                                              </div> */}
                          </div>

                          {product.about != null ? (
                            <div className="info-icon absolute ">
                              <div className="info-icon-circle flex items-center justify-center hover-red-bg">
                                <UilInfo size="30" color="#ffffff" />
                              </div>
                              <div className="info-icon-box">
                                <div className="info-icon-box-table">
                                  <div className="sp-table-head">
                                    {product.about.substring(0, 300)}...
                                  </div>
                                </div>
                              </div>
                                        
                            </div>
                          ) : (
                            <div className="info-icon absolute ">
                              <div className="info-icon-circle flex items-center justify-center hover-red-bg">
                                <UilInfo size="30" color="#ffffff" />
                              </div>
                                        
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Tab>
                <Tab label="REVIEWS">
                  <div className="py-4">
                    <div className="product-detail-review-wrap py-6 px-2 md:p-6 pd-review-border">
                      {/* Review Top */}
                      {reviews.length > 0 ? (
                        <div className="product-detail-review-top">
                          <h5 className="text-lg text-gray-700 font-semibold mb-3">
                            CUSTOMER REVIEWS
                          </h5>
                          {products.map((product) => {
                            const items = [];

                            for (let i = 1; i <= 5; i++) {
                              if (product.starCount >= i) {
                                items.push(
                                  <UisStar size="18" color="#ffc400" />
                                );
                              } else {
                                items.push(
                                  <UilStar size="18" color="#ffc400" />
                                );
                              }
                            }
                            return (
                              <div className="flex justify-between items-center flex-col md:flex-row gap-6">
                                <div className="rating flex justify-center items-center gap-2">
                                  {items}
                                  <span className="text-sm ml-1 text-slate-700">
                                    Based on {reviews.length} review
                                  </span>
                                </div>
                                {isLogin == 1 ? (
                                  <div style={{ cursor: "pointer" }}>
                                    <span
                                      className="hover-red text-sm"
                                      onClick={toggleVisibility}
                                    >
                                      Write a review
                                    </span>
                                  </div>
                                ) : (
                                  <div style={{ cursor: "pointer" }}>
                                    <Link
                                      href="/login"
                                      className="hover-red text-sm"
                                    >
                                      Please login for write a review
                                    </Link>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="product-detail-review-top">
                          <h5 className="text-lg text-gray-700 font-semibold mb-3">
                            CUSTOMER REVIEWS
                          </h5>

                          <div className="flex justify-between items-center flex-col md:flex-row gap-6">
                            <div className="rating flex justify-center items-center gap-2">
                              <UilStar size="18" color="#ffc400"></UilStar>
                              <UilStar size="18" color="#ffc400"></UilStar>
                              <UilStar size="18" color="#ffc400"></UilStar>
                              <UilStar size="18" color="#ffc400"></UilStar>
                              <UilStar size="18" color="#ffc400"></UilStar>
                              <span className="text-sm ml-1 text-slate-700">
                                No reviews yet
                              </span>
                            </div>
                            {isLogin == 1 ? (
                              <div style={{ cursor: "pointer" }}>
                                <span
                                  className="hover-red text-sm"
                                  onClick={toggleVisibility}
                                >
                                  Write a review
                                </span>
                              </div>
                            ) : (
                              <div style={{ cursor: "pointer" }}>
                                <Link
                                  href="/login"
                                  className="hover-red text-sm"
                                >
                                  Please login for write a review
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {isVisible && (
                        <div className="product-detail-review-from">
                          <form className="py-4" onSubmit={submitReview}>
                            <h6>Write a review</h6>

                            <label className="text-sm text-slate-500 mt-4 block mb-1">
                              Rating
                            </label>
                            <div className="rating flex justify-start items-center gap-2">
                              <fieldset class="ratingg">
                                <input
                                  type="radio"
                                  id="star5"
                                  name="rating"
                                  value="5"
                                  onClick={(e) => setRating(e.target.value)}
                                />
                                <label class="full" for="star5"></label>

                                <input
                                  type="radio"
                                  id="star4"
                                  name="rating"
                                  value="4"
                                  onClick={(e) => setRating(e.target.value)}
                                />
                                <label class="full" for="star4"></label>

                                <input
                                  type="radio"
                                  id="star3"
                                  name="rating"
                                  value="3"
                                  onClick={(e) => setRating(e.target.value)}
                                />
                                <label class="full" for="star3"></label>

                                <input
                                  type="radio"
                                  id="star2"
                                  name="rating"
                                  value="2"
                                  onClick={(e) => setRating(e.target.value)}
                                />
                                <label class="full" for="star2"></label>

                                <input
                                  type="radio"
                                  id="star1"
                                  name="rating"
                                  value="1"
                                  onClick={(e) => setRating(e.target.value)}
                                />
                                <label class="full" for="star1"></label>
                              </fieldset>
                              {/* <UilStar size="19" color="#ffc400" />
                                                  <UilStar size="19" color="#ffc400" />
                                                  <UilStar size="19" color="#ffc400" />
                                                  <UilStar size="19" color="#ffc400" />
                                                  <UilStar size="19" color="#ffc400" /> */}
                            </div>

                            <label className="text-sm text-slate-500 mt-4 block mb-1">
                              Review Title
                            </label>
                            <input
                              className="appearance-none block w-full  border rounded-sm py-3 px-4  leading-tight"
                              type="text"
                              placeholder="Give your review a title"
                              onChange={(e) => setTitle(e.target.value)}
                            />

                            <label className="text-sm text-slate-500 mt-4 block mb-1">
                              Body of Review
                            </label>
                            <textarea
                              className="appearance-none block w-full  border rounded-sm py-3 px-4  leading-tight"
                              type="text"
                              placeholder="Write your comments here"
                              onChange={(e) => setText(e.target.value)}
                            />
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="link-design1-cancel hover-red-bg py-4 px-8  md:px-12 lg:px-16 rounded-3xl my-3 text-base"
                              >
                                Submit Review
                              </button>
                            </div>
                            <div className="message">
                              {message ? <p>{message}</p> : null}
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Review 1 */}
                      {reviews.map((review) => {
                        const items = [];

                        for (let i = 1; i <= 5; i++) {
                          if (review.star >= i) {
                            items.push(<UisStar size="19" color="#ffc400" />);
                          } else {
                            items.push(<UilStar size="19" color="#ffc400" />);
                          }
                        }
                        return (
                          <div className="product-detail-reviews py-6 mt-6">
                            <div className="rating flex justify-start items-center gap-2 mb-6">
                              {items}
                            </div>
                            <h6 className="text-sm mb-2">{review.title}</h6>
                            <h6 className="pdr-date text-sm">
                              <span className="text-slate-700 mr-1 font-semibold">
                                {review.reviewerName}
                              </span>
                              on
                              <span className="text-slate-700 ml-1 font-semibold">
                                {review.reviewerDate.split("T")[0]}
                              </span>
                            </h6>
                            <p className="mt-4 text-sm">{review.summary}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </section>
          {/* Related Products */}
          <section className="related-products-section pb-6">
            <div className="frd-container mx-auto mb-10">
              <div className="flex justify-center items-center">
                <div className="section-title ">
                  <h2>Similar Products</h2>
                </div>
              </div>
            </div>
            <div className="frd-container mx-auto">
              <Swiper
                breakpoints={{
                  300: { slidesPerView: 1 },
                  768: { slidesPerView: 3 },
                  992: { slidesPerView: 5 },
                }}
                spaceBetween={20}
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                hashNavigation={{ watchState: true }}
                navigation={true}
                modules={[Navigation, HashNavigation]}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
              >
                {similarProducts.map((product) => {
                  const items = [];
                  for (let i = 1; i <= 5; i++) {
                    if (product.starCount >= i) {
                      items.push(<UisStar size="18" color="#ffc400" />);
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
                  const fav_icon = [];
                  if (product.favorite == 0) {
                    fav_icon.push(
                      <div className="wishlist-icon flex items-center justify-center hover-red-bg">
                        <FontAwesomeIcon
                          className="fav_icon_reg"
                          icon={regularHeart}
                          style={{ fontSize: 22 }}
                          color="#ffffff"
                          onClick={addFavorite}
                          id={product.id}
                        />
                        <FontAwesomeIcon
                          style={{ display: "none", fontSize: 22 }}
                          className="fav_icon_solid"
                          icon={solidHeart}
                          color="#ffffff"
                          onClick={removeFavorite}
                          id={product.id}
                        />
                      </div>
                    );
                  } else {
                    fav_icon.push(
                      <div className="wishlist-icon flex items-center justify-center hover-red-bg">
                        <FontAwesomeIcon
                          style={{ display: "none", fontSize: 22 }}
                          className="fav_icon_reg"
                          icon={regularHeart}
                          color="#ffffff"
                          onClick={addFavorite}
                          id={product.id}
                        />
                        <FontAwesomeIcon
                          className="fav_icon_solid"
                          icon={solidHeart}
                          style={{ fontSize: 22 }}
                          color="#ffffff"
                          onClick={removeFavorite}
                          id={product.id}
                        />
                      </div>
                    );
                  }
                  const add_cart_div = [];
                  if (product.quantity > 0) {
                    add_cart_div.push(
                      <div className="add-to-cart-wrap pm flex items-center justify-center gap-2">
                        <input
                          class="cart_quant cart_quant_update"
                          type="number"
                          min="1"
                          max="10000"
                          defaultValue={product.quantity}
                          onKeyUp={updateInput}
                          id={product.id}
                        />
                        <div
                          className="flex gap-2 pm-wrap minus_plus_btn"
                          id={product.cartId}
                        >
                          <button
                            type="button"
                            className="rounded-full font-bold inline-block text-base minus_button"
                            onClick={minusCart}
                            id={product.id}
                          >
                            <span>-</span>
                          </button>
                          <button
                            type="button"
                            className="rounded-full font-bold inline-block text-base plus_button"
                            onClick={plusCart}
                            id={product.id}
                          >
                            <span>+</span>
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    add_cart_div.push(
                      <div className="add-to-cart-wrap flex items-center justify-center gap-2">
                        <input
                          class="cart_quant"
                          type="number"
                          min="1"
                          max="10000"
                          defaultValue="1"
                        />
                        <button
                          type="button"
                          onClick={addCart}
                          id={product.id}
                          className="rounded-full font-bold inline-block text-base add_cart_btn"
                        >
                          Add
                        </button>
                      </div>
                    );
                  }
                  return (
                    <SwiperSlide className="zoom-img prod-detail-related-product-swiper-item mb-12 pb-5 relative">
                      <div className="prod-detail-related-product-swiper-item-img-wrap w-full overflow-hidden relative aspect-square">
                        <Link
                          href={"/product/" + product.id}
                          key={product.id}
                          passHref={true}
                          className=""
                        >
                          {images}
                        </Link>
                        <div className="hover-item-wrap flex items-center justify-center gap-3">
                          {fav_icon}
                          <div
                            className="compare-icon flex items-center justify-center hover-red-bg"
                            onClick={addCompare}
                            id={product.id}
                          >
                            <UilComparison size="20" color="#ffffff" />
                          </div>
                        </div>
                      </div>
                      <div className="prod-detail-related-product-swiper-item-content pt-5 mt-1 px-3">
                        <div className="rating flex gap-1 justify-center">
                          {items}
                        </div>
                        <div className="name text-center my-2">
                          <Link
                            href={"/product/" + product.id}
                            key={product.id}
                            passHref={true}
                            className="hover-red text-lg"
                          >
                            {product.name}
                          </Link>
                        </div>
                        <div className="price flex justify-center items-center gap-2">
                          <span className="inline-block text-lg font-bold ls-5">
                            £{product.price.toFixed(2)}
                          </span>
                          {/* <del className='inline-block text-sm'>$119.00</del> */}
                        </div>
                        <div className="add-to-cart">{add_cart_div}</div>
                      </div>
                      {product.about != null ? (
                        <div className="info-icon absolute ">
                          <div className="info-icon-circle flex items-center justify-center hover-red-bg">
                            <UilInfo size="30" color="#ffffff" />
                          </div>
                          <div className="info-icon-box">
                            <div className="info-icon-box-table">
                              <div className="sp-table-head">
                                {product.about.substring(0, 300)}...
                              </div>
                            </div>
                          </div>
                                    
                        </div>
                      ) : (
                        <div className="info-icon absolute ">
                          <div className="info-icon-circle flex items-center justify-center hover-red-bg">
                            <UilInfo size="30" color="#ffffff" />
                          </div>
                                    
                        </div>
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </section>
        </section>
      </div>
      <div className="product--mobile">
        <ul className="breadcrumb">
          <li>
            <Link href="/">Home &gt;</Link>
          </li>
          <li>
            <Link href={`/category/${data?.category[0]?.id}`}>
              {data?.category[0]?.name} &gt;
            </Link>
          </li>
          <li>{data.products[0]?.name}</li>
        </ul>
        <section className="product-main-info">
          <figure className="product-image">
            <img
              src={data.products[0]?.mainImage}
              alt={data.products[0]?.name}
            />
          </figure>
          <div className="product-details">
            <h3>{data.products[0]?.name}</h3>
            <div className="product-review">
              <span>{data.products[0]?.starCount.toFixed(1)}</span>
              <ul className="stars">
                {Array.from({ length: 5 }).map((item) => (
                  <li>
                    <Image src={starIcon} className="star-icon" alt="star" />
                  </li>
                ))}
              </ul>
              <span>{`${data.reviews.length} reviews`}</span>
            </div>
            <p className="color-green price">{`₤ ${data.products[0]?.price}`}</p>
            <div className="actions">
              <button className="btn-secondary">Buy now</button>
              <button className="btn-success">Add to cart</button>
            </div>
            <button>
              <Image
                src={favoriteIcon}
                className="favorite-icon"
                alt="favorite"
              />
            </button>
          </div>
        </section>
        <section className="similar-products">
          <h3>Items You Might Like</h3>
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={3}
            className="similar-products-list"
          >
            {data.similarProducts?.map((product) => (
              <SwiperSlide key={product.id} className="product-card">
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  passHref={true}
                >
                  <div>
                    <figure className="product-image">
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="product-card-image"
                      />
                    </figure>
                    <div className="product-info">
                      <p>{product.name}</p>
                      <span className="color-green">{`₤ ${product.price}`}</span>
                      <div className="card-action">
                        <button className="btn-success">Add to cart</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        <section className="review">
          <div className="review-title flex justify-between">
            <h3>Reviews</h3>
            <Link href="#">read more</Link>
          </div>
          <ul className="reviews-list">
            {customReviews.map((review) => (
              <li className="review-item p-3 ">
                <div className="flex gap-2">
                  <ul className="stars">
                    {Array.from({ length: 5 }).map((item) => (
                      <li>
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
      </div>
    </main>
  );
}
