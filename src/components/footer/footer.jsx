"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./footer.scss";
import { footerLinks } from "./constants";
import { usePathname } from "next/navigation";
import { useTotalQuantity } from "@/context/total-quantity-context";
import { fetchData } from "@/utils/fetch-api";
import { useSiteSettings } from "@/context/site-settings-context";

const Footer = () => {
  const { totalQuantity, setTotalQuantity } = useTotalQuantity();
  const { setSettings } = useSiteSettings();

  const pathname = usePathname();

  const fetchDataAsync = async () => {
    try {
      const response = await fetchData("getFooter", false);
      console.log("footer:", response);
      setTotalQuantity(response.TotalQuantity);

      const color = response?.Settings?.[0]?.Color;
      const logo = response?.Settings?.[0]?.LogoMobile;

      if (color) {
        document.documentElement.style.setProperty(
          "--primary-theme-color",
          `#${color}`
        );
      }

      if (logo) {
        setSettings({logo, color});
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
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
