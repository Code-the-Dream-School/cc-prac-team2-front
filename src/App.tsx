import React, { useState, useEffect } from 'react';
import Chat from "./pages/Chat"

const URL = 'http://localhost:8000/api/v1/';

function App() {


  return (
    <>
    <Chat />
    </>
  );
}

export default App;
