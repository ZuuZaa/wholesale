import CardFrame from "@/components/cards/card-frame";

export const withCardList = (CardComponent) => {
  return ({ orders }) => {
    return (
      <CardFrame>
        {orders.length > 0 ? (
          <ul className="card-list">
            {orders.map((order) => (
              <li key={order.id}>
                <CardComponent order={order} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">There is no item with this status.</p>
        )}
      </CardFrame>
    );
  };
};
