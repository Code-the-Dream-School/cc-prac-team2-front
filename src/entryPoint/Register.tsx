import { useState, useEffect, useContext, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import emailRegex from "../util/constants.tsx";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const { setUser, isDarkMode } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      let isValid = true;

      if (userName.trim() === "") {
        setUsernameError("Username is required");
        isValid = false;
      } else {
        setUsernameError("");
      }

      if (email.trim() === "") {
        setEmailError("Email is required");
        isValid = false;
      } else {
        if (!emailRegex.test(email)) {
          setEmailError("Invalid email format");
          isValid = false;
        } else {
          setEmailError("");
        }
      }

      if (password.trim() === "") {
        setPasswordError("Password is required");
        isValid = false;
      } else {
        setPasswordError("");
      }

      if (confirmPassword.trim() === "") {
        setConfirmPasswordError("Confirm Password is required");
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        isValid = false;
      } else {
        setConfirmPasswordError("");
      }

      return isValid;
    };

    setIsFormValid(validateForm());
  }, [userName, email, password, confirmPassword]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REGISTER_URL}`,
          {
            userName,
            email,
            password,
          }
        );

        const token = response.data.token;
        localStorage.setItem("token", JSON.stringify(token));
        const register = jwt_decode(token);

        setUser(register);

        toast.success("User signed up");
        navigate("/chat");
      } catch (error) {
        console.log("Error signing up:", error);
        toast.error("Error signing up");
      }
    }
  };

  const isButtonDisabled =
    !!usernameError ||
    !!emailError ||
    !!passwordError ||
    !!confirmPasswordError ||
    !isFormValid;

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  return (
    <div className={`flex justify-center items-center h-full ${isDarkMode ? "bg-gray-900" : ""}`}>
    <div className="flex justify-center items-center">
      <form className={`flex flex-col items-center rounded-2xl p-10 ${isDarkMode ? "bg-slate-900" : "bg-slate-100"}`} onSubmit={handleSubmit}>
        <h2 className={`mb-8 text-5xl ${isDarkMode ? "text-white" : "text-black"}`} style={{ marginRight: "180px", fontFamily: "Montserrat, sans-serif" }}>
          Sign up
        </h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="User Name"
            className={`w-96 px-4 py-2 border-b-2 outline-none ${usernameError ? "border-red-500" : "border-gray-300"} ${isDarkMode ? "bg-gray-800" : ""}`}
            value={userName}
            onChange={handleUsernameChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          {usernameError && <div className="text-red-500 text-sm mt-1">{usernameError}</div>}
        </div>
        <div className="mb-6">
          <input
            type="email"
            placeholder="Email"
            className={`w-96 px-4 py-2 border-b-2 outline-none ${emailError ? "border-red-500" : "border-gray-300"} ${isDarkMode ? "bg-gray-800" : ""}`}
            value={email}
            onChange={handleEmailChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
        </div>
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-96 px-4 py-2 border-b-2 outline-none ${passwordError ? "border-red-500" : "border-gray-300"} ${isDarkMode ? "bg-gray-800" : ""}`}
            value={password}
            onChange={handlePasswordChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          <button className="password-toggle-btn" onClick={togglePasswordVisibility}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
          {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
        </div>
        <div className="mb-6 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`w-96 px-4 py-2 border-b-2 outline-none ${confirmPasswordError ? "border-red-500" : "border-gray-300"} ${isDarkMode ? "bg-gray-800" : ""}`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          <button className="password-toggle-btn" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
          {confirmPasswordError && <div className="text-red-500 text-sm mt-1">{confirmPasswordError}</div>}
        </div>
        <button
          className={`bg-orange-50 text-gray-800 px-8 py-3 text-2xl w-96 mt-4 mb-4 rounded-full shadow-md transition-colors ${isButtonDisabled ? "bg-gray-300 cursor-not-allowed" : "hover:bg-blue-500 hover:text-white"} ${isDarkMode ? "text-white" : "text-black"}`}
          disabled={isButtonDisabled as boolean}
          style={{ backgroundColor: isDarkMode ? "#333" : "" }}
        >
          Sign Up
        </button>
      </form>
    </div>
  </div>
  
  );
};

export default Register;
