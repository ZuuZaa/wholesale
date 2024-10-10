"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./footer.scss";
import { footerLinks } from "./constants";
import { usePathname } from "next/navigation";
import { useTotalQuantity } from "@/context/total-quantity-context";
import { fetchData } from "@/utils/fetch-api";

const Footer = () => {
  const { totalQuantity, setTotalQuantity } = useTotalQuantity();

  const pathname = usePathname();

  const fetchDataAsync = async () => {
    try {
      const result = await fetchData("getFooter", false);
      console.log("footer:", result);
      setTotalQuantity(result.TotalQuantity);

      const color = result?.Settings?.[0]?.Color;
      // Ensure that the color exists before setting it
      if (color) {
        document.documentElement.style.setProperty(
          "--premium-color",
          `#${color}` // Make sure the color is in the correct format
        );
      }

      // Log the applied color to verify
      console.log(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--premium-color"
        )
      );

      console.log("color", `#${color}`);
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
