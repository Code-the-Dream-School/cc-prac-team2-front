import "./Login.css";

const LogIN = () => {
  return (
    <div className="login">
      <div className="login__container">
        <form className="login__form">
          <h1 className="login__title">Sign in</h1>
          <div className="login__input">
            <input
              type="text"
              placeholder="Email"
              className="login__inputField"
            />
          </div>
          <div className="login__input">
            <input
              type="password"
              placeholder="Password"
              className="login__inputField"
            />
          </div>
          <button className="login__button">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default LogIN;
