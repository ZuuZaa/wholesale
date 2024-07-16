"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Menu from "../../menu";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import CardFrame from "@/components/cards/card-frame";

import "./order-detail.scss";
import { dateNormalizer } from "@/helpers";
import { ORDER_STATUS, PAYMENT_TYPE, SHIPPING_TYPE } from "@/constans";
import Loading from "@/components/loading";
import BottomFixedCard from "@/components/cards/bottom-fixed-card";

export default function Account() {
  const pathname = useParams();
  const id = pathname.id;
  const params = new URLSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  params.append("Id", id);
  const mainFunc = async () => {
    let status;
    let fav_data = [];

    const fetchData = async () => {
      let token = "";
      if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("jwtToken");
      }
      let response = await fetch(
        `https://api.wscshop.co.uk/api/profile/get-order-details?${params.toString()}`,
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
      console.log(fav_data);
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

  const [data, setData] = useState({
    userOrders: [],
    orderDetails: [],
    orderProducts: [],
  });
  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await mainFunc();
      setData(fetchedData);
      setIsLoading(false);
    }
    fetchDataAsync();
  }, []);

  const userOrders = data.userOrders;
  const orderDetails = data.orderDetails;
  const details = orderDetails[0];
  console.log(details, orderDetails);
  const orderProducts = data.orderProducts;

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="order-detail-page">
          <MobilePageLayout
            title="Order details"
            enableTitleFixedPosition={true}
          >
            <div className="flex flex-col gap-3">
              <CardFrame>
                <div className="order-details-card flex flex-col gap-2 p-1">
                  <div className="flex justify-between">
                    <span>Order No</span>
                    <b>{`#${details?.id}`}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Date</span>
                    <b>{dateNormalizer(details?.soldDate)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Type</span>
                    <b>{PAYMENT_TYPE[details?.paymentType]?.name}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Type</span>
                    <b>{SHIPPING_TYPE[details?.shippingType]?.name}</b>
                  </div>
                </div>
              </CardFrame>
              <CardFrame>
                <ul className="order-products">
                  {orderProducts?.map((order) => (
                    <li key={order.id}>
                      <div className="flex gap-3 items-center py-2">
                        <figure>
                          <img
                            src={order.productImage}
                            onError={(e) =>
                              order.catImage && (e.target.src = order.catImage)
                            }
                            alt="order"
                          />
                        </figure>
                        <div className="grow flex flex-col justify-between">
                          <h3>{order.productName}</h3>
                          <p>
                            {`Status: ${ORDER_STATUS[order.status].name}`}{" "}
                            &#9432;
                          </p>
                          <div className="flex justify-between">
                            <p className="flex gap-2">
                              <span>{`Quantity: ${order.quantity}`}</span>
                              <span>{`Price: ₤${order.price}`}</span>
                            </p>
                            <b>{`₤${order.total}`}</b>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardFrame>
              <BottomFixedCard>
                <CardFrame>
                  <div className="flex flex-col gap-2 p-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <b>{`₤${details?.amount}`}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <b>{`₤${details?.deliveryFee}`}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <b>{`₤${details?.discount}`}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT</span>
                      <b>{`₤${details?.vat}`}</b>
                    </div>
                    <div className="flex justify-between">
                      <b>Total</b>
                      <b className="color-green">{`₤${details?.total}`}</b>
                    </div>
                  </div>
                </CardFrame>
              </BottomFixedCard>
            </div>
          </MobilePageLayout>
        </div>
      )}
    </main>
  );
}
