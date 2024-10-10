import { ORDER_STATUS } from "@/constans";
import Link from "next/link";
import './order-card.scss';
import { dateNormalizer } from "@/helpers";


const OrderCard = ({ data }) => {
  return (
    <div className="order-card">
      <div className="order-card-title flex justify-between items-center mb-3">
        <h3 className="order-id">ID:{data?.Id}</h3>
        <span className="order-status">{ORDER_STATUS[data?.Status]?.name}</span>
      </div>
      <div className="felx column gap-2">
        <h4 className="order-total">Total: ₤{data?.Total}</h4>
        <p>Credit: ₤{data?.Credit}</p>
        <p>{data?.AddressLine1}</p>
        <p>{dateNormalizer(data?.SoldDate)}</p>
      </div>
      <Link className="details-link color-premium" href={`history/${data.Id}`}>
        Details &#8811;
      </Link>
    </div>
  );
};

export default OrderCard;
