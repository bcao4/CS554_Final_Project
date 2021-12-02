import { NavLink } from "react-router-dom";
import { NavBarData } from "./NavBarData";
import * as faIcons from "react-icons/fa";
import "./NavBar.css";

const NavBar = () => {
  return (
    <>
      <div className="banner">
        <NavLink className="logo-icon" to="/">
          <faIcons.FaBitcoin />
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
};

export default NavBar;
