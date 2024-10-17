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

const { Option } = Select;

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [deliveryDropdownIsOpen, setDeliveryDropdownIsOpen] = useState(true);
  const [paymentDropdownIsOpen, setPaymentDropdownIsOpen] = useState(true);
  const [selectedShippingAddressOption, setSelectedShippingAddressOption] =
    useState(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState("2");
  const { setTotalQuantity } = useTotalQuantity();
  const [date, setDate] = useState(null);
  const [paymenttText, setPaymenttText] = useState(null);

  const paymentType = 2;
  const dateOptions = generateDateOptions(10);

  const handleDeliveryClick = () => {
    setDeliveryDropdownIsOpen(true);
    setSelectedShippingOption("1");
  };
  const handleCollectionClick = () => {
    setDeliveryDropdownIsOpen(false);
    setSelectedShippingOption("2");
  };

  // const handlePaymentClick = () =>
  //   setPaymentDropdownIsOpen(!paymentDropdownIsOpen);

  // const handleOptionChange = (event) => {
  //   const selectedValue = event.target.value;
  //   setSelectedOption(selectedValue);
  // };
  const handleShippingAddressOptionChange = (event) => {
    const selectedShippingAddressValue = event.target.value;
    setSelectedShippingAddressOption(selectedShippingAddressValue);
  };
  // const handleShippingOptionChange = (event) => {
  //   const selectedShippingValue = event.target.value;
  //   setSelectedShippingOption(selectedShippingValue);
  // };
  // const handleBillingOptionChange = (event) => {
  //   const selectedBillingValue = event.target.value;
  //   setSelectedBillingOption(selectedBillingValue);
  // };

  const onSelectChange = (date) => {
    setDate(date);
  };
  const onTextareaChange = (date) => {
    set(setPaymenttText);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("getPaymentPage", true);
        console.log(response);
        setData(response);
        setSelectedShippingAddressOption(response.UserAddress[0].Id);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

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
                      <TextArea
                        onChange={onTextareaChange}
                        name="cash-input"
                        className="cash-input py-2"
                        rows="6"
                      />
                    </div>
                  </div>
                </CardFrame>
                <CardFrame>
                  <div className="flex gap-4">
                    <p className="select-label">Delivery date:</p>
                    <Select
                      onChange={onSelectChange}
                      allowClear
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
                    <h3 className="py-2">Order Summary</h3>
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
                  disabled={!selectedShippingAddressOption}
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
