import home from "@/assets/icons/home.svg";
import bookmark from "@/assets/icons/bookmark.svg";
import basket from "@/assets/icons/basket.svg";
import user from "@/assets/icons/user.svg";

export const footerLinks = [
  {
    name: "home",
    path: "/",
    icon: home,
  },
  {
    name: "favorite",
    path: "/wishlist",
    icon: bookmark,
  },
  {
    name: "basket",
    path: "/cart",
    icon: basket,
  },
  {
    name: "user",
    path: "/account/profile",
    icon: user,
  },
];
