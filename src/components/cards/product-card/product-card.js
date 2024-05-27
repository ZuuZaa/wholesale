import Link from "next/link";
import { StyledProductCard } from "./product-card.styled";
import FavoriteImageContainer from "@/components/favorite-icon/favorite-image-container";

const ProductCard = ({ product, cardHeight }) => {
  let token = "";
  let session_id = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
  }

  const addToCart = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/cart/add-to-cart",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ProductId: product.productId,
            Quantity: 1,
            SessionId: session_id,
          }),
        }
      );
      const resJson = await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Link
      href={`/product/${product.productId}`}
      key={product.id}
      passHref={true}
    >
      <StyledProductCard height={cardHeight}>
        <FavoriteImageContainer
          productId={product.productId}
          isFavorite={!!product.favorite}
          absolutePosition={true}
        >
          <figure className="product-image">
            <img
              src={product.mainImage}
              onError={(e) => e.target.src = product.catImage}
              alt={product.name}
              className="product-card-image"
            />
          </figure>
        </FavoriteImageContainer>
        <div className="product-info">
          <p>{product.name}</p>
          <div className="flex justify-between items-center gap-3">
            <span>{`₤${product.price}`}</span>
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
