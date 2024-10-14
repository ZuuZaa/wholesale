import { Roboto } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { TotalQuantityProvider } from "@/context/total-quantity-context";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import ScrollToTop from "@/components/scroll-to-top";
import "../assets/icomoon/style.css";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Wholesale Catering",
  description: "Wholesale Catering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className="flex flex-col min-h-screen">
          <SiteSettingsProvider>
            <TotalQuantityProvider>
              <Header />
              {children}
              <Footer />
              <ScrollToTop />
            </TotalQuantityProvider>
          </SiteSettingsProvider>
        </div>
      </body>
    </html>
  );
}
