"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import {
  UilHeart,
  UilSearch,
  UilShoppingBag,
  UilComparison,
} from "@iconscout/react-unicons";

import UserImg from "../../../public/images/user.png";
import Cartdropdown from "../layout/Cartdropdown";
import { icons, navLinks } from "./constants";
import "./header.scss";

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
  console.log(data.output);
  return data.output;
}

function Header() {
  let path = "";
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

  useEffect(() => {
    async function fetchDataAsync() {
      const data = await getHeader();
      setData(data);
      setSettings(data.header.settings[0]);
    }
    fetchDataAsync();
  }, []);

  const totalQuantity = data?.header?.totalQuantity;
  const islogin = data?.isLogin;

  const showSeachBox = () => setIsSearchBoxOpen(true);

  let logout = async (event) => {
    const response = await fetch(
      "https://api.wscshop.co.uk/api/account/logout",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.status == 200 && typeof localStorage !== "undefined") {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("refreshToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  let searchClick = async (event) => {
    const searchWord = event.currentTarget.previousSibling.value;
    if (typeof window !== "undefined") {
      window.location.href = "/search?search=" + searchWord;
    }
  };
  let searchEnter = async (event) => {
    if (event.key === "Enter") {
      const searchWord = event.currentTarget.value;
      if (typeof window !== "undefined") {
        window.location.href = "/search?search=" + searchWord;
      }
    }
  };

  const handleInputChange = (event) => {
    setSearchKey(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      console.log("Enter key pressed. Input value:", searchKey);
      window.location.href = "/search?search=" + searchKey;
      setSearchKey("");
      setIsSearchBoxOpen(false);
    }
  };
  return (
    <div>
      <header className="header">
        <div className="header--desktop">
          <div className="frd-container mx-auto">
            <div className="header-section-1 hidden lg:block">
              <div className="frd-container mx-auto">
                <div className="flex justify-between py-2 items-center">
                  <div className="header-sec1-left">
                    <ul className="flex">
                      <li>{settings.phone}</li>
                      <li>{settings.email}</li>
                    </ul>
                  </div>
                  <div className="header-sec1-right">
                    {!!islogin ? (
                      <ul className="flex">
                        <li className="header-user-list flex items-center gap-1 relative cursor-pointer">
                          My Account
                          <Image
                            src={UserImg}
                            width={30}
                            height={30}
                            className="header-user-img rounded-full ml-2"
                            alt="User Img"
                          />
                          <ul className="header-user-dropdown absolute top-full right-0 bg-white py-5 px-4">
                            <Link href="/account/profile">Profile</Link>
                            <Link href="/account/history">My Orders</Link>
                            <Link href="#" onClick={logout}>
                              Log Out
                            </Link>
                          </ul>
                        </li>
                      </ul>
                    ) : (
                      <ul className="flex">
                        <li>
                          <Link href="/login">Login/Sign Up</Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="header-section-2">
              <div className="frd-container mx-auto">
                <div className="flex justify-between items-center py-2">
                  <div className="logo">
                    <Link className="nav-link" href={"/"}>
                      <img
                        src={settings.logo}
                        width={180}
                        className="header-logo"
                      ></img>
                    </Link>
                  </div>
                  <div className="nav hidden lg:block">
                    <ul className="header-nav-ul flex items-center mb-0 pl-0">
                      {navLinks.map(
                        (link) =>
                          (link.isDefault || !!settings[link.name]) && (
                            <li className="nav-item" key={link.id}>
                              <Link className="nav-link" href={link.path}>
                                {link.text}
                              </Link>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                  <div className="extra flex gap-5 md:gap-6">
                    <div className="relative header-search-btn">
                      <UilSearch size="28" color="#333333" />
                      <div
                        className="search-input-wrap absolute top-full -right-3 z-10 flex items-center justify-center rounded overflow-hidden w-64 p-1 invisible"
                        style={{ top: "35px" }}
                      >
                        <input
                          type="text"
                          className="h-10 py-1 px-3 outline-none"
                          placeholder="Search..."
                          onKeyDown={searchEnter}
                        />
                        <button
                          type="button"
                          className="w-7"
                          onClick={searchClick}
                        >
                          <UilSearch size="20" color="#222" />
                        </button>
                      </div>
                    </div>
                    <Link href={"/wishlist"}>
                      <UilHeart size="28" color="#333333" />{" "}
                    </Link>
                    {totalQuantity > 0 ? (
                      <div className="relative">
                        <UilShoppingBag size="28" color="#333333" />
                        <div
                          className="absolute cart-item-count inline-flex items-center justify-center rounded-full text-white text-xs font-semibold"
                          id="cart_quantity"
                        >
                          {totalQuantity}
                        </div>
                        <Cartdropdown />
                      </div>
                    ) : (
                      <div className="relative">
                        <UilShoppingBag size="28" color="#333333" />
                        <div
                          style={{ display: "none" }}
                          className="absolute cart-item-count inline-flex items-center justify-center rounded-full text-white text-xs font-semibold"
                          id="cart_quantity"
                        >
                          {totalQuantity}
                        </div>
                        <Cartdropdown />
                      </div>
                    )}
                    <Link href={"/compare"}>
                      <UilComparison size="24" color="#333333" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header--mobile">
          <div className="flex justify-between items-center py-2 px-5">
            <figure className="logo">
              <Image src={icons.logo} width={46} alt="wsc logo" />
            </figure>
            <div className="flex gap-2.5">
              <Image
                src={icons.search}
                width={25}
                height={25}
                alt="search"
                style={{ display: isSearchBoxOpen ? "none" : "inline" }}
                onClick={showSeachBox}
              />
              <Image src={icons.chat} width={25} height={25} alt="help chat" />
              <Image
                src={icons.bell}
                width={25}
                height={25}
                alt="notification"
              />
            </div>
          </div>
          {isSearchBoxOpen && (
            <div className="px-2.5">
              <div className="seach-box flex px-4">
                <Image
                  src={icons.searchInput}
                  width={15}
                  height={15}
                  alt="search"
                />
                <input
                  type="text"
                  placeholder="Search for product"
                  value={searchKey}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                />
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
