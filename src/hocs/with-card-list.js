import CardFrame from "@/components/cards/card-frame";

export const withCardList = (CardComponent) => {
  return ({ list }) => {
    return (
      <CardFrame>
        {list?.length > 0 ? (
          <ul className="card-list">
            {list?.map((item, index) => (
              <li key={index}>
                <CardComponent data={item} />
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
