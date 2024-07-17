import Link from "next/link";
import "./statement-card.scss";
import { dateNormalizer } from "@/helpers";

const StatementCard = ({ data }) => {
  return (
    <div className="statement-card">
      <div className="statement-card-title flex justify-between items-center mb-3">
        <h3 className="statement-title">{data?.title}</h3>
        <p
          className={`statement-total ${
            data?.total < 0 ? "color-red" : "color-green"
          }`}
        >
          {data?.total < 0 ? `-₤${Math.abs(data.total)}` : `₤${data?.total}`}
        </p>
      </div>
      <div>
        <p>{dateNormalizer(data?.date)}</p>
      </div>
      <Link className="details-link color-green" href="#">
        Details &#8811;
      </Link>
    </div>
  );
};

export default StatementCard;
