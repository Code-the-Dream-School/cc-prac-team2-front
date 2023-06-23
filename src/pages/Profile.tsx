import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { user, setUser, isDarkMode } = useContext(UserContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // Store image as a file object

  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  const navigate = useNavigate();

  const navigateChat = () => {
    navigate("/chat");
  };

  const handleNameUpdate = (e: any) => {
    setName(e.target.value);
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (user && image) {
        formData.append("userName", name || user.userName);
        formData.append("image", image);
      }
  
      const response = await axios.patch(
        `${import.meta.env.VITE_USERS_URL}/${user._id}/update-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful response
      toast.success("Profile updated successfully!");

      // Update the user context with the updated profile image
      const updatedUser = { ...user };
      updatedUser.profileImage = response.data.profileImage;
      setUser(updatedUser);

      navigateChat();
    } catch (error) {
      // Handle error
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  return (
    <div
      className={`flex justify-center items-center h-full ${
        isDarkMode ? "bg-slate-950" : ""
      }`}
    >
      <div className="flex justify-center items-center">
        <form
          className="flex flex-col items-center rounded-2xl p-10 relative" // Added 'relative' class
          style={{
            backgroundColor: isDarkMode ? "#111827" : "#F1F5F9",
            color: isDarkMode ? "#F1F5F9" : "#111827",
          }}
          onSubmit={handleSubmit}
        >
          <button
            className="absolute left-4 top-4 bg-transparent border-none" // Positioned the arrow icon
            onClick={navigateChat}
          >
            <FaArrowLeft size={30} />
          </button>
          <h2
            className="mb-8 text-5xl"
            style={{
              marginRight: "180px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Profile
          </h2>
          <div className="mb-6">
            <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4">
              {image ? (
                <img
                  src={URL.createObjectURL(image)} // Display the selected image
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                  <FaPlus size={32} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
            <input
              type="text"
              placeholder="Name"
              className={`w-96 px-5 py-2 mt-4 mb-4 border-b-2 outline-none ${
                isDarkMode ? "bg-gray-800" : ""
              }`}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
              value={name}
              onChange={handleNameUpdate}
            />
          </div>
          <button className="bg-orange-50 text-gray-800 px-8 py-3 text-2xl w-96 mt-4 mb-4 rounded-full shadow-md transition-colors hover:bg-green-500 hover:text-white">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
