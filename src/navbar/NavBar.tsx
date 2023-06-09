import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, isDarkMode, setIsDarkMode } = useContext(UserContext);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("User signed out");
    navigate("/");
  };

  const navigate = useNavigate();

  const closeModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Toggle theme
  };

  return (
    <nav
      className={`py-2 px-3 flex justify-between items-center  ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
      style={{borderBottom: '1px solid #000'}}
    >
      <div className={`text-${isDarkMode ? "white" : "black"} text-3xl`}>
        TALCKATOO
      </div>
      <div className="flex items-center">
        {user && (
          <>
            <h5
              className={`text-${
                isDarkMode ? "white" : "black"
              } hover:text-gray-300  mr-2 focus:outline-none hidden sm:block`}
            >
              {user && user.userName ? <p>Welcome, {user.userName}</p> : ""}
            </h5>
            <button
              className={`text-${
                isDarkMode ? "white" : "black"
              } hover:text-gray-300 focus:outline-none`}
              onClick={handleDropdownClick}
            >
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 16L6 10H18L12 16Z" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="ml-2 relative">
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-999999">
                  <a
                    href="#"
                    className={`block px-4 py-2 text-${
                      isDarkMode ? "gray-800" : "gray-700"
                    } hover:bg-gray-300`}
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                  <a
                    href="#"
                    className={`block px-4 py-2 text-${
                      isDarkMode ? "gray-800" : "gray-700"
                    } hover:bg-gray-300`}
                    onClick={handleProfileClick}
                  >
                    Profile
                  </a>
                </div>
              </div>
            )}
            <HiOutlineUserCircle
              className={`text-${isDarkMode ? "white" : "black"} text-2xl ml-4`}
            />
            {isProfileModalOpen && (
              <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div
                  className={`bg-${
                    isDarkMode ? "gray-900" : "white"
                  } rounded-lg shadow-lg px-4 py-2`}
                >
                  <p>Profile Information</p>
                  <div>
                    <label htmlFor="nameInput">Name:</label>
                    <input
                      type="text"
                      id="nameInput"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="passwordInput">Password:</label>
                    <input
                      type="password"
                      id="passwordInput"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <button
                    className={`text-${
                      isDarkMode ? "gray-500" : "gray-700"
                    } hover:text-${isDarkMode ? "gray-700" : "gray-900"}`}
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <div className="ml-4">
          {isDarkMode ? (
            <BsFillSunFill
              className="text-yellow-500 cursor-pointer"
              onClick={toggleTheme}
            />
          ) : (
            <BsFillMoonFill
              className="text-gray-500 cursor-pointer"
              onClick={toggleTheme}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;