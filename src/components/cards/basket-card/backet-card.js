"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTotalQuantity } from "@/context/total-quantity-context";
import { fetchData } from "@/utils/fetch-api";
import Icon from "@/components/icon";
import "./basket.scss";

const BasketCard = ({ product, updateCarts, updateTotalPrise }) => {
  let [count, setCount] = useState(null);
  let [price, setPrice] = useState(null);
  const { setTotalQuantity } = useTotalQuantity();

  const removeFromCart = async () => {
    try {
      const response = await fetchData("removeCart", true, {
        CartId: product.Id,
      });
      updateCarts(response?.Cart);
      setTotalQuantity(response.TotalQuantity);
      updateTotalPrise(response?.Subtotal.toFixed(2))
    } catch (error) {
      console.error(error.message);
    }
  };

  let updateCart = async (quantity) => {
    try {
      const response = await fetchData("postCart", true, {
        ProductId: product.ProductId,
        Quantity: quantity,
      });
      setCount(response?.Product?.[0]?.Quantity);
      setPrice(response?.Product?.[0]?.Total?.toFixed(2));
      updateTotalPrise(response?.Subtotal?.toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  const increaseProductQuantity = () => {
    updateCart(++count);
  };

  const decreaseProductQuantity = () => {
    if (count > 1) {
      updateCart(--count);
    }
  };

  useEffect(() => {
    setCount(product.Quantity);
    setPrice(product.Total.toFixed(2));
  }, [product]);

  return (
    <li>
      <div className="basket-card">
        <Link href={`/product/${product.ProductId}`}>
          <figure className="product-image">
            <img
              src={product.ProductImage}
              onError={(e) =>
                product.CatImage && (e.target.src = product.CatImage)
              }
              alt={product.ProductName}
            />
          </figure>
        </Link>
        <div className="card-info">
          <div className="flex justify-between gap-2">
            <h5 className="product-name">{product.ProductName}</h5>
            <button onClick={removeFromCart}>
              <Icon name="trash-bin" color="#C9C9C9" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="card-actions">
              <button className="btn-remove" onClick={decreaseProductQuantity}>
                -
              </button>
              <span className="count color-premium">{count}</span>
              <button className="btn-add" onClick={increaseProductQuantity}>
                +
              </button>
            </div>
            <span>{`₤${price}`}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BasketCard;
