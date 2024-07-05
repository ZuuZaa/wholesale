"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pcard from "../../../public/images/footer/Payment2.png";
import "./footer.scss";
import { footerLinks } from "./constants";
import { usePathname } from "next/navigation";
import { useTotalQuantity } from "@/context/total-quantity-context";

let token = "";
let session_id = "";
if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("jwtToken");
  session_id = localStorage.getItem("sessionId");
}

async function fetchData() {
  const params = new URLSearchParams();
  params.append("SessionId", session_id);
  const response = await fetch(
    `https://api.wscshop.co.uk/api/layout/get-footer`,
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

const Footer = () => {
  const [settings, setSettings] = useState({});
    const { totalQuantity, setTotalQuantity } =
      useTotalQuantity();

  const pathname = usePathname();


  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await fetchData();
      setSettings(fetchedData.settings[0]);
      setTotalQuantity(fetchedData.totalQuantity);
    }

    fetchDataAsync();
  }, []);

  return (
    <footer>
      <div className="footer--mobile ">
        <ul className="flex justify-around items-center h-full">
          {footerLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.path}>
                <figure className="footer-link-wrapper">
                  <Image
                    src={link.icon}
                    height={20}
                    alt={link.name}
                    className={
                      pathname === link.path
                        ? "footer-link active"
                        : "footer-link"
                    }
                  />
                  {link.name === "basket" && totalQuantity !== 0 && (
                    <span>{totalQuantity}</span>
                  )}
                </figure>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
