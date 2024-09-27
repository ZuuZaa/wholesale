"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { icons } from "./constants";
import "./header.scss";
import { usePathname, useSearchParams } from "next/navigation";
import NotificationBox from "@/components/notifigation-box";

function Header() {
  let path = "";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

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

  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const showSeachBox = () => setIsSearchBoxOpen(true);
  const clearSeachInput = () => setSearchKey("");

  const handleInputChange = (event) => {
    setSearchKey(event.target.value);
  };
  const handleSearchClick = () => {
    if (searchKey?.trim()) {
      window.location.href = "/search?search=" + searchKey;
      setSearchKey("");
    }
    setIsSearchBoxOpen(false);
  };

  const handleInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSearchClick();
    }
  };

  useEffect(() => {
    setIsSearchBoxOpen(isSearchPage);
    setSearchKey(search);
  }, [isSearchPage]);

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
                <Link href="/">
                  <Image src={icons.logo} width={46} alt="wsc logo" />
                </Link>
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
                <button className="btn-close" onClick={clearSeachInput}>
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
