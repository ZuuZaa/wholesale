"use client";

import Link from "next/link";
import Image from "next/image";
import trashbin from "@/assets/icons/trash-bin.svg";
import { useEffect, useState } from "react";

const BasketCard = ({ product, updatePrice }) => {
  let [count, setCount] = useState(product.count);

  const add = () => {
    if (count < 10) {
      setCount(++count);
      updatePrice(product.price, "add");
    }
  };

  const remove = () => {
    if (count > 1) {
      setCount(--count);
      updatePrice(product.price, "remove");
    }
  };

  useEffect(() => {
    updatePrice(product.price, "add");
  }, []);

  return (
    <li key={product.id}>
      <div className="basket-card">
        <Link href={`/product/${product.id}`}>
          <figure className="product-image">
            <img src={product.mainImage} alt={product.name} />
          </figure>
        </Link>
        <div className="card-info">
          <div className="flex justify-between gap-2">
            <h5 className="product-name">{product.name}</h5>
            <button>
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
            <span>{`₤ ${count * product.price}`}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BasketCard;
