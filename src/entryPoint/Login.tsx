import "./Login.css";

import { useState, useEffect } from 'react';

const LogIN = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Invalid email format');
      }
    }
  };

  const validatePassWord = () => {
    if(password.trim() === '' ) {
      setPasswordError('Password is required');
    } else if(password.length < 6) {
      setPasswordError('Your Email is Short')
    }
  }

  const validateForm = () => {
    validateEmail();
   validatePassWord();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validateForm();

    if (isFormValid) {
      // Perform further actions, such as making API requests or handling form submission
    }
  };

  const isButtonDisabled = emailError || passwordError || !isFormValid;

  return (
      <div className="login">
        <div className="login__container">
          <form className="login__form" onSubmit={handleSubmit}>
            <h1 className="login__title">Sign in</h1>
            <div className="login__input">
              <input
                  type="text"
                  placeholder="Email"
                  className={`login__inputField ${emailError ? 'error' : ''}`}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={validateEmail}
              />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <div className="login__input">
              <input
                  type="password"
                  placeholder="Password"
                  className={`login__inputField ${passwordError ? 'error' : ''}`}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={validatePassWord}
              />
              {passwordError && (
                  <div className="error-message">{passwordError}</div>
              )}
            </div>
            <button className="login__button" disabled={isButtonDisabled}>
              Sign in
            </button>
          </form>
        </div>
      </div>
  );
};

export default LogIN;
