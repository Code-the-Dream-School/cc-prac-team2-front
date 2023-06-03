import React from "react";
import {useState, useContext, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import './NavBar.css';
import {UserContext} from "../context/user-context"
import jwt_decode from "jwt-decode";

const NavBar = () => {
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()

    
  

    const handleLogout = () => {
      localStorage.removeItem("token")
      setUser(null)
      navigate("/")
    }

    return (
        <>
        <nav className="flex bg-black text-white p-2 justify-between ">
            <div className="w-1/3">
              <a className="no-underline  " href="/chat">TALKATOO</a>
            </div>
            <div className="w-1/3">
              {localStorage.getItem("token") ? 
             <button onClick={handleLogout}>
             Logout
           </button>
           : null  
            }
            </div>
            <div className="w-1/3 ml-64" >
                {user && user.userName ? <p> Hello, {user.userName} </p> : ""}
            </div>
        
        </nav>
        </>
  
    )
}

export default NavBar