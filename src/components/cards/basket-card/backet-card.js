"use client";

import Link from "next/link";
import Image from "next/image";
import trashbin from "@/assets/icons/trash-bin.svg";
import { useState } from "react";
import "./basket.scss";
import { useTotalQuantity } from "@/context/total-quantity-context";

const BasketCard = ({ product, updateCarts, updateTotalPrise }) => {
  let [count, setCount] = useState(product.Quantity);
  let [price, setPrise] = useState(product.Total.toFixed(2));
  const { setTotalQuantity } = useTotalQuantity();

  let token = "";
  let session_id = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
  }

  let removeFromCart = async () => {
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/cart/remove-from-cart",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            CartId: product.id,
            SessionId: session_id,
          }),
        }
      );

      if (res.status === 200) {
        const data = await res.json();
        updateCarts(data.output.cart);
        updateTotalPrise(data.output.subtotal.toFixed(2));
        setTotalQuantity(data.output.totalQuantity);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let updateCart = async (quantity) => {
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/cart/update-cart",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ProductId: product.productId,
            Quantity: quantity,
            SessionId: session_id,
          }),
        }
      );

      if (res.status === 200) {
        const data = await res.json();
        const updatedProduct = data.output.cart.find(
          (item) => item.productId === product.productId
        );
        setCount(updatedProduct.quantity);
        setPrise(updatedProduct.total.toFixed(2));
        updateTotalPrise(data.output.subtotal.toFixed(2));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const add = () => {
    updateCart(++count);
  };

  const remove = () => {
    if (count > 1) {
      updateCart(--count);
    }
  };


  console.log(product)
  return (
    <li key={product.Id}>
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
              <Image src={trashbin} alt="delete product" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="card-actions">
              <button className="btn-remove" onClick={remove}>
                -
              </button>
              <span className="count color-green">{count}</span>
              <button className="btn-add" onClick={add}>
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
