import { useEffect} from 'react';
import Chat from "./pages/Chat"
import Main from "./pages/Main"
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./navbar/NavBar"
// import {UserContext} from "./context/user-context"


// const URL = 'http://localhost:8000/api/v1/';


const App = () => {

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
    <div className="flex flex-col h-screen ">
        <Navbar />
        <Routes>
            <Route path="/"       element={<Main />} />
            <Route path="/chat"   element={<Chat />} />
        </Routes>
    </div>
    </>
  );
}

export default App;



