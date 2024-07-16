"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import FavoriteCard from "@/components/cards/favorite-card";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import SearchBar from "@/components/search-bar";

const mainFunc = async () => {
  let status;
  let fav_data = [];

  const fetchData = async () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    let response = await fetch(
      `https://api.wscshop.co.uk/api/favorites/get-index`,
      {
        method: "GET",
        dataType: "json",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
      }
    );
    const resp = await response.json();
    status = resp.status;
    console.log(status);
    fav_data = resp.output;
    //return resp.output;
  };

  await fetchData();

  if (status === 401) {
    try {
      let token = "";
      let refreshToken = "";
      if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("jwtToken");
        refreshToken = localStorage.getItem("refreshToken");
      }
      console.log(token);
      console.log(refreshToken);
      let response = await fetch(
        `https://api.wscshop.co.uk/api/account/refresh-token?userRefreshToken=${refreshToken}`,
        {
          method: "POST",
          dataType: "json",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response);
      const resp = await response.json();

      if (resp.status !== 400) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("refreshToken", resp.output.refreshToken);
          localStorage.setItem("jwtToken", resp.output.token);
        }

        await fetchData();
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        //go to login page
        //alert(1)
      }
    } catch {
      console.log("error");
    }
  } else {
    return fav_data;
  }
};
let removeFavorite = async (event) => {
  let prodid = event.currentTarget.getAttribute("id");
  let status;
  let token = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
  }
  let remote_button = event.currentTarget;
  //e.preventDefault();
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
          Id: prodid,
        }),
      }
    );
    const resJson = await res.json();
    //if (res.status === 200) {

    status = resJson.status;

    if (status === 401) {
      try {
        let token = "";
        let refreshToken = "";
        if (typeof localStorage !== "undefined") {
          token = localStorage.getItem("jwtToken");
          refreshToken = localStorage.getItem("refreshToken");
        }
        let response = await fetch(
          `https://api.wscshop.co.uk/api/account/refresh-token?userRefreshToken=${refreshToken}`,
          {
            method: "POST",
            dataType: "json",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + token,
            },
          }
        );
        const resp = await response.json();
        if (resp.status !== 400) {
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("refreshToken", resp.output.refreshToken);
            localStorage.setItem("jwtToken", resp.output.token);
          }

          await removeFavorite();
        } else {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          //go to login page
          //alert(1)
        }
      } catch {
        console.log("error");
      }
    } else {
      remote_button.parentElement.remove();
      if (resJson.output.favorites.length == 0) {
        console.log("empty");
        document.getElementById("favorites_div").innerHTML =
          "<p>There is no favorite product!</p>";
      }
      //setMessage("Added");
    }
    //}
    //else
    //{
    // console.log("Some error occured");
    //}
  } catch (err) {
    console.log(err);
  }
};

export default function Wishlist() {
  //mainFunc();
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [activePage, setActivePage] = useState(1);
 // const [totalPages, setTotalPages] = useState(null);
 // const [currentFavorites, setCurrentFavorites] = useState([]);
  

  const itemsPerPage = 10;

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
    const filteredCarts = favorites?.filter((item) =>
      item.name.toLowerCase().includes(searchKey.trim())
    );
    setFilteredCarts(filteredCarts);
  }, [searchKey]);

  useEffect(() => {
    async function fetchDataAsync() {
      const data = await mainFunc();
      setFavorites(data.favorites);
      setIsLoading(false);
    }
    fetchDataAsync();
  }, []);


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
}
