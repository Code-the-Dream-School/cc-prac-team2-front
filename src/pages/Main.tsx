import { useState } from "react";
import LogIN from "../entryPoint/Login.tsx";
import Register from "../entryPoint/Register.tsx";
import NavBar from "./../navbar/NavBar.tsx";
import Cockatoo from "../UI/Cockatoo.tsx";
import "./Main.css";

const Main = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [showRegister, setShowRegister] = useState(false);

    const handleRegisterClick = () => {
        setShowLogin(!showLogin);
        setShowRegister(!showRegister);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <NavBar />
            <Cockatoo />

            <div className="flex justify-center items-center h-full mt-5 bg-white rounded-lg">
                <div className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                        <div className="flex justify-center">
                            {showLogin && <LogIN />}
                            {showRegister && <Register />}
                        </div>
                    </div>
                    <div className="flex justify-center mt-5">
                        <p className="text">
                            {showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <span
                                className="text-blue-500 font-bold cursor-pointer hover:text-blue-700"
                                onClick={handleRegisterClick}
                            >
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
