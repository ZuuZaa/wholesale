"use client";
import { useEffect, useState } from "react";

import "./search.scss";
import Loading from "@/components/loading";
import { ProductList } from "@/components/product-list";
import { useSearchParams } from "next/navigation";
import { fetchData } from "@/utils/fetch-api";
import Pagination from "@/components/pagination";


const Search = () => {

  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchKey = searchParams.get("search");
  const [products, setProducts] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const setPages = (page) => setActivePage(page);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("getSearchPagination", false, {
          Search: searchKey,
          Page: activePage,
        });
        setProducts(response?.Products);
        setTotalPages(response.PageCount);
        console.log(response);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, [searchKey, activePage]);


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
        console.log("success favorite");
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
            window.location.href = "/login";
            //go to login page
            //alert(1)
          }
        } catch {
          console.log("error");
        }
      } else {
        console.log("success remove from favorite");
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
      console.log(cart_id);

      if (res.status === 200) {
        console.log("success add to cart");
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
      const resJson = await res.json();

      if (res.status === 200) {
        console.log("success remove cart");
        var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
        for (let i = 0; i < min_plus_btns.length; i++) {
          if (min_plus_btns[i].getAttribute("id") == cartid) {
            min_plus_btns[i].parentElement.innerHTML =
              '<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="' +
              prodid +
              '" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>';
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
    console.log(quantity);
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
        console.log("success plus cart");
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
    console.log(quantity);
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
          console.log("success minus cart");
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
          console.log("success remove cart");
          var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
          for (let i = 0; i < min_plus_btns.length; i++) {
            if (min_plus_btns[i].getAttribute("id") == cartid) {
              min_plus_btns[i].parentElement.innerHTML =
                '<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="' +
                prodid +
                '" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>';
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
      const resJson = await res.json();

      if (res.status === 200) {
        console.log("success plus cart");
        console.log(update_button);
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

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="search-page--mobile">
          <div className="pt-20 pb-10">
            <ProductList products={products} />
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                activePage={activePage}
                setPages={setPages}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Search;
