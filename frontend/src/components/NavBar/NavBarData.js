import React from 'react';
import * as antDesignIcons from 'react-icons/ai';
import * as bootstrapIcons from 'react-icons/bs';
import * as ioIcons from 'react-icons/io5';

export const NavBarData = [
  {
    title: "Home",
    icon: <antDesignIcons.AiOutlineHome />,
    path: "/"
  },
  {
    title: "Top Coins",
    icon: <bootstrapIcons.BsCurrencyBitcoin />,
    path: "/top-coins"
  },
  {
    title: "Crypto News",
    icon: <ioIcons.IoNewspaperOutline />,
    path: "/news"
  },
]