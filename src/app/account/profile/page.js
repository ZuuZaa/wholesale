"use client";
import { useEffect, useState } from "react";
import { infoLinks } from "./constans";
import Link from "next/link";
import CardFrame from "@/components/cards/card-frame";
import NotificationBox from "@/components/notifigation-box";
import TitleWithIcon from "@/components/typography/title-with-icon/title-with-icon";
import { fetchData } from "@/utils/fetch-api";
import Loading from "@/components/loading";
import "./profile.scss";
import Icon from "@/components/icon";


const Profile = () => {
  const [user, setUser] = useState({});
  const [addressList, setAddressList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addressDropdownIsOpen, setAddressDropdownIsOpen] = useState(false);

  const handleSavedAddressClick = () => {
    setAddressDropdownIsOpen(!addressDropdownIsOpen);
  };

  const logout = async () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    const response = await fetch(
      "https://ws.wscshop.co.uk/api/account/logout",
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

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getProfile", true);
        setUser(result.User[0]);
        setAddressList(result.UserAddress);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="profile-page">
          <CardFrame>
            <div className="profile-header">
              <div className="profile-info">
                <div className="profile-photo"></div>
                <div>
                  <p className="user-name">
                    {user?.FirstName || "NAME"} {user?.LastName || "SURNAME"}
                  </p>
                  <p className="user-email">{user?.Email}</p>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <NotificationBox iconSize={15} />
              </div>
            </div>
          </CardFrame>
          <CardFrame>
            <ul className="main-links flex flex-col gap-3 pb-4">
              <li>
                <Link href="/account/history">
                  <TitleWithIcon icon="package" title="My orders" />
                </Link>
              </li>
              <li>
                <Link href="/account/statement">
                  <TitleWithIcon icon="statement" title="Statement" />
                </Link>
              </li>
              <li>
                <div className="dropdown-container">
                  <figure className="flex items-center gap-4">
                    <Icon name="location" color="var(--primary-theme-color)" />
                    <figcaption>
                      <button onClick={handleSavedAddressClick}>
                        Saved address
                      </button>
                    </figcaption>
                  </figure>
                  <div
                    className={
                      addressDropdownIsOpen
                        ? "dropdown-content open"
                        : "dropdown-content"
                    }
                  >
                    {addressList.length > 0 ? (
                      <ul className="address-list">
                        {addressList.map((address) => (
                          <div
                            className="shipping-address-items border rounded-md px-5 py-3 my-2"
                            key={address.Id}
                          >
                            <h2>{address.Title}</h2>
                            <h6>{address.AdressLine1}</h6>
                            <h6>{address.AdressLine2}</h6>
                            <h6>
                              {address.City}, {address.Country}
                            </h6>
                            <h6>{address.Phone}</h6>
                            <h6>{address.Postcode}</h6>
                          </div>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-3 py-1 text-center">No address data.</p>
                    )}
                  </div>
                </div>
              </li>
            </ul>
            <button onClick={logout} className="sign-out-link pt-4 pl-9">
              Sign out
            </button>
          </CardFrame>
          <CardFrame>
            <ul className="flex flex-col gap-3 pl-9">
              {infoLinks.map((link) => (
                <li key={link.path}>
                  <Link href={`/${link.path}`}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </CardFrame>
          {/* <div className="questions">
          <ul>
            <li className="flex items-center gap-4 p-3">
              <Image
                src={icons.question}
                width={22}
                height={22}
                alt="question"
              />
              <span>Frequently Asked Questions</span>
            </li
            <li className="pl-12 py-3">My order status</li>
            <li className="pl-12 py-3">How to return items</li>
            <li className="pl-12 py-3">Delivery</li>
            <li className="pl-12 py-3">Payment methods</li>
          </ul>
        </div>
        <div className="sosial-links flex gap-4">
          <Image src={icons.instagram} width={22} height={22} alt="question" />
          <Image src={icons.whatsap} width={22} height={22} alt="question" />
        </div> */}
        </div>
      )}
    </main>
  );
}

export default Profile;
