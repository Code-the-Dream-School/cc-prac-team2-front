import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import axios from "axios";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  const { user, setUser, isDarkMode, setIsDarkMode } = useContext(UserContext);

  useEffect(() => {
    setIsDropdownOpen(false); // Reset dropdown state
  }, [user]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/users/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
          if (response.data.user.profileImage){
            setProfileImage(response.data.user.profileImage.url);
          }
      } catch (error) {
        console.error(error);
      }
    };

    if (user && user._id) {
      fetchProfileImage();
    }
  }, [user, token]);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("User signed out");
    navigate("/");
  };

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Toggle theme
  };

  return (
    <nav
      className={`py-2 px-3 flex justify-between items-center drop-shadow-md ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
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
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={handleDropdownClick}
              />
            ) : (
              <button
                className={`text-${
                  isDarkMode ? "white" : "black"
                } hover:text-gray-300 focus:outline-none`}
                onClick={handleDropdownClick}
              >
                <HiOutlineUserCircle
                  className={`text-${
                    isDarkMode ? "white" : "black"
                  } text-2xl ml-4`}
                />
              </button>
            )}
            {isDropdownOpen && (
              <div className="ml-2 relative">
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-999999">
                  {/* why a link element?  */}
                  <a
                    href="#"
                    className={`block px-4 py-2 text-${
                      isDarkMode ? "gray-800" : "gray-700"
                    } hover:bg-gray-300`}
                    onClick={handleProfileClick}
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className={`block px-4 py-2 text-${
                      isDarkMode ? "gray-800" : "gray-700"
                    } hover:bg-gray-300`}
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
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
