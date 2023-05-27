import React from "react";
import {useState, useContext, useEffect} from 'react'
import './NavBar.css';
import {UserContext} from "../context/user-context"


const NavBar = () => {
    const [user, setUser] = useContext(UserContext)

    return (
        <>
        <nav className="hidden md:flex bg-black text-white ">
          <ul className="flex items-center p-3  ">
            <li className="px-4">
              <a className="no-underline text-center hover:text-yellow-400 " href="/chat">COCKATOO</a>
            </li>
            <li className="items-center" >
                {user && user.userName ? <p> Hello, {user.userName} </p> : ""}
            </li>
          </ul>
        </nav>
        </>
  
    )
}

export default NavBar