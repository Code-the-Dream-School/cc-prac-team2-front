import { useState } from "react";
import LogIn from "../entryPoint/Login.tsx";
import Register from "../entryPoint/Register.tsx";
import ImageWrapper from "../UI/ImageWrapper.tsx";

const Main = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    

    const handleRegisterClick = () => {
        setShowLogin(!showLogin);
        setShowRegister(!showRegister);
    };

    return (
        <div className="flex h-full justify-start flex-wrap align-top">
            <div className="pt-24"  style={{width: '620px', height: '685px'}} >

            <ImageWrapper />
            </div>

            <div className="justify-center align-middle mt-24 bg-white rounded-xl" style={{width: '600px', height: '680px'}}>
                <div>
                    <div className="flex justify-center">
                        <div className="flex justify-center">
                            {showLogin && <LogIn />}
                            {showRegister && <Register />}
                        </div>
                    </div>
                    <div className="flex justify-center m-8">
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
