"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UilTimesCircle } from "@iconscout/react-unicons";
import CounterInput from "./CounterInput";
import MethodModal from "./Method";
import Loading from "@/components/loading";
import BasketCard from "./backet-card";
import "./cart.scss";

let token = "";
let session_id = "";
if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("jwtToken");
  session_id = localStorage.getItem("sessionId");
}
// useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     const session_id=localStorage.getItem("sessionId");
// })

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
  const [carts, setCarts] = useState([])

  const [data, setData] = useState({
    cart: [],
    subtotal: [],
    totalQuantity: [],
    userType: [],
    isLogin: [],
  });

  const updateTotalPrise = (price) => setTotalPrice(price);

  const updateCarts = (carts) => setCarts(carts);


  useEffect(() => {
      async function fetchDataAsync() {
        const fetchedData = await fetchData();
        setData(fetchedData);
        setTotalPrice(fetchedData.subtotal.toFixed(2));
        setCarts(fetchedData.cart)
        setIsLoading(false);
      }
    fetchDataAsync();
    
  }, []);

  
  const subtotal = data.subtotal;
  const userType = data.userType;
  const isLogin = data.isLogin;
  // if(carts.count>0){
  //     setShowResults(true);
  // }
  console.log(data, "carts");
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
        console.log(resJson);
        //setData(resJson.output)

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
      <div className="cart-page--desktop">
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
                    {" "}
                    Home{" "}
                  </a>
                </li>

                <li>
                  <div className="flex items-center">
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">
                      Your Shopping Cart
                    </a>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <section className="cart-main-section my-20 py-3" id="cart_table">
          {carts.length > 0 ? (
            <div className="custom-container mx-auto">
              {/* Cart Table */}
              <div className="cart-table mb-20">
                <table className="w-full text-center mb-8 ">
                  <thead className="max-[992px]:hidden">
                    <tr>
                      <th>IMAGE</th>
                      <th>PRODUCT</th>
                      <th>PRICE</th>
                      <th>QUANTITY</th>
                      <th>TOTAL</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((cart) => {
                      return (
                        <tr>
                          <td>
                            <img
                              src={cart.productImage}
                              width={74}
                              height={74}
                              className="mx-auto"
                              alt={cart.productName}
                            ></img>
                            {/* <Image src={Product1} width={74} height={74} className='mx-auto' alt='Product'/> */}
                          </td>
                          <td>
                            <div className="cart-table-product-name">
                              <h6>{cart.productName}</h6>
                              {/* <p>M / Gold</p> */}
                            </div>
                          </td>
                          <td>£{cart.price.toFixed(2)}</td>
                          <td>
                            <CounterInput
                              initialValue={cart.quantity}
                              min={1}
                              max={100}
                              id={cart.productId}
                            />{" "}
                          </td>
                          <td>£{cart.total.toFixed(2)}</td>
                          <td onClick={removeCart} id={cart.id}>
                            {" "}
                            <UilTimesCircle
                              size="41"
                              color="#cecece"
                              className="mx-auto remove-icon"
                            />{" "}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="cart-table-btns max-[992px]:block flex justify-end gap-2 pb-8">
                  {/* <Link href='/' className=" link-design1 font-bold inline-flex rounded-full gap-1">Update Cart</Link> */}
                  <Link
                    href="/"
                    className=" link-design1 font-bold inline-flex rounded-full gap-1"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="javascript:void(0)"
                    className=" link-design1 font-bold inline-flex rounded-full gap-1"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Link>
                </div>
              </div>

              {/* Cart Totals */}
              <div className="cart-totals ">
                <div className="grid max-[992px]:grid-cols-1 grid-cols-2">
                  <div className="cart-totals-grid-item cart-totals-grid-item-1 px-4">
                    {/* <h5 className='text-2xl mb-6'>Pick a delivery date and Time</h5>
                            <p>Pick delivery date and time as you choose. Delivery Time takes place between 12PM - 4PM MON-FRI AND 8AM-11AM SAT.</p>   
                             */}
                    {/* <h5 className='text-2xl mb-6 mt-12'>Get shipping estimates</h5> */}
                  </div>
                  <div className="cart-totals-grid-item cart-totals-grid-item-2 px-4">
                    <div className="cart-totals-area">
                      <h2 className="text-4xl mb-10 text-center">
                        Cart Totals
                      </h2>

                      <table className="w-full mb-8">
                        <tbody>
                          {/* <tr>
                                                <td className='font-semibold'>SUBTOTAL</td>
                                                <td className='text-sm text-end' id="subtotal">£{subtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td className='font-semibold'>DISCOUNT</td>
                                                <td className='text-sm text-end'>£0</td>
                                            </tr> */}
                          <tr>
                            <td className="font-semibold">TOTAL</td>
                            <td className="text-sm text-end" id="total">
                              £{subtotal.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* <span className='flex pl-5'>  
                                        <input
                                            className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value=""
                                            id="checkboxDefault" /> 
                                            I agree with the terms and conditions
                                    </span> */}

                      <Link
                        href="javascript:void(0)"
                        className=" link-design1 font-bold inline-flex rounded-full gap-1 mt-4"
                        onClick={handleClick}
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p class="custom-container mx-auto">This cart is empty!</p>
          )}
        </section>
        {/* {
                <MethodModal isLogin={isLogin} isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                </MethodModal>
            } */}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="cart-page--mobile">
          <section className="px-3">
            <h2 className="page-header">My Basket</h2>
            {carts.length > 0 ? (
              <ul className="basket-list">
                {carts.map((item) => (
                  <BasketCard
                    product={item}
                    updateCarts={updateCarts}
                    updateTotalPrise={updateTotalPrise}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-center py-5">Your basket is empty.</p>
            )}

            <div className="price-details">
              <h4 className="price-details__title">Price details</h4>
              <div className="flex justify-between">
                <span>Cart total</span>
                <span>{`₤ ${totalPrice}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Total payable</span>
                <span>{`₤ ${totalPrice}`}</span>
              </div>
            </div>
          </section>
          <section>
            <div className="basket-footer px-4 py-3">
              <div className="price">
                <p>Total</p>
                <span>{`₤ ${totalPrice}`}</span>
              </div>
              <Link href="/checkout" className="btn btn-success">
                continue
              </Link>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
