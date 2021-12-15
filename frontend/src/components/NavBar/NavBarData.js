import { AiOutlineHome } from "react-icons/ai";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { IoNewspaperOutline, IoCreate } from "react-icons/io5";
import { GoSignIn } from "react-icons/go";

export const NavBarData = [
  {
    title: "Home",
    icon: <AiOutlineHome />,
    path: "/",
  },
  {
    title: "Top Coins",
    icon: <BsCurrencyBitcoin />,
    path: "/top-coins",
  },
  // {
  //   title: "Market News",
  //   icon: <IoNewspaperOutline />,
  //   path: "/market-news",
  // },
  {
    title: "Market News",
    icon: <IoNewspaperOutline />,
    path: "/crypto-news",
  },
  {
    title: "Sign Up",
    icon: <IoCreate />,
    path: "/signup",
  },
  {
    title: "Login",
    icon: <GoSignIn />,
    path: "/login",
  },
];
