import { AiOutlineHome } from "react-icons/ai";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { IoNewspaperOutline, IoCreate} from "react-icons/io5";
import {GoSignIn} from "react-icons/go";
import { GiWallet } from "react-icons/gi";

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
    title: "Buy/Sell",
    icon: <GiWallet />,
    path: "/trade",
  },
  {
    title: "SignUp",
    icon: <IoCreate />,
    path: "/signup",
  },
  {
    title: "Login",
    icon: <GoSignIn />,
    path: "/login",
  },
];
