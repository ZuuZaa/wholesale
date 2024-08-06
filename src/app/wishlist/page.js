"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import FavoriteCard from "@/components/cards/favorite-card";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import SearchBar from "@/components/search-bar";

const Wishlist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  //const [activePage, setActivePage] = useState(1);
  // const [totalPages, setTotalPages] = useState(null);
  // const [currentFavorites, setCurrentFavorites] = useState([]);

  // const itemsPerPage = 10;

  // const setPages = (page) => {
  //   setActivePage(page);
  //   const pagedItems = favorites.slice(
  //     (activePage - 1) * itemsPerPage,
  //     activePage * itemsPerPage
  //   );
  //   setCurrentFavorites(pagedItems);
  // };

  const updateFavorites = (data) => setFavorites(data);

  const handleInputChange = (event) => {
    setSearchKey(event.target.value.toLowerCase());
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getFavorites", true);
        setFavorites(result.favorites);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  useEffect(() => {
    const filteredCarts = favorites?.filter((item) =>
      item.name.toLowerCase().includes(searchKey.trim())
    );
    setFilteredCarts(filteredCarts);
  }, [searchKey]);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="wishlist-page">
          <MobilePageLayout title="Wishlist">
            {favorites.length > 0 ? (
              <>
                <SearchBar
                  searchKey={searchKey}
                  handleInputChange={handleInputChange}
                />
                <ul className="flex flex-col gap-2 py-2">
                  {searchKey
                    ? filteredCarts.map((item) => (
                        <FavoriteCard
                          product={item}
                          updateFavorites={updateFavorites}
                        />
                      ))
                    : favorites.map((item) => (
                        <FavoriteCard
                          product={item}
                          updateFavorites={updateFavorites}
                        />
                      ))}
                </ul>
                {/* {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    activePage={activePage}
                    setPages={setPages}
                  />
                )} */}
              </>
            ) : (
              <p className="text-center py-5">There is no favorite product!</p>
            )}
          </MobilePageLayout>
        </div>
      )}
    </main>
  );
};

export default Wishlist;
