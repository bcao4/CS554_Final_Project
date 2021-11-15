import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { NavBarData } from './NavBarData';
import * as faIcons from 'react-icons/fa';
import './NavBar.css'

const NavBar = () => {
  return (
    <>
    <div className="banner">
      <NavLink className="logo-icon" to='/'>
        <faIcons.FaBitcoin />
        <span>CryptoTracker</span>
      </NavLink>
    </div>
    <div className="navbarComp">
      {NavBarData.map((item, key) => {
        return (
          <ul className="navbar-items">
            <li key="{key}" className="navbar-item">
              <NavLink className='navlink' activeclassname="active" to={item.path}>
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          </ul>
        )
      })} 
    </div>
    </>
  )
}

export default NavBar
