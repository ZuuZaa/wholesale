"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pcard from "../../../public/images/footer/Payment2.png";
import "./footer.scss";
import { footerLinks } from "./constants";
import { usePathname } from "next/navigation";

async function fetchData() {
  const response = await fetch(
    "https://api.wscshop.co.uk/api/layout/get-footer"
  );
  const data = await response.json();
  return data.output;
}
const Footer = () => {
  const [settings, setSettings] = useState({});
  const pathname = usePathname();

  console.log(pathname)
  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await fetchData();
      setSettings(fetchedData.settings[0]);
    }

    fetchDataAsync();
  }, []);

  return (
    <footer>
      <div className="footer--desktop">
        <section className="top-footer pt-70 pb-30">
          <div className="frd-container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
              <div className="footer-col mb-5 sm:mb-7 lg:mb-10 text-center">
                <h5 className="footer-col-title text-base font-semibold mb-5">
                  Contact Us
                </h5>
                <ul className="footer-col-ul">
                  <li>
                    <span>{settings.companyName}</span>
                  </li>
                  <li>
                    <span>{settings.address}</span>
                  </li>
                  <li>
                    <span>{settings.phone}</span>
                  </li>
                  <li>
                    <span>{settings.email}</span>
                  </li>
                </ul>
              </div>
              <div className="footer-col mb-5 sm:mb-7 lg:mb-10 text-center">
                <h5 className="footer-col-title text-base font-semibold mb-5">
                  Our Products
                </h5>
                <ul className="footer-col-ul">
                  <li>
                    <Link href="/products/3">Trending Products</Link>
                  </li>
                  <li>
                    <Link href="/products/2">BestSeller Products</Link>
                  </li>
                  <li>
                    <Link href="/products/4">New Products</Link>
                  </li>
                  <li>
                    <Link href="/products/1">Featured Products</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-col mb-5 sm:mb-7 lg:mb-10 text-center">
                <h5 className="footer-col-title text-base font-semibold mb-5">
                  Information
                </h5>
                <ul className="footer-col-ul">
                  {!!settings.aboutPage && (
                    <li>
                      <Link href="/about">About Us</Link>
                    </li>
                  )}
                  {!!settings.contactPage && (
                    <li>
                      <Link href="/contact">Contact</Link>
                    </li>
                  )}
                  {!!settings.faqPage && (
                    <li>
                      <Link href="/faq">FAQ</Link>
                    </li>
                  )}

                  <li>
                    <Link href="#">Privacy&Policy</Link>
                  </li>
                  <li>
                    <Link href="#">Refund Policy</Link>
                  </li>
                  <li>
                    <Link href="#">Delivery Information</Link>
                  </li>
                  <li>
                    <Link href="#">Terms&Conditions</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="bottom-footer">
          <div className="frd-container mx-auto py-4">
            <div className="flex items-center flex-col justify-center lg:flex-row lg:justify-between">
              <div className="footer-copyright mb-5 text-center lg:text-left lg:mb-0">
                <p>
                  Copyright © {settings.companyName} | Built by{" "}
                  <Link href="https://logix.store">Logix</Link>.
                </p>
              </div>
              <div className="footer-cards flex gap-3">
                <Image
                  src={Pcard}
                  width={300}
                  height={200}
                  alt="Picture of the author"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="footer--mobile ">
        <ul className="flex justify-around items-center h-full">
          {footerLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.path}>
                <Image
                  src={link.icon}
                  height={20}
                  alt={link.name}
                  className={
                    pathname === link.path ? "footer-link active" : "footer-link"
                  }
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
