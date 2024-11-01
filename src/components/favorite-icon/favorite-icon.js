"use client";

import "./favorite-icon.scss";
import { fetchData } from "@/utils/fetch-api";
import Icon from "@/components/icon";
import { useState, useEffect } from "react";

const FavoriteIcon = ({ productId, isFavorite, isAbsolute, size = "16px" }) => {
  const [isActive, setIsActive] = useState(false);

  const addToFavorites = async () => {
    try {
      const result = await fetchData("postFavorites", true, {
        ProductId: productId,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeFromFavorites = async () => {
    try {
      const result = await fetchData("removeFavorites", true, {
        ProductId: productId,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    isActive ? removeFromFavorites() : addToFavorites();
    setIsActive(!isActive);
  };

  useEffect(() => {
    setIsActive(isFavorite);
  }, [isFavorite]);

  return (
    <button
      className={isAbsolute ? "btn-favorite absolute" : "btn-favorite"}
      onClick={handleFavoriteClick}
    >
      <Icon
        name={isActive ? "favorite-filled" : "favorite"}
        size={size}
        color={isActive ? "var(--primary-theme-color)" : "#555555"}
      />
    </button>
  );
};

export default FavoriteIcon;
