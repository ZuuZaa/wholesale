import Image from "next/image";
import FavoriteCard from "./favorite-card";
import "./favorites.scss";
import chevron from "@/assets/icons/chevron-down.svg";

const favoriteProducts = [
  {
    id: 14,
    name: "Black Meal Boxes 3 Compartment",
    mainImage: "https://media.logixcommerce.com/images/wsc/products/000014.jpg",
    price: 36,
  },
  {
    id: 15,
    name: "Clear Lids Meal Boxes 3 Compartments",
    mainImage: "https://media.logixcommerce.com/images/wsc/products/000015.jpg",
    price: 24,
  },
];

const Favorites = () => {
  return (
    <main>
      <div className="wishlist--mobile">
        <h2 className="page-header">Wishlist</h2>
        <div className="filter flex justify-end">
          <button className="flex gap-2 items-center">
            <span>Sort by</span>
            <Image src={chevron} alt="filter" />
          </button>
        </div>
        <ul className="flex flex-col gap-2 py-2">
          {favoriteProducts.map((item) => (
            <FavoriteCard product={item} />
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Favorites;
