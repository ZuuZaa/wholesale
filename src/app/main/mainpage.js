"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UilArrowRight,
  UilCalender,
  UilStar,
  UilInfo,
  UilComparison,
} from "@iconscout/react-unicons";
import { UisStar } from "@iconscout/react-unicons-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

import { Autoplay } from "swiper/modules";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, HashNavigation } from "swiper/modules";

import "./main.scss";

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
  console.log(data.output);
  return data.output;
}

export default function MainPage() {
  //const router=useRouter()

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

  const [bannerSection, setBannerSection] = useState(0);
  const [trendCategSection, setTrendCategSection] = useState(0);
  const [offersSection, setOffersSection] = useState(0);
  const [partnersSection, setPartnersSection] = useState(0);
  const [blogSection, setBlogSection] = useState(0);
  const [featuresSection, setFeaturesSection] = useState(0);

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await fetchData();
      setData(fetchedData);
      setBannerSection(fetchedData.settings[0].bannerSection);
      setTrendCategSection(fetchedData.settings[0].trendCategSection);
      setOffersSection(fetchedData.settings[0].offersSection);
      setPartnersSection(fetchedData.settings[0].partnersSection);
      setBlogSection(fetchedData.settings[0].blogSection);
      setFeaturesSection(fetchedData.settings[0].featuresSection);
    }
    fetchDataAsync();
  }, []);

  const features = data.features;
  const blogs = data.blogs;
  const categoryImages = data.categoryImages;
  const trendingProducts = data.trendingProducts;
  const bestSellProducts = data.bestSellProducts;
  const bannerImages = data.bannerImages;
  const brands = data.brands;
  const offers = data.offers;
  //const dealsProducts=data.dealsProducts;

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
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } catch {
          console.log("error");
        }
      } else {
        //console.log("success favorite")
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
        //console.log("success remove from favorite")
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

  //change fav icon
  // const [isClicked, setIsClicked] = useState(false);

  // const handleClick = () => {
  //   setIsClicked(!isClicked);
  // };
  let addCart = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    const quantity = event.currentTarget.previousSibling.value;
    console.log(prodid);
    console.log(quantity);
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

      //console.log(cart_id)

      if (res.status === 200) {
        const resJson = await res.json();
        const cart_id = resJson.output.cart[0].id;
        //console.log("success add to cart")
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
        //console.log("success remove cart")
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
        //console.log(document.querySelectorAll(".add_cart_btn"))
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
    //console.log(quantity)
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

      if (res.status === 200) {
        const resJson = await res.json();
        //console.log("success plus cart")
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
    //console.log(quantity)
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

        if (res.status === 200) {
          const resJson = await res.json();
          //console.log("success minus cart")
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

        if (res.status === 200) {
          const resJson = await res.json();
          //console.log("success remove cart")
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
          //console.log(document.querySelectorAll(".add_cart_btn"))
          var add_btns = document.querySelectorAll(".add_cart_btn");
          for (let i = 0; i < add_btns.length; i++) {
            add_btns[i].addEventListener("click", addCart);
          }
          var cart = resJson.output.cart;
          //console.log(cart.length)
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

      if (res.status === 200) {
        const resJson = await res.json();
        //console.log("success plus cart")
        //console.log(update_button)
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

      if (res.status === 200) {
        const resJson = await res.json();
        //console.log("success add compare")
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div className="main-page--desktop flex flex-col items-center justify-between ">
        {/* Slider Section */}
        {bannerSection == 1 && (
          <section className="slider-section pb-14">
            <Swiper
              pagination={{ dynamicBullets: true, clickable: true }}
              loop={true}
              modules={[Pagination]}
              className="mySwiper banner"
            >
              {bannerImages.map((banner) => {
                return (
                  <SwiperSlide>
                    <div className="slider-img">
                      <img
                        src={banner.image}
                        width={1200}
                        height={780}
                        className="object-cover w-full mb-3"
                        alt="Slider Image"
                      ></img>
                      {/* <Image src={Slider1} width={1200} height={780} className='object-cover w-full mb-3' alt='Slider Image'/> */}
                    </div>
                    <div className="content">
                      <div className="frd-container mx-auto h-100">
                        <div>
                          <h4 className="text-xl md:text-2xl mb-5">
                            {banner.title1}
                          </h4>
                          <h1 className="text-3xl md:text-6xl mb-6 font-semibold">
                            {banner.title2}
                          </h1>
                          <p className="text-sm md:text-lg">
                            {banner.description}
                          </p>

                          <Link
                            href="/categories"
                            className=" link-design1 font-bold inline-flex rounded-full gap-1"
                          >
                            Shop Now <UilArrowRight size="24" color="#ffffff" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
                  
          </section>
        )}

        {/* Trending Categories */}
        {trendCategSection == 1 && (
          <section className="trending-section">
            <div className="frd-container mx-auto mb-10">
              <div className="flex justify-between items-center">
                <div className="section-title ">
                  <h2>Trending Categories</h2>
                </div>
              </div>
            </div>
            <div className="frd-container mx-auto">
              <Swiper
                breakpoints={{
                  300: { slidesPerView: 2 },
                  576: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  992: { slidesPerView: 5 },
                  1200: { slidesPerView: 6 },
                }}
                spaceBetween={20}
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                hashNavigation={{ watchState: true }}
                navigation={true}
                modules={[Navigation, HashNavigation]}
              >
                {/* onSlideChange={() => console.log('slide change')}
                      onSwiper={(swiper) => console.log(swiper)}> */}

                {categoryImages.map((catimg) => {
                  return (
                    <SwiperSlide className="zoom-img categories-swiper-item text-center">
                      <Link
                        href={"/category/" + catimg.categoryid}
                        key={catimg.id}
                        passHref={true}
                        className=""
                      >
                        <div className="category-swiper-item-img-wrap w-full overflow-hidden">
                          {/* <Image src={CategoryImg1} width={300} height={400} className='blog-swiper-item-img object-cover w-full h-full mb-3' alt='Category'/> */}
                          <img
                            src={catimg.image}
                            width="300"
                            height="400"
                            class="blog-swiper-item-img object-cover w-full h-full mb-3"
                            alt={catimg.categoryname}
                          ></img>
                        </div>
                        <h5 className="hover-red text-lg">
                          {catimg.categoryname}
                        </h5>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </section>
        )}

        {/* Banner Section */}
        {offersSection == 1 && (
          <section className="banner-section pb-10">
            <div className="frd-container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8">
                {offers.map((offer) => {
                  return (
                    <div className="banner1-wrapper relative zoom-img">
                      <div className="banner2-image banner-image">
                        <img
                          src={offer.image}
                          className="infosecicon mx-auto"
                          alt="Icon"
                        ></img>
                        {/* <Image src={Banner1Bck1} className='infosecicon mx-auto' alt="Icon"/> */}
                      </div>
                      <div className="banner2-content banner-content mb-8 md:mb-0 relative md:absolute">
                        <span>{offer.title}</span>
                        <h2>{offer.description}</h2>
                        <Link
                          href="/categories"
                          className=" link-design1 font-bold inline-block rounded-full"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Latest Products */}
        <section className="latest-products-section pb-6">
          <div className="frd-container mx-auto mb-10">
            <div className="flex justify-between items-center">
              <div className="section-title ">
                <h2>Trending Products</h2>
              </div>
              <Link
                href="products/3"
                className="section-title-link flex items-center"
              >
                View all <UilArrowRight size="24" color="#e4573d" />
              </Link>
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
            >
              {/* onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}> */}
              {trendingProducts.map((product) => {
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
                  <SwiperSlide className="zoom-img latest-product-swiper-item mb-12 pb-5 relative">
                    <div className="latest-product-swiper-item-img-wrap w-full overflow-hidden relative aspect-square">
                      <Link
                        href={`product/${product.id}`}
                        key={product.id}
                        passHref={true}
                        className=""
                      >
                        {images}
                        {/* <Image src={ProductImg1} width={300} height={400} className='latest-product-swiper-item-img object-cover w-full h-full' alt='Product'/> */}
                        {/* <Image src={ProductImg2} width={300} height={400} className='latest-product-swiper-item-img object-cover w-full h-full' alt='Product'/> */}
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
                    <div className="latest-product-swiper-item-content pt-5 mt-1 px-3">
                      <div className="rating flex gap-1 justify-center">
                        {items}
                      </div>
                      <div className="name text-center my-2">
                        {/* substring(0,40)... */}
                        <Link
                          href={`product/${product.id}`}
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
                    {product.new == 1 ? (
                      <div className="new-product-icon absolute flex items-center justify-center">
                        New
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
        {/* Partners */}
        {partnersSection == 1 && (
          <section className="partners-section mt-5 mb-16">
            <div className="frd-container mx-auto mb-10">
              <div className="flex justify-between items-center">
                <div className="section-title ">
                  <h2>Partners</h2>
                </div>
              </div>
            </div>
            <div className="frd-container mx-auto">
              <Swiper
                breakpoints={{
                  300: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  992: { slidesPerView: 5 },
                }}
                spaceBetween={20}
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                hashNavigation={{ watchState: true }}
                navigation={true}
                modules={[Navigation, HashNavigation]}
                // onSlideChange={() => console.log('slide change')}
                //  onSwiper={(swiper) => console.log(swiper)}
              >
                {brands.map((brand) => {
                  return (
                    <SwiperSlide className="zoom-img partners-swiper-item mb-12 p-5 relative">
                      <img
                        src={brand.image}
                        width={300}
                        height={200}
                        className="partners-swiper-item-img object-contain w-full h-full"
                        alt="Product"
                      ></img>
                      {/* <Image src={Partner1} width={300} height={200} className='partners-swiper-item-img object-contain w-full h-full' alt='Product'/> */}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
                  
          </section>
        )}

        {/* Best Seller Products */}
        <section className="popular-products-section">
          <div className="frd-container mx-auto mb-10">
            <div className="flex justify-between items-center">
              <div className="section-title ">
                <h2>Best Seller Products</h2>
              </div>
              <Link
                href="products/2"
                passHref={true}
                className="section-title-link flex items-center"
              >
                View all <UilArrowRight size="24" color="#e4573d" />
              </Link>
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
            >
              {/* onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}> */}
              {bestSellProducts.map((product) => {
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
                        size="20"
                        color="#ffffff"
                        onClick={addFavorite}
                        id={product.id}
                      />
                      <FontAwesomeIcon
                        style={{ display: "none" }}
                        className="fav_icon_solid"
                        icon={solidHeart}
                        size="20"
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
                        style={{ display: "none" }}
                        className="fav_icon_reg"
                        icon={regularHeart}
                        size="20"
                        color="#ffffff"
                        onClick={addFavorite}
                        id={product.id}
                      />
                      <FontAwesomeIcon
                        className="fav_icon_solid"
                        icon={solidHeart}
                        size="20"
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
                  <SwiperSlide className="zoom-img latest-product-swiper-item mb-12 pb-5 relative">
                    <div className="latest-product-swiper-item-img-wrap w-full overflow-hidden relative aspect-square">
                      <Link
                        href={`product/${product.id}`}
                        key={product.id}
                        passHref={true}
                        className=""
                      >
                        {images}
                        {/* <Image src={ProductImg1} width={300} height={400} className='latest-product-swiper-item-img object-cover w-full h-full' alt='Product'/> */}
                        {/* <Image src={ProductImg2} width={300} height={400} className='latest-product-swiper-item-img object-cover w-full h-full' alt='Product'/> */}
                      </Link>
                      <div className="hover-item-wrap flex items-center justify-center gap-3">
                        {fav_icon}
                        <div
                          className="compare-icon flex items-center justify-center hover-red-bg"
                          onClick={addCompare}
                        >
                          <UilComparison size="20" color="#ffffff" />
                        </div>
                      </div>
                    </div>
                    <div className="latest-product-swiper-item-content pt-5 mt-1 px-3">
                      <div className="rating flex gap-1 justify-center">
                        {items}
                      </div>
                      <div className="name text-center my-2">
                        {/* .substring(0,40)... */}
                        <Link
                          href={`product/${product.id}`}
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
                    {product.new == 1 ? (
                      <div className="new-product-icon absolute flex items-center justify-center">
                        New
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>

        {/* Blog & Events */}
        {blogSection == 1 && (
          <section className="blog-events-section mt-5 mb-16">
            <div className="frd-container mx-auto mb-10">
              <div className="flex justify-between items-center">
                <div className="section-title ">
                  <h2>Blog & Events</h2>
                </div>
                <Link
                  href="/blogs"
                  className="section-title-link flex items-center"
                >
                  View all <UilArrowRight size="24" color="#e4573d" />
                </Link>
              </div>
            </div>
            <div className="frd-container mx-auto">
              <Swiper
                breakpoints={{
                  300: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  992: { slidesPerView: 3 },
                }}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                hashNavigation={{
                  watchState: true,
                }}
                navigation={true}
                modules={[Navigation, HashNavigation]}
                //onSlideChange={() => console.log('slide change')}
                //onSwiper={(swiper) => console.log(swiper)}
              >
                {blogs.map((blog) => {
                  return (
                    <SwiperSlide
                      className="zoom-img blog-swiper-item"
                      key={blog.id}
                    >
                      <Link
                        href={`blog/${blog.id}`}
                        key={blog.id}
                        passHref={true}
                        className=""
                      >
                        <div className="blog-swiper-item-img-wrap w-full overflow-hidden">
                          {/* <Image src={blog.image} width={300} height={400} className='blog-swiper-item-img object-cover w-full h-full' alt={blog.title}/> */}
                          <img
                            src={blog.image}
                            width="300"
                            height="400"
                            className="blog-swiper-item-img object-cover w-full h-full"
                            alt={blog.title}
                          ></img>
                        </div>
                      </Link>
                      <div className="blog-swiper-item-content pt-5">
                        <div className="blog-created-date flex items-center gap-2">
                          <UilCalender size="18" color="#444" />
                          <span className="text-sm">
                            {blog.addDate.split("T")[0]}
                          </span>
                        </div>
                        <Link
                          href={`blog/${blog.id}`}
                          key={blog.id}
                          passHref={true}
                          className="name mt-2 text-xl tracking-normal hover-red block"
                        >
                          {blog.title}
                        </Link>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </section>
        )}

        {/* Info Section */}
        {featuresSection == 1 && (
          <section className="info-section">
            <div className="frd-container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {features.map((feature) => {
                  return (
                    <div
                      className="grid-info-sec-col mb-3 sm:mb-4 lg:mb-0"
                      key={feature.id}
                    >
                      <div className="grid-info-box text-center">
                        {/* <Image src="" width={51} className='infosecicon mx-auto' alt=""/> */}
                        <img
                          src={feature.icon}
                          width="51"
                          class="infosecicon mx-auto"
                          alt={feature.title}
                        ></img>
                        <h5>{feature.title}</h5>
                        <p className="ls-5">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
      <div className="main-page--mobile">
        <section className="banner">
          <Swiper
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            slidesPerView={"auto"}
            spaceBetween={7}
            modules={[Autoplay]}
          >
            {offers?.map((offer) => (
              <SwiperSlide key={offer.id}>
                <img src={offer.image} alt={offer.title} />
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
                <img src={cat.image} alt={cat.title} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        <section className="recommended">
          <div className="section-title flex justify-between px-">
            <h4 className="section-title color-green">Recommended</h4>
            <Link href="products/3" className="view-all-link color-green">
              show all
            </Link>
          </div>

          <Swiper slidesPerView={"auto"} spaceBetween={3}>
            {trendingProducts?.map((cat) => (
              <SwiperSlide key={cat.id} className="recommended-product-card">
                <Link href="#">
                  <div>
                    <figure>
                      <img src={cat.mainImage} alt={cat.name} />
                    </figure>
                    <div className="product-info">
                      <p>{cat.name}</p>
                      <span className="color-green">{`₤ ${cat.price}`}</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </main>
  );
}
