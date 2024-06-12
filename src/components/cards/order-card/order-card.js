import { ORDER_STATUS } from "@/constans";
import Link from "next/link";
import './order-card.scss';
import { dateNormalizer } from "@/helpers";


const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <div className="order-card-title flex justify-between items-center mb-3">
        <h3 className="order-id">ID:{order?.id}</h3>
        <span className="order-status">
          {ORDER_STATUS[order?.status]?.name}
        </span>
      </div>
      <div className="felx column gap-2">
        <h4 className="order-total">Total: ₤{order?.total}</h4>
        <p>Credit: ₤{order?.credit}</p>
        <p>{order?.addressLine1}</p>
        <p>{dateNormalizer(order?.soldDate)}</p>
      </div>
      <Link className="details-link color-green" href={`history/${order.id}`}>
        Details &#8811;
      </Link>
    </div>
  );
};

export default OrderCard;
