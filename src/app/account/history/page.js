"use client";

import { useEffect, useState } from "react";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import { OrderList } from "@/components/lists/order-list";
import { StatusTabs } from "@/components/tabs";
import { fetchData } from "@/utils/fetch-api";
import Loading from "@/components/loading";
import { ORDER_STATUS } from "@/constans";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [filteredByStatusOrders, setFilteredByStatusOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabClickHandle = (status) => {
    setActiveStatus(status);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("getOrders", true);
        setOrders(response.UserOrders);
        setActiveStatus(ORDER_STATUS[0].status);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDataAsync();
  }, []);

  useEffect(() => {
    const filteredOrders = orders?.filter(
      (item) => item.Status == activeStatus
    );
    setFilteredByStatusOrders(filteredOrders);
    setIsLoading(false);
  }, [activeStatus]);

  return (
    <main>
      <div className="orders-page">
        <MobilePageLayout title="orders">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <StatusTabs
                tabClickHandle={tabClickHandle}
                activeStatus={activeStatus}
              />
              <div className="py-3">
                <OrderList list={filteredByStatusOrders} />
              </div>
            </>
          )}
        </MobilePageLayout>
      </div>
    </main>
  );
};

export default History;
