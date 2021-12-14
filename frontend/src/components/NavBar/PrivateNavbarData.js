import { MdOutlineAccountCircle } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";

export const PrivateNavbarData = [
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
    title: "Account",
    icon: <MdOutlineAccountCircle />,
    path: "/account",
  },
];
