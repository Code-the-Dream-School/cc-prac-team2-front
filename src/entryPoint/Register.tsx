import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailRegex from "../util/constants.tsx";
import jwt_decode from "jwt-decode";
import {UserContext} from "../context/user-context"
import Notification from "../UI/Notification.tsx";

const Register = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const validateForm = () => {
      let isValid = true;

      if (userName.trim() === '') {
        setUsernameError('Username is required');
        isValid = false;
      } else {
        setUsernameError('');
      }

      if (email.trim() === '') {
        setEmailError('Email is required');
        isValid = false;
      } else {
        if (!emailRegex.test(email)) {
          setEmailError('Invalid email format');
          isValid = false;
        } else {
          setEmailError('');
        }
      }

      if (password.trim() === '') {
        setPasswordError('Password is required');
        isValid = false;
      } else {
        setPasswordError('');
      }

      if (confirmPassword.trim() === '') {
        setConfirmPasswordError('Confirm Password is required');
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        isValid = false;
      } else {
        setConfirmPasswordError('');
      }

      return isValid;
    };

    setIsFormValid(validateForm());
  }, [userName, email, password, confirmPassword]);

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        const response = await axios.post('http://localhost:8000/api/v1/users/sign-up', {
          userName,
          email,
          password
        });

          setShowNotification(true);
          setNotificationMessage('User signed Up');
          const {token} = response.data; // Assuming the token is returned in the response data

          // Redirect to /chat page
          // Save the token to local storage
          localStorage.setItem('token', JSON.stringify(token));

          // Navigate to the chat page
          setTimeout(() => {
            navigate('/chat');
          }, 4000);

      } catch (error) {
        // Handle error response
        console.log(error);
      }
    }
  };

  const isButtonDisabled =
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      !isFormValid;

  return (
      <>
        {showNotification && <Notification message={notificationMessage} />}
      <div className="flex justify-center items-center h-full">
              <div className="flex justify-center items-center">
          <form className="flex flex-col items-center bg-white rounded-2xl p-10" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold mb-8"
                style={{marginRight: '180px', fontFamily: 'Montserrat, sans-serif'}}>Sign up</h2>
            <div className="mb-6">
              <input
                  type="text"
                  placeholder="User Name"
                  className={`w-full px-4 py-2 border-b-2 outline-none ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={userName}
                  onChange={handleUsernameChange}
              />
              {usernameError && <div className="text-red-500 text-sm mt-1">{usernameError}</div>}
            </div>
            <div className="mb-6">
              <input
                  type="email"
                  placeholder="Email"
                  className={`w-full px-4 py-2 border-b-2 outline-none ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={email}
                  onChange={handleEmailChange}
              />
              {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
            </div>

            <div className="mb-6">
              <input
                  type="password"
                  placeholder="Password"
                  className={`w-full px-4 py-2 border-b-2 outline-none ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={password}
                  onChange={handlePasswordChange}
              />
              {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
            </div>
            <div className="mb-6">
              <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-2 border-b-2 outline-none ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && <div className="text-red-500 text-sm mt-1">{confirmPasswordError}</div>}
            </div>
            <button
                className={`bg-yellow-200 text-gray-800 text-sm font-bold px-8 py-3 rounded-full shadow-md transition-colors ${
                    isButtonDisabled
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'hover:bg-green-500 hover:text-white'
                }`} disabled={isButtonDisabled}>
              Sign Up
            </button>

          </form>
        </div>
      </div>
      </>
  );
}


export default Register;