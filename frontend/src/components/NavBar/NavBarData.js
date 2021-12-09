import { AiOutlineHome } from "react-icons/ai";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import * as goIcons  from "react-icons/go";

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
  {
    title: "Market News",
    icon: <IoNewspaperOutline />,
    path: "/market-news",
  },
  {
    title: "Crypto News",
    icon: <IoNewspaperOutline />,
    path: "/crypto-news",
  },
  {
    title: "SignUp",
    icon: <IoNewspaperOutline.IoCreate />,
    path: "/signup",
  },
  {
    title: "Login",
    icon: <goIcons.GoSignIn />,
    path: "/login",
  },
];
