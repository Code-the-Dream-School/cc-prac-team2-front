import React, { useState, useEffect, useContext } from 'react';
import Chat from "./pages/Chat"
import Main from "./pages/Main"
import { Navigate, Route, Routes, useNavigate, useLocation  } from "react-router-dom";
import NavBar from './navbar/NavBar';
import {UserContext} from "./context/user-context"


const URL = 'http://localhost:8000/api/v1/';


function App() {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate("/chat");
    } else {
      navigate('/')
    }
  }, []);
  


  return (
    <>
        <NavBar />
        <Routes>
            <Route path="/"       element={<Main />} />
            <Route path="/chat"   element={<Chat />} />
        </Routes>
    </>
  );
}

export default App;
