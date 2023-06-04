import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { HiOutlineUserCircle } from "react-icons/hi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to track dropdown visibility
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State to track profile modal visibility
  const [name, setName] = useState(""); // State for name input
  const [password, setPassword] = useState(""); // State for password input

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true); // Show profile modal
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("User signed out");
    navigate("/");
  };

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsProfileModalOpen(false); // Close the profile modal
  };

  const handleNameChange = (e: any) => {
    setName(e.target.value); // Update name state with input value
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value); // Update password state with input value
  };

  return (
    <nav className="bg-black py-4 px-6 flex justify-between items-center">
      <div className="text-white text-3xl">TALCKATOO</div>
      <div className="flex items-center">
        {user && (
          <>
            <h5 className="text-white hover:text-gray-300  mr-2 focus:outline-none hidden sm:block">
              {user && user.userName ? <p>Welcome, {user.userName}</p> : ""}
            </h5>
            <button
              className="text-white hover:text-gray-300 focus:outline-none"
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
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                    onClick={handleProfileClick}
                  >
                    Profile
                  </a>
                </div>
              </div>
            )}
            <HiOutlineUserCircle className="text-white text-2xl ml-4" />
            {isProfileModalOpen && (
              <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg px-4 py-2">
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
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
