import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import favorite from "@/assets/icons/favorite.svg";
import { StyledProductCard } from "./product-card.styled";

const ProductCard = ({ product, cardHeight }) => {
  const favoriteRef = useRef(null);
  let token = "";
  let session_id = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
  }

  const addToFavorites = async () => {
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/favorites/add-favorite",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            Id: product.productId,
          }),
        }
      );
      const resJson = await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromFavorites = async () => {
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/favorites/remove-favorite",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            Id: product.productId,
          }),
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    favoriteRef.current.classList.toggle("favorite");
    !!product.favorite ? removeFromFavorites() : addToFavorites();
  };

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
        <figure className="product-image">
          <img
            src={product.mainImage}
            alt={product.name}
            className="product-card-image"
          />
          <button
            className="btn-favorite"
            id={product.id}
            onClick={handleFavoriteClick}
          >
            <Image
              src={favorite}
              ref={favoriteRef}
              className={
                !!product.favorite ? "favorite-icon favorite" : "favorite-icon"
              }
              alt="favorite"
            />
          </button>
        </figure>
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
