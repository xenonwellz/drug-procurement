import React, { useContext } from 'react';
import { Web3Context } from '../utils/contexts/Contract';
import logo from "../imgs/logo.png";
import NavLink from "./NavLink";

const NavBar = () => {

    const { account } = useContext(Web3Context);


    return (
        <nav className="fixed top-0 left-0 w-full bg-white">
            <div className='container flex justify-between h-16 p-3'>
                <img src={logo} className="w-10 h-10 rounded-md" alt="" />

                <div className='flex items-center gap-3'>
                    <NavLink to={"/"}>Home</NavLink>
                    <NavLink to={"/add-drug"}>Add Drugs</NavLink>
                    <NavLink to={"/supplied-drugs"}>Supplied Drugs</NavLink>
                    <NavLink to={"/purchased-drugs"}>Purchased Drugs</NavLink>
                </div>
            </div>
            <div className="border-t ">
                <div className="container flex items-center p-2">
                    <span className="inline-block w-2 h-2 mr-1 bg-green-700 rounded-full"></span>
                    <span className="pr-2 font-semibold">Connected: </span>
                    <span>{account}</span>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
