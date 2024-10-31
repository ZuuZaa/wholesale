"use client";

import { useState, useEffect } from "react";
import "./checkout.scss";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import CardFrame from "@/components/cards/card-frame";
import { fetchData } from "@/utils/fetch-api";
import { useTotalQuantity } from "@/context/total-quantity-context";
import Loading from "@/components/loading";
import Icon from "@/components/icon";
import { Select } from "antd";
import { generateDateOptions } from "@/helpers";
import TextArea from "antd/es/input/TextArea";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const { Option } = Select;

const mainFunc1 = async () => {
  let status;
  let fav_data = [];

  const fetchData = async () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    let response = await fetch(
      "https://api.wscshop.co.uk/api/checkout/get-client-secret",
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
    //console.log(resp)
    status = resp.status;
    fav_data = resp.output;
    //console.log(fav_data)
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

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedShippingAddressOption, setSelectedShippingAddressOption] =
    useState(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState("1");
  const { setTotalQuantity } = useTotalQuantity();
  const [date, setDate] = useState(null);
  const [paymentText, setPaymentText] = useState(null);
  const [publishKey, setPublishKey] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentType, setPaymentType] = useState(null);

  const dateOptions = generateDateOptions(10);

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
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  const handleDeliveryClick = () => {
    // setDeliveryDropdownIsOpen(true);
    setSelectedShippingOption("1");
  };
  const handleCollectionClick = () => {
    // setDeliveryDropdownIsOpen(false);
    setSelectedShippingOption("2");
  };

  const handlePaymentOption = (e) => {
    setPaymentType(Number(e.target.value));
  };

  const handleShippingAddressOptionChange = (event) => {
    const selectedShippingAddressValue = event.target.value;
    setSelectedShippingAddressOption(selectedShippingAddressValue);
  };

  const onSelectChange = (date) => {
    setDate(date);
  };
  const onTextareaChange = (value) => {
    setPaymentText(value);
  };

  const isOrderButtonDisabled = () => {
    if (selectedShippingAddressOption === null) return true;
    if (paymentType === 1) return true;
    return false;
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("getPaymentPage", true);
        console.log("check response", response);
        setData(response);
        setSelectedShippingAddressOption(response.UserAddress[0].Id);
        localStorage.setItem("address", response.UserAddress[0].Id);
        setPublishKey(response.StripeDetails[0].PublishKey);
        setPaymentType(response.DefaultPayment);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
      const client_secret = localStorage.getItem("clientsecret");
      if (client_secret == null || client_secret == "") {
        const fetchedData1 = await mainFunc1();
        setClientSecret(fetchedData1);
        localStorage.setItem("clientsecret", fetchedData1);
      } else {
        setClientSecret(client_secret);
      }
    };

    fetchDataAsync();
  }, []);

  const stripePromise = loadStripe(publishKey);

  const cashPayment = async (e) => {
    try {
      const response = await fetchData("postPaymentPage", true, {
        PaymentType: paymentType,
        ShippingType: selectedShippingOption,
        AddressId: selectedShippingAddressOption,
        Date: date,
      });
      setTotalQuantity(response.TotalQuantity);
      window.location.href = "/success?payment_type=2";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div className="checkout-page">
        <MobilePageLayout title="Checkout">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <CardFrame>
                  <div className="checkout-card-title flex items-center gap-2 py-2">
                    <Icon
                      name="location"
                      size="22px"
                      color="var(--primary-theme-color)"
                    />
                    <h3>Delivery</h3>
                  </div>
                  <div className="dropdown-container">
                    <div className="checkout-card-actions py-2 checkout-border-top">
                      <button
                        className={
                          selectedShippingOption === "1"
                            ? "btn btn-success"
                            : "btn btn-secondary"
                        }
                        onClick={handleDeliveryClick}
                      >
                        Delivery
                      </button>
                      <button
                        className={
                          selectedShippingOption === "2"
                            ? "btn btn-success"
                            : "btn btn-secondary"
                        }
                        onClick={handleCollectionClick}
                      >
                        Collection
                      </button>
                    </div>
                    <div
                      className={
                        selectedShippingOption === "1"
                          ? "dropdown-content open"
                          : "dropdown-content"
                      }
                    >
                      {/* <div className="add-address flex justify-between py-2 border-top">
                    <p>Shipping address</p>
                    <button>+</button>
                  </div> */}
                      {data?.UserAddress?.length > 0 ? (
                        <ul className="address-list">
                          {data.UserAddress.map((address) => {
                            return (
                              <div
                                className="shipping-address-items p-5 border rounded-md my-6"
                                style={{
                                  border:
                                    selectedShippingAddressOption == address.Id
                                      ? "2px solid #333"
                                      : "1px solid #e5e7eb",
                                }}
                                key={address.Id}
                              >
                                <div className="title flex gap-3 items-center">
                                  <input
                                    type="radio"
                                    id="shp-address-item-1"
                                    name="shippingaddressopt"
                                    value={address.Id}
                                    checked={
                                      selectedShippingAddressOption ==
                                      address.Id
                                    }
                                    onChange={handleShippingAddressOptionChange}
                                    className=""
                                  />
                                  <label htmlFor="shp-address-item-1">
                                    {address.Title}
                                  </label>
                                </div>
                                <h6>{address.AdressLine1}</h6>
                                <h6>{address.AdressLine2}</h6>
                                <h6>
                                  {address.City}, {address.Country}
                                </h6>
                                <h6>{address.Phone}</h6>
                                <h6>{address.Postcode}</h6>
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
                    <Icon
                      name="card"
                      size="22px"
                      color="var(--primary-theme-color)"
                    />
                    <h3>Payment</h3>
                  </div>
                  <div className="dropdown-container">
                    <div className="checkout-card-actions py-2 checkout-border-top">
                      <button
                        className={`
                          btn btn-${paymentType === 2 ? "success" : "secondary"}
                          `}
                        value="2"
                        onClick={handlePaymentOption}
                        disabled={!data.CashActive}
                      >
                        Cash / Bank Transfer
                      </button>
                      <button
                        className={`
                          btn btn-${paymentType === 1 ? "success" : "secondary"}
                          `}
                        value="1"
                        onClick={handlePaymentOption}
                        disabled={!data.CardActive}
                      >
                        Card
                      </button>
                    </div>
                    <div className="payment-type-content">
                      {paymentType === 1 ? (
                        <div className="App">
                          {clientSecret &&
                            data?.CardActive && (
                              <div className="flex justify-center">
                                <Elements
                                  options={options}
                                  stripe={stripePromise}
                                >
                                  <CheckoutForm />
                                </Elements>
                              </div>
                            )}
                        </div>
                      ) : (
                        <>
                          {data?.CashActive && (
                            <TextArea
                              onChange={onTextareaChange}
                              name="cash-input"
                              className="cash-input py-2"
                              rows="6"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardFrame>
                <CardFrame>
                  <div className="flex gap-4">
                    <p className="select-label flex items-center">
                      {`${
                        selectedShippingOption === "1"
                          ? "Delivery"
                          : "Collection"
                      } date:`}
                    </p>
                    <Select
                      onChange={onSelectChange}
                      defaultValue="ASAP"
                      className="date-select flex-grow"
                    >
                      {dateOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </CardFrame>
                <CardFrame>
                  <div className="order-summary">
                    <ul className="border-top">
                      <li className="flex justify-between py-1">
                        <p>Subtotal</p>
                        <span>{`₤${data?.Subtotal}`}</span>
                      </li>
                      <li className="flex justify-between py-1">
                        <p>Discount</p>
                        <span>{`₤${data?.Discount}`}</span>
                      </li>
                      <li className="flex justify-between py-1">
                        <p>Delivery fee</p>
                        <span>{`₤${data?.DeliveryFee ?? 0}`}</span>
                      </li>
                      <div className="flex justify-between py-1">
                        <span>VAT</span>
                        <b>{`₤${data?.VAT}`}</b>
                      </div>
                      <li className="flex justify-between py-2 border-top">
                        <p>Total</p>
                        <span>{`₤${data?.Total}`}</span>
                      </li>
                    </ul>
                  </div>
                </CardFrame>
              </div>
              <div className="checkout-footer total-bottom px-4 py-3">
                <div className="price">
                  <p>Total</p>
                  <span>{`₤${data?.Total}`}</span>
                </div>
                <button
                  onClick={cashPayment}
                  className="btn btn-success"
                  disabled={isOrderButtonDisabled()}
                >
                  Order now
                </button>
              </div>
            </>
          )}
        </MobilePageLayout>
      </div>
    </main>
  );
};

export default Checkout;
