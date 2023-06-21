import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import COCKATOO from "./.././assests/cockatoo.png";
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
          `${import.meta.env.VITE_USERS_URL}/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.user.profileImage) {
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
      <div
        className={`flex flex-row text-${
          isDarkMode ? "white" : "black"
        } text-3xl`}
      >
        {/* add gif */}
        <img
          className="w-12 h-12"
          src="https://img1.picmix.com/output/stamp/normal/6/4/6/7/1647646_1b76b.gif"
          alt="logo"
        />
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
              <div
                onClick={handleDropdownClick}
                className="w-8 h-8 rounded-full shadow-xl flex items-center justify-center"
                style={{
                  backgroundImage: `url(${profileImage || COCKATOO})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!profileImage && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                )}
              </div>
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
