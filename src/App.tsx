import React, { useState, useEffect } from 'react';
import Chat from "./pages/Chat"
import Main from "./pages/Main"
import { Route, Routes} from "react-router-dom";

const URL = 'http://localhost:8000/api/v1/';

function App() {


  return (
    <>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/chat"   element={<Chat />} />
        </Routes>
    </>
  );
}

export default App;
