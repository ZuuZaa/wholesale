"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./header.scss";
import { usePathname, useSearchParams } from "next/navigation";
import NotificationBox from "@/components/notifigation-box";
import { useSiteSettings } from "@/context/site-settings-context";
import Icon from "@/components/icon";

function Header() {
  let path = "";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const { settings } = useSiteSettings();
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");

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

    useEffect(() => {
      setIsSearchBoxOpen(false)
    }, [pathname]);

  return (
    <div>
      <header className="header">
        <div className="header--mobile">
          <div className="flex justify-between items-center py-2 px-5">
            <div className="flex gap-3">
              {!isHomePage && (
                <button onClick={() => window.history.back()}>
                  <Icon name="chevron" color="#828282" />
                </button>
              )}
              {settings?.logo && (
                <figure className="logo">
                  <Link href="/">
                    <img src={settings.logo} width={46} alt="logo" />
                  </Link>
                </figure>
              )}
            </div>
            <div className="flex gap-2.5">
              <Icon
                name="search"
                color="var(--primary-theme-color)"
                display={isSearchBoxOpen ? "none" : "flex"}
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
                  <Icon
                    name="search"
                    size="15px"
                    color="var(--primary-theme-color)"
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
