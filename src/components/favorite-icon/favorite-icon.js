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
      const res = await fetch(
        "https://api.wscshop.co.uk/api/favorites/add-favorite",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            Id: productId,
          }),
        }
      );
      const resJson = await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromFavorites = async () => {
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
            Id: productId,
          }),
        }
      );
    } catch (err) {
      console.log(err);
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
