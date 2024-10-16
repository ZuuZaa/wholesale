"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import FavoriteCard from "@/components/cards/favorite-card";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import SearchBar from "@/components/search-bar";
import { fetchData } from "@/utils/fetch-api";
import "./wishlist.scss";

const Wishlist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedList, setSelectedList] = useState("1");
  // const [activePage, setActivePage] = useState(1);
  // const [totalPages, setTotalPages] = useState(null);

  //const setPages = (page) => setActivePage(page);

  const updateFavorites = (data) => setFavorites(data);

  const handleInputChange = (event) => {
    setSearchKey(event.target.value.toLowerCase());
  };

  const selectListHandler = (e) => setSelectedList(e.target.value);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getFavorites", true, {
          Kind: selectedList,
        });
        console.log(result);
        setFavorites(result.Favorites);
        // setTotalPages(result.PageCount);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, [selectedList]);

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
          <MobilePageLayout>
            <div className="flex gap-2 mb-2">
              <button
                className={`select-list-btn w-full ${
                  selectedList === "1" ? "active" : ""
                }`}
                value="1"
                onClick={selectListHandler}
              >
                Agreements
              </button>
              <button
                className={`select-list-btn w-full ${
                  selectedList === "2" ? "active" : ""
                }`}
                value="2"
                onClick={selectListHandler}
              >
                Wishlist
              </button>
            </div>

            {favorites?.length > 0 ? (
              <>
                <SearchBar
                  searchKey={searchKey}
                  handleInputChange={handleInputChange}
                />
                <ul className="flex flex-col gap-2 py-2">
                  {searchKey
                    ? filteredCarts.map((item) => (
                        <FavoriteCard
                          key={item.Id}
                          product={item}
                          updateFavorites={updateFavorites}
                          enableDelete={selectedList === "2"}
                        />
                      ))
                    : favorites.map((item) => (
                        <FavoriteCard
                          key={item.Id}
                          product={item}
                          updateFavorites={updateFavorites}
                          enableDelete={selectedList === "2"}
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
