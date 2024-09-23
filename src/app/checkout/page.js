"use client";
import React, { useState, useEffect } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import Image from "next/image";
import { UilPaypal } from "@iconscout/react-unicons";
import PImg1 from "../../../public/images/products/1.webp";
import CheckoutForm from "./CheckoutForm";
import "./checkout.scss";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import CardFrame from "@/components/cards/card-frame";
import location from "@/assets/icons/location.svg";
import payment from "@/assets/icons/payment.svg";
import { useTotalQuantity } from "@/context/total-quantity-context";

const mainFunc = async () => {
  let status;
  let fav_data = [];

  const fetchData = async () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    let response = await fetch(
      `https://api.wscshop.co.uk/api/checkout/get-payment`,
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

const mainFunc1 = async () => {
  let status;
  let fav_data = [];

  const fetchData = async () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    let response = await fetch(
      `https://api.wscshop.co.uk/api/checkout/get-client-secret`,
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
    fav_data = resp.output;
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

export default function Checkout() {
  // Shipping Address Adding Form
  const [addressForm, setaddressForm] = useState(false);
  const [deliveryDropdownIsOpen, setDeliveryDropdownIsOpen] = useState(true);
  const [paymentDropdownIsOpen, setPaymentDropdownIsOpen] = useState(true);
  const toggleAddressForm = () => {
    setaddressForm(!addressForm);
  };
  const { setTotalQuantity } = useTotalQuantity();

  let ShippingAddressBtn;

  if (addressForm) {
    ShippingAddressBtn = (
      <div>
        <span
          className="w-9 h-9 flex items-center justify-center rounded-full bg-black hover:bg-gray-600 text-white text-base cursor-pointer"
          onClick={toggleAddressForm}
        >
          {" "}
          x{" "}
        </span>
      </div>
    );
  } else {
    ShippingAddressBtn = (
      <div>
        <span
          className="w-9 h-9 flex items-center justify-center rounded-full bg-black hover:bg-gray-600 text-white text-base cursor-pointer"
          onClick={toggleAddressForm}
        >
          {" "}
          +{" "}
        </span>
      </div>
    );
  }

  // Radio Buttons
  const [selectedOption, setSelectedOption] = useState("option2");
  const [selectedShippingAddressOption, setSelectedShippingAddressOption] =
    useState("0");
  const [selectedShippingOption, setSelectedShippingOption] = useState("2");
  const [selectedBillingOption, setSelectedBillingOption] = useState(null);

  const handlePaymentClick = () =>
    setPaymentDropdownIsOpen(!paymentDropdownIsOpen);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };
  const handleShippingAddressOptionChange = (event) => {
    const selectedShippingAddressValue = event.target.value;
    setSelectedShippingAddressOption(selectedShippingAddressValue);
  };
  const handleShippingOptionChange = (event) => {
    const selectedShippingValue = event.target.value;
    setSelectedShippingOption(selectedShippingValue);
  };
  const handleBillingOptionChange = (event) => {
    const selectedBillingValue = event.target.value;
    setSelectedBillingOption(selectedBillingValue);
  };

  const handleDeliveryClick = () => {
    setDeliveryDropdownIsOpen(true);
    setSelectedShippingOption("1");
  };
  const handleCollectionClick = () => {
    setDeliveryDropdownIsOpen(false);
    setSelectedShippingOption("2");
  };
  //   Form Elements
  const [formData, setFormData] = useState({
    addressTitle: "",
    phone: "",
    addressline1: "",
    addressline2: "",
    postalcode: "",
    city: "",
    termsAccepted: false,
  });

  const [formData2, setFormData2] = useState({
    addressTitle: "",
    phone: "",
    addressline1: "",
    addressline2: "",
    postalcode: "",
    city: "",
    termsAccepted: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleChange2 = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData2({ ...formData2, [name]: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data:", formData);
  };

  const handleSubmit2 = (event) => {
    event.preventDefault();
    console.log("Form data:", formData2);
  };

  const [data, setData] = useState({
    cart: [],
    sale: [],
    saleProducts: [],
    subtotal: [],
    discount: [],
    total: [],
    totalEnd: [],
    totalQuantity: [],
    userAddress: [],
    user: [],
    balance: [],
    bonus: [],
    usedBalance: [],
    stripeDetails: [],
    paypalDetails: [],
  });

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await mainFunc();
      setData(fetchedData);
      const fetchedData1 = await mainFunc1();
      setClientSecret(fetchedData1);
      if (fetchedData.userAddress.length != 0) {
        setSelectedShippingAddressOption(fetchedData.userAddress[0].id);
      }
    }
    fetchDataAsync();
    let payment = "";
    if (
      typeof localStorage !== "undefined" &&
      localStorage.getItem("payment") !== null
    ) {
      payment = localStorage.getItem("payment");
      setSelectedOption(payment);
    }

    let shipping = "";
    if (
      typeof localStorage !== "undefined" &&
      localStorage.getItem("shipping") !== null
    ) {
      shipping = localStorage.getItem("shipping");
      setSelectedShippingOption(shipping);
    }
  }, []);

  const user = data.user;
  const userAddress = data.userAddress;
  const saleProducts = data.saleProducts;
  const subtotal = data.subtotal;
  const discount = data.discount;
  const total = data.total;
  const deliveryFee = 0;
  let publish_key = "";
  let secret_key = "";
  data.stripeDetails.map((stripe) => {
    publish_key = stripe.publishKey;
    secret_key = stripe.secretKey;
  });

  const stripePromise = loadStripe(publish_key);

  const appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "4px",
      // See all possible variables below
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  let cashPayment = async (e) => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    let shipping = "";
    if (
      typeof localStorage !== "undefined" &&
      localStorage.getItem("shipping") !== null
    ) {
      shipping = localStorage.getItem("shipping");
    }
    let address = "";
    if (
      typeof localStorage !== "undefined" &&
      localStorage.getItem("address") !== null
    ) {
      address = localStorage.getItem("address");
    }
    const res = await fetch(
      "https://api.wscshop.co.uk/api/checkout/post-payment",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          PaymentType: 2,
          ShippingType: selectedShippingOption,
          AddressId: selectedShippingAddressOption,
        }),
      }
    );
    if (res.status == 200) {
      setTotalQuantity(0);
      window.location.href = "/success?payment_type=2";
    }
  };

  return (
    <main>
      <div className="checkout-page">
        <MobilePageLayout title="Checkout">
          <div className="flex flex-col gap-3">
            <CardFrame>
              <div className="checkout-card-title flex items-center gap-2 py-2">
                <Image src={location} alt="delivery" />
                <h3>Delivery</h3>
              </div>
              <div className="dropdown-container">
                <div className="checkout-card-actions py-2 checkout-border-top">
                  <button
                    className={
                      deliveryDropdownIsOpen
                        ? "btn btn-success"
                        : "btn btn-secondary"
                    }
                    onClick={handleDeliveryClick}
                  >
                    Delivery
                  </button>
                  <button
                    className={
                      deliveryDropdownIsOpen
                        ? "btn btn-secondary"
                        : "btn btn-success"
                    }
                    onClick={handleCollectionClick}
                  >
                    Collection
                  </button>
                </div>
                <div
                  className={
                    deliveryDropdownIsOpen
                      ? "dropdown-content open"
                      : "dropdown-content"
                  }
                >
                  {/* <div className="add-address flex justify-between py-2 border-top">
                    <p>Shipping address</p>
                    <button>+</button>
                  </div> */}
                  {userAddress.length > 0 ? (
                    <ul className="address-list">
                      {userAddress.map((address) => {
                        return (
                          <div
                            className="shipping-address-items p-5 border rounded-md my-6"
                            style={{
                              border:
                                selectedShippingAddressOption == address.id
                                  ? "2px solid #333"
                                  : "1px solid #e5e7eb",
                            }}
                            key={address.id}
                          >
                            <div className="title flex gap-3 items-center">
                              <input
                                type="radio"
                                id="shp-address-item-1"
                                name="shippingaddressopt"
                                value={address.id}
                                checked={
                                  selectedShippingAddressOption == address.id
                                }
                                onChange={handleShippingAddressOptionChange}
                                className=""
                              />
                              <label htmlFor="shp-address-item-1">
                                {address.title}
                              </label>
                            </div>
                            <h6>{address.adressLine1}</h6>
                            <h6>{address.adressLine2}</h6>
                            <h6>
                              {address.city}, {address.country}
                            </h6>
                            <h6>{address.phone}</h6>
                            <h6>{address.postcode}</h6>
                          </div>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>No address data</p>
                  )}
                </div>
              </div>
            </CardFrame>
            <CardFrame>
              <div className="checkout-card-title flex items-center gap-2 py-2">
                <Image src={payment} alt="payment" />
                <h3>Payment</h3>
              </div>
              <div className="dropdown-container">
                <div className="checkout-card-actions py-2 checkout-border-top">
                  <button
                    className={
                      paymentDropdownIsOpen
                        ? "btn btn-success"
                        : "btn btn-secondary"
                    }
                    // onClick={handlePaymentClick}
                  >
                    Cash/ Bank Transfer
                  </button>
                  <button className="btn btn-secondary" disabled="true">
                    Card
                  </button>
                </div>
                <div className="dropdown-content open">
                  <textarea
                    name="cash-input"
                    className="cash-input py-2"
                    rows="6"
                  />
                </div>
              </div>
            </CardFrame>
            <CardFrame>
              <div className="order-summary">
                <h3 className="py-2">Order Summary</h3>
                <ul className="border-top">
                  <li className="flex justify-between py-1">
                    <p>Subtotal</p>
                    <span>{`₤${subtotal}`}</span>
                  </li>
                  <li className="flex justify-between py-1">
                    <p>Discount</p>
                    <span>{`₤${discount}`}</span>
                  </li>
                  <li className="flex justify-between py-1">
                    <p>Delivery fee</p>
                    <span>{`₤${deliveryFee}`}</span>
                  </li>
                  <li className="flex justify-between py-2 border-top">
                    <p>Total</p>
                    <span>{`₤${total}`}</span>
                  </li>
                </ul>
              </div>
            </CardFrame>
          </div>
          <div className="checkout-footer total-bottom px-4 py-3">
            <div className="price">
              <p>Total</p>
              <span>{`₤${total}`}</span>
            </div>
            <button onClick={cashPayment} className="btn btn-success">
              Order now
            </button>
          </div>
        </MobilePageLayout>
      </div>
    </main>
  );
}
