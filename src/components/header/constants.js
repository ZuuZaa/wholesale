import logo from "@/assets/icons/wsc-logo.svg";
import search from "@/assets/icons/search.svg";
import searchInput from "@/assets/icons/search-input.svg";
import chat from "@/assets/icons/chat.svg";
import bell from "@/assets/icons/bell.svg";
import chevron from "@/assets/icons/chevron.svg";

export const navLinks = [
  {
    id: "home",
    name: "homePage",
    path: "/",
    text: "Home",
    isDefault: true,
  },
  {
    id: "categories",
    name: "categoriesPage",
    path: "/categories",
    text: "Categories",
    isDefault: true,
  },
  {
    id: "about",
    name: "aboutPage",
    path: "/about",
    text: "About",
    isDefault: false,
  },
  {
    id: "faq",
    name: "faqPage",
    path: "/faq",
    text: "Faq",
    isDefault: false,
  },
  {
    id: "blogs",
    name: "blogPage",
    path: "/blogs",
    text: "Blogs",
    isDefault: false,
  },
  {
    id: "contact",
    name: "contactPage",
    path: "/contact",
    text: "Contact",
    isDefault: false,
  },
];

export const icons = {
  logo,
  search,
  searchInput,
  chat,
  bell,
  chevron
}