import { ORDER_STATUS } from "@/constans";
import Link from "next/link";
import './order-card.scss';

const dateFormat = (date) => {
  const initialDate = new Date(date);
  let day = initialDate.getDay();
  day = day < 10 ? `0${day}` : day;
  let month = initialDate.getMonth();
  month = month < 10 ? `0${month}` : month;
  const year = initialDate.getFullYear();
  return `${day}/${month}/${year}`;
};

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
        <p>{dateFormat(order?.soldDate)}</p>
      </div>
      <Link className="details-link color-green" href="#">
        Details &#8811;
      </Link>
    </div>
  );
};

export default OrderCard;
