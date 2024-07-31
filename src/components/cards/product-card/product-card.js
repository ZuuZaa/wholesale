import Link from "next/link";
import { StyledProductCard } from "./product-card.styled";
import FavoriteImageContainer from "@/components/favorite-icon/favorite-image-container";
import { useTotalQuantity } from "@/context/total-quantity-context";

const ProductCard = ({ product, cardHeight }) => {
  const { setTotalQuantity } = useTotalQuantity();
  let token = "";
  let session_id = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
  }
  const addToCart = async (event) => {
    event.preventDefault();

    if (token === null) {
      window.location.href = "/login";
    }

    try {
      const res = await fetch(
        `https://api.wscshop.co.uk/api/cart/add-to-cart`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ProductId: product.ProductId,
            Quantity: 1,
            SessionId: session_id,
          }),
        }
      );
      if (res.status === 200) {
        const data = await res.json();
        setTotalQuantity(data.output.totalQuantity);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(product)

  return (
    <Link
      href={`/product/${product.Id}`}
      key={product.Id}
      passHref={true}
    >
      <StyledProductCard height={cardHeight}>
        <FavoriteImageContainer
          productId={product.ProductId}
          isFavorite={!!product.Favorite}
          absolutePosition={true}
        >
          <figure className="product-image">
            <img
              src={product.MainImage}
              onError={(e) =>
                product.CatImage && (e.target.src = product.CatImage)
              }
              alt={product.Name}
              className="product-card-image"
            />
          </figure>
        </FavoriteImageContainer>
        <div className="product-info">
          <p>{product.Name}</p>
          <div className="flex justify-between items-center gap-3 mt-1">
            <span>{`₤${product.Price}`}</span>
            <div className="card-action">
              <button className="btn-success" onClick={addToCart}>
                Add
              </button>
            </div>
          </div>
        </div>
      </StyledProductCard>
    </Link>
  );
};

export default ProductCard;
