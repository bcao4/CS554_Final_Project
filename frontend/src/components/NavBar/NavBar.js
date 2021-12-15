import { NavLink } from "react-router-dom";
import { NavBarData } from "./NavBarData";
import { FaBitcoin } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { PrivateNavbarData } from "./PrivateNavbarData";
import "./NavBar.css";
import { Typography, Drawer, List, ListItem, Divider } from "@mui/material";

export const NAVBAR_WIDTH = 200;

const NavBar = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          width: NAVBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "black",
        },
      }}
    >
      <div>
        <NavLink className="logo-icon" to="/">
          <div
            className="flex-center"
            style={{ justifyContent: "flex-start !important" }}
          >
            <FaBitcoin />
            <Typography style={{ marginLeft: 6 }}>CryptoTracker</Typography>
          </div>
        </NavLink>
      </div>
      <Divider />
      <List className="navbar-items">
        {PrivateNavbarData.map((item, index) => {
          return (
            <ListItem key={index} className="navbar-item">
              <NavLink
                className="navlink"
                activeclassname="active"
                to={item.path}
              >
                <div className="flex-center">
                  {item.icon}
                  <Typography style={{ marginLeft: 4 }}>
                    {item.title}
                  </Typography>
                </div>
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

const NavigationNonAuth = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          width: NAVBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "black",
        },
      }}
    >
      <div>
        <NavLink className="logo-icon" to="/">
          <div
            className="flex-center"
            style={{ justifyContent: "flex-start !important" }}
          >
            <FaBitcoin />
            <Typography style={{ marginLeft: 6 }}>CryptoTracker</Typography>
          </div>
        </NavLink>
      </div>
      <Divider />
      <List>
        {NavBarData.map((item, index) => {
          return (
            <ListItem key={index} className="navbar-item">
              <NavLink
                className="navlink"
                activeclassname="active"
                to={item.path}
              >
                <div className="flex-center">
                  {item.icon}
                  <Typography style={{ marginLeft: 4 }}>
                    {item.title}
                  </Typography>
                </div>
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default NavBar;
