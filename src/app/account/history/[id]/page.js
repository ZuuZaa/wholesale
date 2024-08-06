"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import CardFrame from "@/components/cards/card-frame";

import "./order-detail.scss";
import { dateNormalizer } from "@/helpers";
import { ORDER_STATUS, PAYMENT_TYPE, SHIPPING_TYPE } from "@/constans";
import Loading from "@/components/loading";
import BottomFixedCard from "@/components/cards/bottom-fixed-card";
import { fetchData } from "@/utils/fetch-api";

const Account = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams()

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getOrderDetails", true, { OrderId: params?.id});
        setOrderDetails(result.OrderDetails[0]);
        setOrderedProducts(result.OrderProducts);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

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
                    <b>{`#${orderDetails?.Id}`}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Date</span>
                    <b>{dateNormalizer(orderDetails?.SoldDate)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Type</span>
                    <b>{PAYMENT_TYPE[orderDetails?.PaymentType]?.name}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Type</span>
                    <b>{SHIPPING_TYPE[orderDetails?.ShippingType]?.name}</b>
                  </div>
                </div>
              </CardFrame>
              <CardFrame>
                <ul className="order-products">
                  {orderedProducts?.map((order) => (
                    <li key={order.Id}>
                      <div className="flex gap-3 items-center py-2">
                        <figure>
                          <img
                            src={order.ProductImage}
                            onError={(e) =>
                              order.CatImage && (e.target.src = order.CatImage)
                            }
                            alt="order"
                          />
                        </figure>
                        <div className="grow flex flex-col justify-between">
                          <h3>{order.ProductName}</h3>
                          <p>
                            {`Status: ${ORDER_STATUS[order.Status].name}`}{" "}
                            &#9432;
                          </p>
                          <div className="flex justify-between">
                            <p className="flex gap-2">
                              <span>{`Quantity: ${order.Quantity}`}</span>
                              <span>{`Price: ₤${order.Price}`}</span>
                            </p>
                            <b>{`₤${order.Total}`}</b>
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
                      <b>{`₤${orderDetails?.Amount}`}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <b>{`₤${orderDetails?.DeliveryFee}`}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <b>{`₤${orderDetails?.Discount}`}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT</span>
                      <b>{`₤${orderDetails?.VAT}`}</b>
                    </div>
                    <div className="flex justify-between">
                      <b>Total</b>
                      <b className="color-green">{`₤${orderDetails?.Total}`}</b>
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
};

export default Account;
