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
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const options = {
    method: "GET",
    url: `${import.meta.env.VITE_TRANSLATOR_URL}`,
    headers: {
      "X-RapidAPI-Key": `${import.meta.env.VITE_X_RapidAPI_Key}`,
      "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
    },
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.request(options);
        const { languages } = response.data.data; // Extract the "languages" array from the response data
        setLanguages(languages);
        console.log("Languages:", languages);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

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

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
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
            languageCode: selectedLanguage, // Add selected language code to the request data
          }
        );

        console.log("Response:", selectedLanguage);

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
    <div
      className={`flex justify-center items-center h-full ${
        isDarkMode ? "bg-gray-900" : ""
      }`}
    >
      <div className="flex justify-center items-center">
        <form
          className={`flex flex-col items-center rounded-2xl p-10 ${
            isDarkMode ? "bg-slate-900" : "bg-slate-100"
          }`}
          onSubmit={handleSubmit}
        >
          <h2
            className={`mb-8 text-5xl ${
              isDarkMode ? "text-white" : "text-black"
            }`}
            style={{
              marginRight: "180px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Sign up
          </h2>
          <div className="mb-6">
            <input
              type="text"
              placeholder="User Name"
              className={`w-96 px-4 py-2 border-b-2 outline-none ${
                usernameError ? "border-red-500" : "border-gray-300"
              } ${isDarkMode ? "bg-gray-800" : ""}`}
              value={userName}
              onChange={handleUsernameChange}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
            />
            {usernameError && (
              <div className="text-red-500 text-sm mt-1">{usernameError}</div>
            )}
          </div>
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              className={`w-96 px-4 py-2 border-b-2 outline-none ${
                emailError ? "border-red-500" : "border-gray-300"
              } ${isDarkMode ? "bg-gray-800" : ""}`}
              value={email}
              onChange={handleEmailChange}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-96 px-4 py-2 border-b-2 outline-none ${
                passwordError ? "border-red-500" : "border-gray-300"
              } ${isDarkMode ? "bg-gray-800" : ""}`}
              value={password}
              onChange={handlePasswordChange}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
            />
            <div
              className="absolute top-3 right-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>
          <div className="mb-6 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-96 px-4 py-2 border-b-2 outline-none ${
                confirmPasswordError ? "border-red-500" : "border-gray-300"
              } ${isDarkMode ? "bg-gray-800" : ""}`}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
            />
            <div
              className="absolute top-3 right-3 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            {confirmPasswordError && (
              <div className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </div>
            )}
          </div>

          <div className="mb-6">
            <select
              className={`w-96 px-4 py-2 mt-4 rounded-md ${
                isDarkMode ? "bg-gray-800" : ""
              }`}
              value={selectedLanguage}
              onChange={handleLanguageChange}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
            >
              <option value="">Select Language</option>
              {languages.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-40 px-4 py-2 rounded-lg ${
              isDarkMode ? "bg-purple-600 text-white" : "bg-purple-400"
            }`}
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
