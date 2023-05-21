import { useState } from "react";
import LogIN from "../entryPoint/Login.tsx";
import Register from "../entryPoint/Register.tsx";
import NavBar from "./../navbar/NavBar.tsx";
import "./Main.css"
import Cockatoo from "../UI/Cockatoo.tsx";
const Main = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [showRegister, setShowRegister] = useState(false);

    const handleRegisterClick = () => {
        setShowLogin(!showLogin);
        setShowRegister(!showRegister);
    };

    return (
        <div className="app">
            <NavBar />
            <Cockatoo />

            <div className="main-container">
                <div className="card-container">
                    <div className="form-container">
                        {showLogin && <LogIN />}
                        {showRegister && <Register />}
                    </div>
                    <div className="button-container">
                        <p className="text">
                            {showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <span className="register-link" onClick={handleRegisterClick}>
              {showLogin ? "Register" : "Login"}
            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
