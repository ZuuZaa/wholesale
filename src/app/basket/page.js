"use client";

import Link from "next/link";
import "./basket.scss";
import Image from "next/image";
import trashbin from "@/assets/icons/trash-bin.svg";
import { useEffect, useState } from "react";

const basketList = [
  {
    id: 14,
    name: "Black Meal Boxes 3 Compartment",
    mainImage: "https://media.logixcommerce.com/images/wsc/products/000014.jpg",
    price: 36,
    count: 1,
  },
  {
    id: 15,
    name: "Clear Lids Meal Boxes 3 Compartments",
    mainImage: "https://media.logixcommerce.com/images/wsc/products/000015.jpg",
    price: 24,
    count: 1,
  },
];

const Busket = () => {
  let [totalPrice, setTotalPrice] = useState(0);

  const updateTotalPrice = (price, action) => {
    setTotalPrice((prev) => (action === "add" ? prev + price : prev - price));
  };

  return (
    <main>
      <div className="basket--mobile">
        <section className="px-3">
          <h2 className="page-header">My Basket</h2>
          <ul className="basket-list">
            {basketList.map((item) => (
              <BasketCard product={item} updatePrice={updateTotalPrice} />
            ))}
          </ul>
          <div className="price-details">
            <h4 className="price-details__title">Price details</h4>
            <div className="flex justify-between">
              <span>Cart total</span>
              <span>{`₤ ${totalPrice}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Total payable</span>
              <span>{`₤ ${totalPrice}`}</span>
            </div>
          </div>
        </section>
        <section>
          <div className="basket-footer px-4 py-3">
            <div className="price">
              <p>Total</p>
              <span className="color-green">{`₤ ${totalPrice}`}</span>
            </div>
            <button className="btn-success">
              continue
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Busket;

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
  } ;

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
            <span className="color-green">{`₤ ${count * product.price}`}</span>
          </div>
        </div>
      </div>
    </li>
  );
};
