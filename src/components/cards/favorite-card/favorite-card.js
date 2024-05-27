"use client";

import Link from "next/link";
import Image from "next/image";
import trashbin from "@/assets/icons/trash-bin.svg";
import "./favorite-card.scss";

const FavoriteCard = ({ product, updateFavorites }) => {
  let token = "";
  let session_id = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
  }

  let addToCart = async (event) => {
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
            Quantity: product.quantity,
            SessionId: session_id,
          }),
        }
      );
      // const data = await res.json();
      // console.log(resJson.output);

      // if (res.status === 200) {
      // }
    } catch (err) {
      console.log(err);
    }
  };

  let removeFromFavorites = async (event) => {
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
      const resJson = await res.json();
      updateFavorites(resJson.output.favorites);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li key={product.id}>
      <div className="favorite-card">
        <Link href={`/product/${product.productId}`}>
          <figure className="product-image">
            <img
              src={product.mainImage}
              onError={(e) =>
                product.catImage && (e.target.src = product.catImage)
              }
              alt={product.name}
            />
          </figure>
        </Link>
        <div className="card-info">
          <div className="flex justify-between gap-2">
            <h5 className="product-name">{product.name}</h5>
            <button onClick={removeFromFavorites}>
              <Image src={trashbin} alt="card actions" />
            </button>
          </div>
          <div className="card-action">
            <span>{`₤ ${product.price}`}</span>
            <button className="success-outlined" onClick={addToCart}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default FavoriteCard;
