import Image from "next/image";
import { useRef } from "react";
import favorite from "@/assets/icons/favorite.svg";
import "./favorite-icon.scss";

const FavoriteIcon = ({ productId, isFavorite, isAbsolute }) => {
  const favoriteRef = useRef(null);
  let token = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
  }

  const addToFavorites = async () => {
    try {
      const result = await fetchData("postFavorites", true, {
        ProductId: productId,
      });
      console.log("result: ", result);
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeFromFavorites = async () => {
    try {
      const result = await fetchData("removeFavorites", true, {
        ProductId: productId,
      });
      console.log("result: ", result);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    favoriteRef.current.classList.toggle("favorite");
    isFavorite ? removeFromFavorites() : addToFavorites();
  };

  return (
    <button
      className={isAbsolute ? "btn-favorite absolute" : "btn-favorite"}
      onClick={handleFavoriteClick}
    >
      <Image
        src={favorite}
        ref={favoriteRef}
        className={isFavorite ? "favorite-icon favorite" : "favorite-icon"}
        alt="favorite"
      />
    </button>
  );
};

export default FavoriteIcon;
