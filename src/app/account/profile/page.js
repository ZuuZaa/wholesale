"use client";

import { useEffect, useState } from "react";

import "./profile.scss";
import { icons, infoLinks } from "./constans";
import Link from "next/link";
import Image from "next/image";
import CardFrame from "@/components/cards/card-frame";
import NotificationBox from "@/components/notifigation-box";
import TitleWithIcon from "@/components/typography/title-with-icon/title-with-icon";

export default function Profile() {
  const fetchData = async () => {
    let status;
    let fav_data = [];

    const fetchData = async () => {
      let token = "";
      if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("jwtToken");
      }
      let response = await fetch(
        `https://api.wscshop.co.uk/api/profile/get-index`,
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

  const [data, setData] = useState({
    user: [],
    userAddress: [],
    userOrders: [],
  });

  const [addressDropdownIsOpen, setAddressDropdownIsOpen] = useState(false);

  const handleSavedAddressClick = () => {
    setAddressDropdownIsOpen(!addressDropdownIsOpen);
  };
  useEffect(() => {
    async function fetchDataAsync() {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        setUserId(fetchedData.user[0].id);
        setFirstName(fetchedData.user[0].firstName);
        setLastName(fetchedData.user[0].lastName);
        setPhone(fetchedData.user[0].phone);
        setEmail(fetchedData.user[0].email);
        setCity(fetchedData.user[0].city);
        setArea(fetchedData.user[0].area);
        setStreet(fetchedData.user[0].street);
        setBuilding(fetchedData.user[0].building);
        setKorpus(fetchedData.user[0].korpus);
        setEntrance(fetchedData.user[0].entrance);
        setFloor(fetchedData.user[0].floor);
        setApartment(fetchedData.user[0].apartment);
        setLegal(fetchedData.user[0].legalStatus);
        setCompany(fetchedData.user[0].company);
        setPosition(fetchedData.user[0].position);
        setVoen(fetchedData.user[0].voen);
        setBirthdate(fetchedData?.user[0]?.birthDate?.split("T")[0]);
        setGender(fetchedData.user[0].gender);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDataAsync();
  }, []);

  const users = data.user;
  const user = users[0];

  const [userId, setUserId] = useState(0);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [korpus, setKorpus] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [legal, setLegal] = useState(0);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [voen, setVoen] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState(0);
  const [message, setMessage] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/profile/edit-profile",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            Id: userId,
            FirstName: firstname,
            LastName: lastname,
            Email: email,
            Phone: phone,
            Birthdate: birthdate,
            Gender: gender,
            City: city,
            Area: area,
            Street: street,
            Building: building,
            Korpus: korpus,
            Entrance: entrance,
            Floor: floor,
            Apartment: apartment,
            Legal: legal,
            Company: company,
            Position: position,
            Voen: voen,
          }),
        }
      );

      if (res.status === 200) {
        const resJson = await res.json();
        setData(resJson.output);
        setMessage("Profile has been updated successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  let logout = async () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
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

  return (
    <main>
      <div className="profile-page">
        <CardFrame>
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-photo"></div>
              <div>
                <p className="user-name">
                  {user?.firstName || "NAME"} {user?.lastName || "SURNAME"}
                </p>
                <p className="user-email">{user?.email}</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <NotificationBox iconSize={15} />
            </div>
          </div>
        </CardFrame>
        {/* <div className="contact">
          <button className="btn-with-icon">
            <Image src={icons.chat} width={22} height={22} alt="contact" />
            <span>Contact</span>
          </button>
          <button className="btn-with-icon">
            <Image src={icons.pack} width={22} height={22} alt="package" />
            <span>Reorder</span>
          </button>
        </div> */}
        <CardFrame>
          <ul className="main-links flex flex-col gap-3 pb-4">
            <li>
              <Link href="/account/history">
                <TitleWithIcon icon={icons.pack} title="My orders" />
              </Link>
            </li>
            <li>
              <Link href="/account/statement">
                <TitleWithIcon icon={icons.statement} title="Statement"/>
              </Link>
            </li>
            <li>
              <div className="dropdown-container">
                <figure className="flex items-center gap-4">
                  <Image
                    src={icons.location}
                    width={22}
                    alt="location"
                  />
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
                  {data.userAddress.length > 0 ? (
                    <ul className="address-list">
                      {data.userAddress.map((address) => (
                        <div className="shipping-address-items border rounded-md px-5 py-3 my-2">
                          <h2>{address.title}</h2>
                          <h6>{address.adressLine1}</h6>
                          <h6>{address.adressLine2}</h6>
                          <h6>
                            {address.city}, {address.country}
                          </h6>
                          <h6>{address.phone}</h6>
                          <h6>{address.postcode}</h6>
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-3 py-1 text-center">No address data.</p>
                  )}
                </div>
              </div>
            </li>
            {/* <li className="flex items-center gap-4">
              <Image
                src={icons.returnIcon}
                width={22}
                height={22}
                alt="return"
              />
              <span>Return requests</span>
            </li>  */}
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
    </main>
  );
}
