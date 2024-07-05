"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { icons } from "./constants";
import "./header.scss";
import { usePathname, useSearchParams } from "next/navigation";
import { useTotalQuantity } from "@/context/total-quantity-context";
import NotificationBox from "@/components/notifigation-box";

let token = "";
let session_id = "";
if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("jwtToken");
  session_id = localStorage.getItem("sessionId");

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  if (session_id == null || session_id == "") {
    let value = uuidv4();
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("sessionId", value);
    }
  }
}

async function getHeader() {
  const params = new URLSearchParams();
  params.append("SessionId", session_id);
  const response = await fetch(
    `https://api.wscshop.co.uk/api/layout/get-header?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await response.json();
  return data.output;
}

function Header() {
  let path = "";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const { totalQuantity, setTotalQuantity } = useTotalQuantity();

  const isHomePage = pathname === "/";
  if (typeof window !== "undefined") {
    path = window.location.pathname;
  }
  const isSearchPage = pathname === "/search";
  if (typeof window !== "undefined") {
    path = window.location.pathname;
  }

  if (path.includes("login") == false && typeof localStorage !== "undefined") {
    localStorage.setItem("pagePath", path);
  }

  const [data, setData] = useState({});
  const [settings, setSettings] = useState({});
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const showSeachBox = () => setIsSearchBoxOpen(true);
  const hideSeachBox = () => setIsSearchBoxOpen(false);

  useEffect(() => {
    async function fetchDataAsync() {
      const data = await getHeader();
      setData(data);
      setSettings(data.header.settings[0]);
      setTotalQuantity(data.header.totalQuantity);
    }
    fetchDataAsync();
  }, []);

  // const totalQuantity = data?.header?.totalQuantity;
  const islogin = data?.isLogin;

  useEffect(() => {
    setIsSearchBoxOpen(isSearchPage);
    setSearchKey(search);
  }, [isSearchPage]);

  const handleInputChange = (event) => {
    setSearchKey(event.target.value);
  };
  const handleSearchClick = () => {
    window.location.href = "/search?search=" + searchKey;
    setSearchKey("");
    setIsSearchBoxOpen(false);
  };
  const handleInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSearchClick();
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header--mobile">
          <div className="flex justify-between items-center py-2 px-5">
            <div className="flex gap-3 items-center ">
              {!isHomePage && (
                <button onClick={() => window.history.back()}>
                  <Image
                    src={icons.chevron}
                    width={8}
                    height={18}
                    alt="chevron"
                    className="chevron"
                  />
                </button>
              )}

              <figure className="logo">
                <Image src={icons.logo} width={46} alt="wsc logo" />
              </figure>
            </div>
            <div className="flex gap-2.5">
              <Image
                src={icons.search}
                width={25}
                height={25}
                alt="search"
                style={{
                  display: isSearchBoxOpen ? "none" : "inline",
                  cursor: "pointer",
                }}
                onClick={showSeachBox}
              />
              {/* <Image
                src={icons.chat}
                width={25}
                height={25}
                alt="help chat"
                style={{ cursor: "pointer" }}
              /> */}
              <NotificationBox />
            </div>
          </div>
          {isSearchBoxOpen && (
            <div className="px-2.5">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search for product"
                  value={searchKey}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                />
                <button className="btn-close" onClick={hideSeachBox}>
                  x
                </button>
                <button className="btn-search" onClick={handleSearchClick}>
                  <Image
                    src={icons.search}
                    width={15}
                    height={15}
                    alt="search"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
