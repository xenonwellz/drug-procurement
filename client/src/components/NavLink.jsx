import React from 'react';
import { NavLink as NL } from "react-router-dom";

const NavLink = ({ to, children }) => {
    return (
        <NL to={to} className={({ isActive }) => "nav " + (isActive ? "nav-active" : "")} >
            {children}
        </NL>
    );
}

export default NavLink;
