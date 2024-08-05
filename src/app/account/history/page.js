"use client";

import { useEffect, useState } from "react";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import { OrderList } from "@/components/lists/order-list";
import { StatusTabs } from "@/components/tabs";
import { fetchData } from "@/utils/fetch-api";
import Loading from "@/components/loading";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState(0);
  const [filteredByStatusOrders, setFilteredByStatusOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabClickHandle = (status) => {
    setActiveStatus(status);
  };

  const filterOrdersByStatus = () => {
    const filteredOrders = orders?.filter(
      (item) => item.Status == activeStatus
    );
    setFilteredByStatusOrders(filteredOrders);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getProfile");
        console.log("result", result);
        setOrders(result.UserOrders);
        filterOrdersByStatus();
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  useEffect(() => {
    filterOrdersByStatus();
  }, [activeStatus]);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="orders-page">
          <MobilePageLayout title="orders">
            <StatusTabs
              tabClickHandle={tabClickHandle}
              activeStatus={activeStatus}
            />
            <div className="py-3">
              <OrderList list={filteredByStatusOrders} />
            </div>
          </MobilePageLayout>
        </div>
      )}
    </main>
  );
};

export default History;
