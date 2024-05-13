"use client";

import Link from "next/link";
import Image from "next/image";
import actions from "@/assets/icons/actions.svg";

const FavoriteCard = ({ product }) => {

  return (
    <li key={product.id}>
      <div className="favorite-card">
        <Link href={`/product/${product.id}`}>
          <figure className="product-image">
            <img src={product.mainImage} alt={product.name} />
          </figure>
        </Link>
        <div className="card-info">
          <div className="flex justify-between gap-2">
            <h5 className="product-name">{product.name}</h5>
            <button>
              <Image src={actions} alt="card actions" />
            </button>
          </div>
          <div className="card-action">
            <span className="color-green">{`₤ ${product.price}`}</span>
            <button className="success-outlined">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default FavoriteCard;
