"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UilTimesCircle } from "@iconscout/react-unicons";
import CounterInput from "./CounterInput";
import MethodModal from "./Method";
import Loading from "@/components/loading";
import "./cart.scss";
import BasketCard from "@/components/cards/basket-card";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import SearchBar from "@/components/search-bar";

let token = "";
let session_id = "";
if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("jwtToken");
  session_id = localStorage.getItem("sessionId");
}

const params = new URLSearchParams();
params.append("SessionId", session_id);
async function fetchData() {
  const response = await fetch(
    `https://api.wscshop.co.uk/api/cart/get-index?${params.toString()}`,
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
  return data.output;
}

export default function Cart() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [carts, setCarts] = useState([]);
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [data, setData] = useState({
    cart: [],
    subtotal: [],
    totalQuantity: [],
    userType: [],
    isLogin: [],
  });

  const updateTotalPrise = (price) => setTotalPrice(price);

  const updateCarts = (carts) => setCarts(carts);

  const handleInputChange = (event) => {
    setSearchKey(event.target.value.toLowerCase());
    const filteredCarts = carts?.filter((item) =>
      item.productName.toLowerCase().includes(searchKey.trim())
    );
    setFilteredCarts(filteredCarts);
  };

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await fetchData();
      setData(fetchedData);
      setTotalPrice(fetchedData.subtotal.toFixed(2));
      setCarts(fetchedData.cart);
      setIsLoading(false);
    }
    fetchDataAsync();
  }, []);

  const subtotal = data.subtotal;
  const userType = data.userType;
  const isLogin = data.isLogin;
  if (!isLogin) {
    window.location.href = "/login";
  }

  let removeCart = async (event) => {
    let cartid = event.currentTarget.getAttribute("id");
    console.log(cartid);
    //const token = localStorage.getItem("jwtToken");
    //const session_id=localStorage.getItem("sessionId");
    var remove_btn = event.currentTarget;
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

        remove_btn.parentElement.remove();
        document.getElementById("subtotal").textContent =
          "£" + resJson.output.subtotal.toFixed(2);
        document.getElementById("total").textContent =
          "£" + resJson.output.subtotal.toFixed(2);
        if (resJson.output.subtotal == 0) {
          document.getElementById("cart_table").innerHTML =
            "<p class='custom-container mx-auto'>This cart is empty!</p>";
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

  let clearCart = async (event) => {
    const res = await fetch("https://api.wscshop.co.uk/api/cart/clear-cart", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        SessionId: session_id,
      }),
    });
    const resJson = await res.json();
    setData(resJson.output);
    document.getElementById("cart_drop").style.display = "none";
    document.getElementById("cart_quantity").style.display = "none";
    //document.getElementById("cart_dropdown").remove()
  };

  let handleClick = async (event) => {
    //satisi bitir

    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/checkout/checkout",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ShippingType: 0,
          }),
        }
      );
      const resJson = await res.json();
      if (res.status === 200) {
        //console.log(resJson.output)
        window.location.href = "/checkout";
      } else {
        console.log(res);
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
        <div className="cart-page">
          <MobilePageLayout title="My Basket">
            {carts.length > 0 ? (
              <>
                <SearchBar
                  searchKey={searchKey}
                  handleInputChange={handleInputChange}
                />

                <ul className="basket-list">
                  {searchKey
                    ? filteredCarts.map((item) => (
                        <BasketCard
                          product={item}
                          updateCarts={updateCarts}
                          updateTotalPrise={updateTotalPrise}
                        />
                      ))
                    : carts.map((item) => (
                        <BasketCard
                          product={item}
                          updateCarts={updateCarts}
                          updateTotalPrise={updateTotalPrise}
                        />
                      ))}
                </ul>
              </>
            ) : (
              <p className="text-center py-5">Your basket is empty.</p>
            )}
            <section className="basket-footer total-bottom">
              <div className="price-details">
                <div className="flex justify-between">
                  <span>Cart total</span>
                  <span>{`₤${totalPrice}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total payable</span>
                  <span>{`₤${totalPrice}`}</span>
                </div>
              </div>
              <div className="basket-action px-4 py-3">
                <div className="price">
                  <p>Total</p>
                  <span>{`₤${totalPrice}`}</span>
                </div>
                <Link href="/checkout" className="btn btn-success">
                  continue
                </Link>
              </div>
            </section>
          </MobilePageLayout>
        </div>
      )}
    </main>
  );
}
