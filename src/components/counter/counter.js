'use client';

import { useState } from "react";
import './counter.scss';

const Counter = ({product}) => {
  let [count, setCount] = useState(product.quantity);
  console.log("product", product)

  let token = "";
  let session_id = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
  }

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
        console.log(data.output.cart);
        setCount(data.output.cart.quantity);
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


  return (
    <div className="card-actions">
      <button className="btn-remove" onClick={remove}>
        -
      </button>
      <span className="count color-green">{count}</span>
      <button className="btn-add" onClick={add}>
        +
      </button>
    </div>
  );
}

export default Counter;