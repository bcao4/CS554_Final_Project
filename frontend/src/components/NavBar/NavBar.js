import { NavLink } from "react-router-dom";
import { NavBarData } from "./NavBarData";
import { FaBitcoin } from "react-icons/fa";
import "./NavBar.css";

import React, { useContext } from 'react';
import { AuthContext } from '../../firebase/Auth';
import { PrivateNavbarData } from "./PrivateNavbarData";

// const NavBar = () => {
//   return (
//     <>
//       <div className="banner">
//         <NavLink className="logo-icon" to="/">
//           <FaBitcoin />
//           <span>CryptoTracker</span>
//         </NavLink>
//       </div>
//       <div className="navbarComp">
//         <ul className="navbar-items">
//           {NavBarData.map((item, index) => {
//             return (
//               <li key={index} className="navbar-item">
//                 <NavLink
//                   className="navlink"
//                   activeclassname="active"
//                   to={item.path}
//                 >
//                   {item.icon}
//                   <span>{item.title}</span>
//                 </NavLink>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </>
//   );
// };

const NavBar = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>
      {currentUser ? <NavigationAuth /> : <NavigationNonAuth />}
  </div>
  };

  const NavigationAuth = () => {
    return(
        <>
          <div className="banner">
            <NavLink className="logo-icon" to="/">
              <FaBitcoin />
              <span>CryptoTracker</span>
            </NavLink>
          </div>
          <div className="navbarComp">
            <ul className="navbar-items">
              {PrivateNavbarData.map((item, index) => {
                return (
                  <li key={index} className="navbar-item">
                    <NavLink
                      className="navlink"
                      activeclassname="active"
                      to={item.path}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
    );
    }
    
    const NavigationNonAuth = () => {
      return(
          <>
          <div className="banner">
            <NavLink className="logo-icon" to="/">
              <FaBitcoin />
              <span>CryptoTracker</span>
            </NavLink>
          </div>
          <div className="navbarComp">
            <ul className="navbar-items">
              {NavBarData.map((item, index) => {
                return (
                  <li key={index} className="navbar-item">
                    <NavLink
                      className="navlink"
                      activeclassname="active"
                      to={item.path}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      );
    }
    
export default NavBar;
