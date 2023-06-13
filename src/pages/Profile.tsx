import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
const Profile = () => {
  const { user, setUser, isDarkMode } = useContext(UserContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

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

    const getImageData = () => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      });
    };

    getImageData()
      .then((result: any) => {
        setImage(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("userName", name);
    formData.append("public_id", user?.profileImage?.public_id || ""); // Include the current public_id if it exists

    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/users/${user.userId}/update-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        
        const { user: updatedUser, success } = response.data;
        if (success) {
          setUser(updatedUser);
          toast.success("Your Profile has been updated!");
          navigate("/chat");
        } else {
          toast.error("Something went wrong!");
        }
      } else {
        console.log("Error:", response.status);
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
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
                  src={image}
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
