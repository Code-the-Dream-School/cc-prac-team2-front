import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailRegex from '../util/constants.tsx';
import jwt_decode from 'jwt-decode';
import { UserContext } from '../context/user-context';
import { toast } from "react-toastify";

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setIsFormValid(email.trim() !== '' && password.trim() !== '');
  }, [email, password]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const validateEmail = () => {
    if (email.trim() === '') {
      setEmailError('Email is required');
    } else {
      if (!emailRegex.test(email)) {
        setEmailError('Invalid email format');
      }
    }
  };

  const validatePassword = () => {
    if (password.trim() === '') {
      setPasswordError('Password is required');
    } else if (password.length < 6) {
      setPasswordError('Password is too short');
    }
  };

  const validateForm = () => {
    validateEmail();
    validatePassword();
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateForm();

    if (isFormValid) {
      try {
        const response = await axios.post('http://localhost:8000/api/v1/users/log-in', {
          email: email,
          password: password
        });

        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem('token', JSON.stringify(token));
          const loggedIn = jwt_decode(token);
          setUser(loggedIn);

          toast.success('User signed in');

            navigate('/chat');

        }
      } catch (error) {
        console.log('Error signing in:', error);
        toast.error('Error signing in');
      }
    }
  };

  const isButtonDisabled = emailError || passwordError || !isFormValid;

  return (

        <div className="flex justify-center items-center">
          <form className="bg-white rounded-md p-8" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold mb-8" style={{ marginRight: '180px', fontFamily: 'Montserrat, sans-serif' }}>Sign in</h2>
            <div className="mb-6">
              <input
                  type="text"
                  placeholder="Email"
                  className={`w-full px-4 py-2 border-b-2 outline-none ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={validateEmail}
              />
              {emailError && (
                  <div className="text-red-500 text-sm mt-1">{emailError}</div>
              )}
            </div>
            <div className="mb-6">
              <input
                  type="password"
                  placeholder="Password"
                  className={`w-full px-4 py-2 border-b-2 outline-none ${
                      passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={validatePassword}
              />
              {passwordError && (
                  <div className="text-red-500 text-sm mt-1">{passwordError}</div>
              )}
            </div>
            <button
                type="submit"
                className={`bg-yellow-200 text-gray-800 text-sm font-bold px-8 py-3 rounded-full shadow-md transition-colors ${
                    isButtonDisabled
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'hover:bg-blue-500 hover:text-white'
                }`}
                disabled={isButtonDisabled}
            >
              Sign in
            </button>
          </form>
        </div>

  );
};

export default LogIn;
