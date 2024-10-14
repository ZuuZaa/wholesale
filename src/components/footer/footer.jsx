"use client";
import { useEffect } from "react";
import Link from "next/link";
import "./footer.scss";
import { footerLinks } from "./constants";
import { usePathname } from "next/navigation";
import { useTotalQuantity } from "@/context/total-quantity-context";
import { fetchData } from "@/utils/fetch-api";
import { useSiteSettings } from "@/context/site-settings-context";
import Icon from "@/components/icon";

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
        setSettings({ logo, color });
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
                <span className="footer-link">
                  <Icon
                    name={link.name}
                    color={
                      pathname === link.path && "var(--primary-theme-color)"
                    }
                    size="20px"
                  />
                  {link.name === "basket" && totalQuantity !== 0 && (
                    <span className="total-quantity">{totalQuantity}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
