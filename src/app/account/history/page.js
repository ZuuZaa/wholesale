"use client";

import React, { useEffect, useState } from "react";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import "./orders.scss";
import { StatusTabs } from "@/components/tabs/status-tabs/status-tabs";
import { OrderList } from "@/components/lists/order-list";

const fetchData = async () => {
  let status;
  let fav_data = [];

  const fetchData = async () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    let response = await fetch(
      `https://api.wscshop.co.uk/api/profile/get-myorders`,
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

export default function History() {
  const [data, setData] = useState({
    user: [],
    userAddress: [],
    userOrders: [],
  });

  const [activeStatus, setActiveStatus] = useState(0);
  const [filteredByStatusOrders, setFilteredByStatusOrders] = useState([]);
  const tabClickHandle = (status) => {
    setActiveStatus(status);
  };

  useEffect(() => {
    async function fetchDataAsync() {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        const filteredOrders = fetchedData?.userOrders?.filter(
          (item) => item.status == activeStatus
        );
        setFilteredByStatusOrders(filteredOrders);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDataAsync();
  }, []);

  const userOrders = data.userOrders;

  useEffect(() => {
    const filteredOrders = userOrders?.filter(
      (item) => item.status == activeStatus
    );
    setFilteredByStatusOrders(filteredOrders);
  }, [activeStatus]);

  return (
    <main>
      <div className="orders-page">
        <MobilePageLayout title="orders">
          <StatusTabs
            tabClickHandle={tabClickHandle}
            activeStatus={activeStatus}
          />
          <div className="py-3">
            <OrderList orders={filteredByStatusOrders} />
          </div>
        </MobilePageLayout>
      </div>
    </main>
  );
}
