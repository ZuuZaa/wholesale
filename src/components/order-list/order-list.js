import CardFrame from "@/components/cards/card-frame";
import OrderCard from "@/components//cards/order-card/order-card";
import "./order-list.scss";

const OrderList = ({ orders }) => {
  return (
    <CardFrame>
      {orders.length > 0 ? (
        <ul className="order-list">
          {orders?.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">There is no order with this status.</p>
      )}
    </CardFrame>
  );
};

export default OrderList;
