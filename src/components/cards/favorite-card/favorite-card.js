"use client";

import Link from "next/link";
import Image from "next/image";
import trashbin from "@/assets/icons/trash-bin.svg";
import "./favorite-card.scss";
import { useTotalQuantity } from "@/context/total-quantity-context";
import { fetchData } from "@/utils/fetch-api";

const FavoriteCard = ({ product, updateFavorites, enableDelete = true }) => {
  
  const { setTotalQuantity } = useTotalQuantity();

  const addToCart = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData("postCart", true, {
        ProductId: product.ProductId,
        Quantity: 1,
      });
      console.log("response", response);
      setTotalQuantity(response.TotalQuantity);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromFavorites = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData("removeFavorites", true, {
        ProductId: product.ProductId,
      });
      updateFavorites(response.Favorites);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li key={product.ProductId}>
      <div className="favorite-card">
        <Link href={`/product/${product.ProductId}`}>
          <figure className="product-image">
            <img
              src={product.MainImage}
              onError={(e) =>
                product.CatImage && (e.target.src = product.CatImage)
              }
              alt={product.Name}
            />
          </figure>
        </Link>
        <div className="card-info">
          <div className="flex justify-between gap-2">
            <h5 className="product-name">{product.Name}</h5>
            {enableDelete && (
              <button onClick={removeFromFavorites}>
                <Image src={trashbin} alt="card actions" />
              </button>
            )}
          </div>
          <div className="card-action">
            <span>{`₤${product.Price}`}</span>
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
