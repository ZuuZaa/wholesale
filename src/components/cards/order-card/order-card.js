import { ORDER_STATUS } from "@/constans";
import Link from "next/link";
import './order-card.scss';
import { dateNormalizer } from "@/helpers";


const OrderCard = ({ data }) => {
  return (
    <div className="order-card">
      <div className="order-card-title flex justify-between items-center mb-3">
        <h3 className="order-id">ID:{data?.id}</h3>
        <span className="order-status">
          {ORDER_STATUS[data?.status]?.name}
        </span>
      </div>
      <div className="felx column gap-2">
        <h4 className="order-total">Total: ₤{data?.total}</h4>
        <p>Credit: ₤{data?.credit}</p>
        <p>{data?.addressLine1}</p>
        <p>{dateNormalizer(data?.soldDate)}</p>
      </div>
      <Link className="details-link color-green" href={`history/${data.id}`}>
        Details &#8811;
      </Link>
    </div>
  );
};

export default OrderCard;
