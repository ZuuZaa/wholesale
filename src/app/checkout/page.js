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
      window.location.href = "/success?payment_type=2";
    }
  };

  console.log("address", userAddress);

  return (
    <main>
      <div className="checkout-page--desktop">
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
                    Home
                  </a>
                </li>

                <li>
                  <div className="flex items-center">
                    <a href="/" className="ms-1 text-sm font-medium md:ms-2">
                      Checkout
                    </a>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Checkout Section */}
        <section className="checkout-main-section mt-5 pt-16">
          <div className="frd-container mx-auto">
            <div className="checkout-flex grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side */}
              <div className="checkout-left">
                {/* Contact */}
                <h1 className="text-center md:text-left text-xl md:text-3xl font-bold mb-10 border-b pb-3">
                  Contact
                </h1>

                <div className="checkout-contact-info-box border rounded-md p-4 mb-14">
                  <div className="flex mb-4">
                    <h5>Contact: </h5>
                    {user.map((us) => {
                      return (
                        <h6>
                          {" "}
                          {us.firstName} {us.lastName}, {us.email}, {us.phone}{" "}
                        </h6>
                      );
                    })}
                  </div>
                  {/* <div className='flex mb-4'>
                                    <h5>Ship to: </h5><h6> 62-64, Stoke Newington High Street , London, UK </h6>
                                </div>
                                <div className='flex'>
                                    <h5>Method</h5><h6> Standart ( 1 - 1 days) £0.00 </h6>
                                </div> */}
                </div>

                {/* Shipping */}
                <h1 className="text-center md:text-left text-xl md:text-3xl font-bold my-10 border-b pb-3">
                  Delivery
                </h1>

                <div className="border rounded-md mb-14 flex items-center justify-center overflow-hidden">
                  <div
                    className="p-4 w-1/2 relative flex gap-3 border-r border-gray-200"
                    style={{
                      backgroundColor:
                        selectedShippingOption === "1" ? "#e52e06" : "#f7f7f7",
                    }}
                  >
                    <input
                      type="radio"
                      id="shippingoption1"
                      name="shippingoptions"
                      value="1"
                      checked={selectedShippingOption === "1"}
                      onChange={handleShippingOptionChange}
                      className="opacity-0"
                    />
                    <label
                      htmlFor="shippingoption1"
                      className="option_layer absolute inset-0 cursor-pointer"
                    ></label>
                    <label
                      htmlFor="shippingoption1"
                      className="text-lg"
                      style={{
                        color: selectedShippingOption === "1" ? "#fff" : "#333",
                      }}
                    >
                      Delivery
                    </label>
                  </div>

                  <div
                    className="p-4 w-1/2 relative flex gap-3 border-r border-gray-200"
                    style={{
                      backgroundColor:
                        selectedShippingOption === "2" ? "#e52e06" : "#f7f7f7",
                    }}
                  >
                    <input
                      type="radio"
                      id="shippingoption2"
                      name="shippingoptions"
                      value="2"
                      checked={selectedShippingOption === "2"}
                      onChange={handleShippingOptionChange}
                      className="opacity-0"
                    />
                    <label
                      htmlFor="shippingoption2"
                      className="option_layer absolute inset-0 cursor-pointer"
                    ></label>
                    <label
                      htmlFor="shippingoption2"
                      className="text-lg"
                      style={{
                        color: selectedShippingOption === "2" ? "#fff" : "#333",
                      }}
                    >
                      Collection
                    </label>
                  </div>
                </div>
                {selectedShippingOption === "1" && (
                  <div className="shippingmethod_wrapper">
                    {/* Method */}
                    {/* <h1 className='text-center md:text-left text-xl md:text-2xl font-bold my-10 border-b pb-3 text-red-500'>Shipping Method</h1>
                                    <div className='border rounded-md p-4 mb-14'>
                                        <div className='flex gap-3 items-center justify-between'>
                                            <div className='flex gap-3'>
                                                <input type="radio" id="shippingmethodoption1" name="shippingmethodoptions" value="shippingmethodoption1"/>
                                                <label htmlFor="shippingmethodoption1" className='text-lg'>Standart , 1 - 1 days</label>
                                            </div>
                                            <div>
                                                <h6>£1.88</h6>
                                            </div>
                                        </div>
                                    </div> */}

                    {/* Address */}
                    <h1 className="text-center flex gap-5 justify-between md:text-left text-xl md:text-2xl font-bold my-10 border-b pb-3 text-red-500">
                      Delivery Address
                      {/* <span className='w-9 h-9 flex items-center justify-center rounded-full bg-black hover:bg-gray-600 text-white text-base cursor-pointer'> + </span> */}
                    </h1>
                    {/* <form onSubmit={handleSubmit2} className='p-5 border rounded-md checkout-billing-address-form'>
                                        <div className='grid grid-cols-2 gap-2 mb-3'>
                                            <div>
                                                <label htmlFor="addressTitle">Address Title:</label>
                                                <input type="text" className='border outline-none rounded-md' id="addressTitle" name="addressTitle" value={formData2.addressTitle} onChange={handleChange2} required />
                                            </div>
                                            <div>
                                                <label htmlFor="phone">Phone:</label>
                                                <input type="text" className='border outline-none rounded-md' id="phone" name="phone" value={formData2.phone} onChange={handleChange2} required />
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor="addressline1">Address Line 1:</label>
                                            <input type="text" className='border outline-none rounded-md' id="addressline1" name="addressline1" value={formData2.addressline1} onChange={handleChange2} required/>
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor="addressline2">Address Line 2:</label>
                                            <input type="text" className='border outline-none rounded-md' id="addressline2" name="addressline2" value={formData2.addressline2} onChange={handleChange2} required/>
                                        </div>
                                        <div className='grid grid-cols-2 gap-2 mb-3'>
                                            <div>
                                                <label htmlFor="password">Postal Code:</label>
                                                <input type="text" className='border outline-none rounded-md' id="postalcode" name="postalcode" value={formData2.postalcode} onChange={handleChange2} required/>
                                            </div>
                                            <div>
                                                <label htmlFor="city">City:</label>
                                                <input type="text" className='border outline-none rounded-md' id="city" name="city" value={formData2.city} onChange={handleChange2} required/>
                                                
                                            </div>
                                        </div>
                                        <div className='mb-3 flex gap-3 mt-3 items-center'>
                                            <input type="checkbox" id="termsAccepted" name="termsAccepted" checked={formData2.termsAccepted} onChange={handleChange2}/>
                                            <label htmlFor="termsAccepted">I accept the terms and conditions</label>
                                        </div>
                                        <button type="submit" className='mt-4 py-3 px-11  text-white bg-green-700 hover:bg-green-800 cursor-pointer rounded-md border-none'>Add</button>
                                    </form> */}

                    {/* Address Items */}
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
                  </div>
                )}

                {/* Payment */}
                <h1 className="text-center md:text-left text-xl md:text-3xl font-bold mb-10 border-b pb-3">
                  Payment
                </h1>
                <p className="text-center md:text-left mb-3">
                  All transactions are secure and encrypted.
                </p>

                <div className="border rounded-md mb-14 flex items-center justify-center overflow-hidden">
                  <div
                    className="p-4 w-1/2 relative flex gap-3 border-r border-gray-200"
                    style={{
                      backgroundColor:
                        selectedOption === "option1" ? "#e52e06" : "#f7f7f7",
                    }}
                  >
                    <input
                      type="radio"
                      id="option1"
                      name="options"
                      value="option1"
                      checked={selectedOption === "option1"}
                      onChange={handleOptionChange}
                      className="opacity-0"
                    />
                    <label
                      htmlFor="option1"
                      className="option_layer absolute inset-0 cursor-pointer"
                    ></label>
                    <label
                      htmlFor="option1"
                      className="text-lg"
                      style={{
                        color: selectedOption === "option1" ? "#fff" : "#333",
                      }}
                    >
                      Card
                    </label>
                  </div>

                  <div
                    className="p-4 w-1/2 relative flex gap-3"
                    style={{
                      backgroundColor:
                        selectedOption === "option2" ? "#e52e06" : "#f7f7f7",
                    }}
                  >
                    <input
                      type="radio"
                      id="option2"
                      name="options"
                      value="option2"
                      checked={selectedOption === "option2"}
                      onChange={handleOptionChange}
                      className="opacity-0"
                    />
                    <label
                      htmlFor="option2"
                      className="option_layer absolute inset-0 cursor-pointer"
                    ></label>
                    <label
                      htmlFor="option2"
                      className="text-lg"
                      style={{
                        color: selectedOption === "option2" ? "#fff" : "#333",
                      }}
                    >
                      Cash/Bank Transfer
                    </label>
                  </div>
                </div>
                {selectedOption === "option1" && (
                  <div className="flex gap-3">
                    {/* <button className='py-4 px-5 rounded-lg bg-gray-200 flex gap-2'> Stripe</button> */}
                    <div className="App">
                      {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                          <CheckoutForm />
                        </Elements>
                      )}
                    </div>

                    {/* <button className='py-4 px-5 rounded-lg bg-gray-200 flex gap-2'><UilPaypal size="20" color="#333" />Paypal</button> */}
                  </div>
                )}
                {selectedOption === "option2" && (
                  <div>This is content for Option Cash or Bank Transfer</div>
                )}

                {/* Billing Address */}
                {/* <h1 className='text-center md:text-left text-xl md:text-3xl font-bold my-10 border-b pb-3'>Billing Address</h1>
                            <p className='text-center md:text-left mb-3'>Select the address that matches your card or payments method.</p>

                            <div className='checkout-billing-address-box border rounded-md p-4 mb-14'>
                                <div className='flex mb-4 items-center gap-3'>
                                    <input
                                        type="radio"
                                        id="billingoption1"
                                        name="billingoptions"
                                        value="billingoption1"
                                        checked={selectedBillingOption === "billingoption1"}
                                        onChange={handleBillingOptionChange}
                                        className=''
                                        />
                                        <label htmlFor='billingoption1'> Same as shipping address </label>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                    <input
                                        type="radio"
                                        id="billingoption2"
                                        name="billingoptions"
                                        value="billingoption2"
                                        checked={selectedBillingOption === "billingoption2"}
                                        onChange={handleBillingOptionChange}
                                        className=''
                                        />
                                        <label htmlFor='billingoption2'> Use a different billing address </label>
                                    </div>
                               
                            </div>
                            {selectedBillingOption === "billingoption2" && (
                                
                                <form onSubmit={handleSubmit} className='p-5 border rounded-md checkout-billing-address-form'>
                                    <div className='grid grid-cols-2 gap-2 mb-3'>
                                        <div>
                                            <label htmlFor="addressTitle">Address Title:</label>
                                            <input type="text" className='border outline-none rounded-md' id="addressTitle" name="addressTitle" value={formData.addressTitle} onChange={handleChange} required />
                                        </div>
                                        <div>
                                            <label htmlFor="phone">Phone:</label>
                                            <input type="text" className='border outline-none rounded-md' id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="addressline1">Address Line 1:</label>
                                        <input type="text" className='border outline-none rounded-md' id="addressline1" name="addressline1" value={formData.addressline1} onChange={handleChange} required/>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="addressline2">Address Line 2:</label>
                                        <input type="text" className='border outline-none rounded-md' id="addressline2" name="addressline2" value={formData.addressline2} onChange={handleChange} required/>
                                    </div>
                                    <div className='grid grid-cols-2 gap-2 mb-3'>
                                        <div>
                                            <label htmlFor="password">Postal Code:</label>
                                            <input type="text" className='border outline-none rounded-md' id="postalcode" name="postalcode" value={formData.postalcode} onChange={handleChange} required/>
                                        </div>
                                        <div>
                                            <label htmlFor="city">City:</label>
                                            <select id="city" className='border outline-none rounded-md' name="city" value={formData.city} onChange={handleChange} required>
                                                <option value="">Select</option>
                                                <option value="male">Baku</option>
                                                <option value="female">Ganja</option>
                                                <option value="other">Shaki</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className='mt-4 py-3 px-11  text-white bg-black hover:bg-gray-800 cursor-pointer rounded-md border-none'>Submit</button>
                                    </form>
                            )} */}
              </div>

              {/* Right Side */}
              <div className="checkout-right">
                <div className="sticky top-24">
                  <h1 className="text-center md:text-left text-xl md:text-3xl font-bold mb-3 border-b pb-3">
                    Order Summary
                  </h1>

                  {/* Products */}
                  <div className="checkout-products pt-7 mb-7">
                    {saleProducts.map((product) => {
                      return (
                        <div className="checkout-product-item flex items-center gap-3 mb-5">
                          <div className="img border rounded-md relative">
                            <img
                              src={product.productImage}
                              width={80}
                              height={80}
                              className=""
                              alt="Product Image"
                            ></img>
                            <div className="count absolute -top-3 -right-3 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-sm">
                              {" "}
                              {product.quantity}{" "}
                            </div>
                          </div>
                          <div className="name">
                            <h5 className="font-semibold mb-2">
                              {product.productName}
                            </h5>
                            <h6 className="m-0">£{product.price}</h6>
                          </div>
                          <div className="price">
                            <h6 className="m-0">£{product.total}</h6>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Prices */}
                  <div className="prices-wrapper pt-7 border-t">
                    <div className="flex justify-between">
                      <h6 className="font-semibold mb-4 text-lg">Subtotal</h6>
                      <span>£{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <h6 className="font-semibold mb-4 text-lg">Discount</h6>
                      <span>£{discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <h6 className="font-semibold mb-4 text-lg">
                        Delivery Fee
                      </h6>
                      <span>£0</span>
                    </div>
                  </div>

                  {/* Prices - Total */}
                  <div className="prices-wrapper pt-7 border-t">
                    <div className="flex justify-between">
                      <h6 className="font-semibold mb-4 text-lg">Total</h6>
                      <span className="font-semibold text-lg">£{total}</span>
                    </div>
                    {/* <div className='flex justify-between'>
                                        <h6 className='font-semibold mb-4 text-lg'>Total after using Balance</h6><span className='font-semibold text-lg'>£1.88</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h6 className='font-semibold mb-4 text-lg'>Balance</h6><span className='font-semibold text-lg'>£1.88</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h6 className='font-semibold mb-4 text-lg'>You will earn</h6><span className='font-semibold text-lg'>£0</span>
                                    </div> */}
                    {selectedOption === "option2" && (
                      <Link
                        href="javascript:void(0)"
                        className="link-design1 font-bold inline-flex rounded-md gap-1 mt-4 p-4"
                        onClick={cashPayment}
                      >
                        Order Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="checkout-page--mobile">
        <MobilePageLayout title="Checkout">
          <div className="card-container">
            <CardFrame>
              <div className="card-title flex items-center gap-2 py-2">
                <Image src={location} alt="delivery" />
                <h3>Delivery</h3>
              </div>
              <div className="dropdown-container">
                <div className="card-actions py-2 border-top">
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
                      <li className="border-top py-2">
                        <p className="flex items-center gap-2">
                          <span className="disk active"></span>
                          Home
                        </p>
                        <ul>
                          <li className="pl-5 py-1">Address</li>
                          <li className="pl-5 py-1">Address</li>
                          <li className="pl-5 py-1">Address</li>
                        </ul>
                      </li>
                      <li className="border-top py-2">
                        <p className="flex items-center gap-2">
                          <span className="disk"></span>
                          Office
                        </p>
                        <ul>
                          <li className="pl-5 py-1">Address</li>
                          <li className="pl-5 py-1">Address</li>
                          <li className="pl-5 py-1">Address</li>
                        </ul>
                      </li>
                    </ul>
                  ) : (
                    <p>No address data</p>
                  )}
                </div>
              </div>
            </CardFrame>
            <CardFrame>
              <div className="card-title flex items-center gap-2 py-2">
                <Image src={payment} alt="payment" />
                <h3>Payment</h3>
              </div>
              <div className="dropdown-container">
                <div className="card-actions py-2 border-top">
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
