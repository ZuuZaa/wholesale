"use client";

import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { TotalQuantityProvider } from "@/context/total-quantity-context";
import ScrollToTop from "@/components/scroll-to-top";
import { useState } from "react/cjs/react.production.min";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Wholesale Catering",
  description: "Wholesale Catering",
};

export default function RootLayout({ children }) {
  const [logo, setLogo] = useState(null);
  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className="flex flex-col min-h-screen">
          <TotalQuantityProvider>
            <Header logo={logo} />
            {children}
            <Footer setLogo={setLogo} />
            <ScrollToTop />
          </TotalQuantityProvider>
        </div>
      </body>
    </html>
  );
}
