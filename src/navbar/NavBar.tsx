import React from "react";
import {useState, useContext, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import './NavBar.css';
import {UserContext} from "../context/user-context"
import Notification from "../UI/Notification.tsx";
import jwt_decode from "jwt-decode";

const NavBar = () => {
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    
  

    const handleLogout = () => {
      localStorage.removeItem("token")
      setUser(null)
        setShowNotification(true);
        setNotificationMessage('User signed Out');
        setTimeout(() => {
            navigate("/")
        }, 4000);

    }

    return (
        <>
        <nav className="hidden md:flex bg-black text-white ">
          <ul className="flex items-center p-3  ">
            <li className="px-4">
              <a className="no-underline text-center hover:text-yellow-400 " href="/chat">COCKATOO</a>
            </li>
            <li className="px-4">
              {localStorage.getItem("token") ? 
             <button onClick={handleLogout}>
             Logout
           </button>
           : null  
            }
                {showNotification && <Notification message={notificationMessage} />}
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