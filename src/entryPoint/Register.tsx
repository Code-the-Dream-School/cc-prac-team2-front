import "./Register.css";

const Register = () => {
  return (
    <div className="register">
      <div className="register__container">
        <form className="register__form">
          <h1 className="register__title">Sign up</h1>
          <div className="register__input">
            <input
              type="text"
              placeholder="Username"
              className="register__input-field"
            />
          </div>
          <div className="register__input">
            <input
              type="email"
              placeholder="Email"
              className="register__input-field"
            />
          </div>
          <div className="register__input">
            <input
              type="password"
              placeholder="Password"
              className="register__input-field"
            />
          </div>
          <div className="register__input">
            <input
              type="password"
              placeholder="Confirm Password"
              className="register__input-field"
            />
          </div>
          <button className="register__button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
