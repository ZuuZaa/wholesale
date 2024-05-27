"use client";

import { useEffect, useState } from "react";

import Menu from "../menu";
import "./profile.scss";
import { icons } from "./constans";
import Link from "next/link";
import Image from "next/image";

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
      <div className="profile--desktop">
        {/* Breadcrumb */}
        <div className="breadcrumb-wrapper py-12">
          <div className="custom-container mx-auto">
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="/"
                    className="inline-flex items-center text-sm font-medium"
                  >
                    Account
                  </a>
                </li>

                <li>
                  <div className="flex items-center">
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">
                      Profile
                    </a>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
        {/* Account Section */}
        <section className="account-page-main-section my-20 py-3">
          <div className="custom-container mx-auto">
            <div className="flex">
              <div className="account-page-menu w-2/5">
                <h5 className="title relative mb-5 text-lg">Account Menu</h5>
                <Menu />
              </div>
              <div className="account-page-main w-3/5">
                <div className="account-personal-information-wrapper">
                  <div className="w-full">
                    {users.map((user) => {
                      return (
                        <form
                          className="px-8 pt-6 pb-8 mb-4 grid grid-cols-2 gap-3"
                          onSubmit={handleSubmit}
                        >
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="name"
                            >
                              {" "}
                              Firstname{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="name"
                              type="text"
                              placeholder="Firstname"
                              defaultValue={user.firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="surname"
                            >
                              {" "}
                              Lastname{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="surname"
                              type="text"
                              placeholder="Lastname"
                              defaultValue={user.lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="phone"
                            >
                              {" "}
                              Phone{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="phone"
                              type="tel"
                              placeholder="Phone"
                              defaultValue={user.phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="email"
                            >
                              {" "}
                              Email{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="email"
                              type="email"
                              placeholder="Email"
                              defaultValue={user.email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="city"
                            >
                              {" "}
                              City{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="city"
                              type="text"
                              placeholder="City"
                              defaultValue={user.city}
                              onChange={(e) => setCity(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="area"
                            >
                              {" "}
                              Area{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="area"
                              type="text"
                              placeholder="Area"
                              defaultValue={user.area}
                              onChange={(e) => setArea(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="street"
                            >
                              {" "}
                              Street{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="street"
                              type="text"
                              placeholder="Street"
                              defaultValue={user.street}
                              onChange={(e) => setStreet(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="building"
                            >
                              {" "}
                              Building{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="building"
                              type="text"
                              placeholder="Building"
                              defaultValue={user.building}
                              onChange={(e) => setBuilding(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="korpus"
                            >
                              {" "}
                              Korpus{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="korpus"
                              type="text"
                              placeholder="Korpus"
                              defaultValue={user.korpus}
                              onChange={(e) => setKorpus(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="entrance"
                            >
                              {" "}
                              Entrance{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="entrance"
                              type="text"
                              placeholder="Entrance"
                              defaultValue={user.entrance}
                              onChange={(e) => setEntrance(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="floor"
                            >
                              {" "}
                              Floor{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="floor"
                              type="text"
                              placeholder="Floor"
                              defaultValue={user.floor}
                              onChange={(e) => setFloor(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="apartment"
                            >
                              {" "}
                              Apartment{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="apartment"
                              type="text"
                              placeholder="Apartment"
                              defaultValue={user.apartment}
                              onChange={(e) => setApartment(e.target.value)}
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="companyname"
                            >
                              {" "}
                              Company{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="companyname"
                              type="text"
                              placeholder="Company"
                              defaultValue={user.companyName}
                              onChange={(e) => setCompany(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="position"
                            >
                              {" "}
                              Position{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="position"
                              type="text"
                              placeholder="Position"
                              defaultValue={user.position}
                              onChange={(e) => setPosition(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="choice"
                            >
                              {" "}
                              Legal Status
                            </label>
                            <select
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="choice"
                              onChange={(e) => setLegal(e.target.value)}
                            >
                              <option value="1">Fiziki şəxs</option>
                              <option value="2">Hüquqi şəxs</option>
                            </select>
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="voen"
                            >
                              {" "}
                              VOEN{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="voen"
                              type="text"
                              placeholder="VOEN"
                              defaultValue={user.voen}
                              onChange={(e) => setVoen(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="birthdate"
                            >
                              {" "}
                              Birth Date{" "}
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="birthdate"
                              type="date"
                              defaultValue={user?.birthDate?.split("T")[0]}
                              onChange={(e) => setBirthdate(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-semibold mb-2"
                              for="birthdate"
                            >
                              {" "}
                              Gender{" "}
                            </label>
                            <select
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="choice"
                              onChange={(e) => setGender(e.target.value)}
                            >
                              <option value="1">Male</option>
                              <option value="2">Female</option>
                              <option value="0">Not Important</option>
                            </select>
                          </div>
                          {/* <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" type="password"> Password </label>
                                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                                   id="password"   type="password" placeholder="***********" />
                                            <p className="text-red-500 text-xs italic"></p>
                                        </div> */}

                          <div className="flex items-center justify-between w-full">
                            <button
                              className="bg-slate-600 hover:bg-slate-800 w-full text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="submit"
                            >
                              {" "}
                              Submit{" "}
                            </button>
                          </div>
                          <div className="message mt-4">
                            {message ? <p>{message}</p> : null}
                          </div>
                        </form>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="profile--mobile">
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
            <button>
              <Image
                src={icons.bell}
                width={15}
                height={15}
                alt="notification"
              />
            </button>
          </div>
        </div>
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
        <div className="links">
          {/* <ul className="main-links flex flex-col gap-3 pb-4">
            <li className="flex items-center gap-4">
              <Image src={icons.pack} width={22} height={22} alt="orders" />
              <span>My orders</span>
            </li>
            <li className="flex items-center gap-4">
              <Image
                src={icons.location}
                width={22}
                height={22}
                alt="location"
              />
              <span>Saved address</span>
            </li>
            <li className="flex items-center gap-4">
              <Image
                src={icons.returnIcon}
                width={22}
                height={22}
                alt="return"
              />
              <span>Return requests</span>
            </li>
          </ul> */}
          <ul className="flex flex-col gap-3 pl-9 pt-4">
            <li>
              <Link href="#">About us</Link>
            </li>
            <li>
              <Link href="#">Terms of use</Link>
            </li>
            <li>
              <Link href="#">Privacy policy</Link>
            </li>
            <li>
              <Link href="#">Delivery</Link>
            </li>
            <li onClick={logout} className="sign-out-link">Sign out</li>
          </ul>
        </div>
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
            </li>
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
