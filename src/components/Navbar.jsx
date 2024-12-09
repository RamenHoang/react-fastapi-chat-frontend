import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_ADMIN } from "../constants";
import ModalUpdateProfile from "./ModalUpdateProfile";
import { getCurrentUser, updateUser, resetPassword } from "../api/users"; // Import resetPassword API
import { toast } from "react-toastify";
import "../Loader.css"; // Import loader styles

const Navbar = ({ userData, userId, logout, role, accessToken }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false); // Add state for modal visibility
  const [formData, setFormData] = useState({ username: "", email: "", full_name: "", password: "" }); // Add state for form data
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const menuRef = useRef(null); // Add ref for menu

  const handleCloseModal = () => setShowModal(false); // Function to handle modal close

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    setLoading(true); // Set loading to true
    try {
      await updateUser(accessToken, userId, formData); // Call updateUser API
      console.log("User updated successfully");
      toast.success("User updated successfully");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response.data.detail || "An error occurred");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleOpenModal = async () => {
    setLoading(true); // Set loading to true
    try {
      const currentUser = await getCurrentUser(accessToken);
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        full_name: currentUser.full_name,
        password: "",
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching current user data:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleResetPassword = async () => {
    setLoading(true); // Set loading to true
    try {
      await resetPassword(accessToken, userId); // Call resetPassword API
      toast.success("Password reset successfully");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response.data.detail || "An error occurred");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="flex justify-between items-center p-4 shadow-md">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <h1
        className="text-2xl font-bold text-gray-800 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Chat Application
      </h1>
      {role == ROLE_ADMIN && (
        <div className="flex space-x-4">
          <div className="relative group">
            <button className="p-2 bg-gray-200 rounded-full focus:outline-none" onClick={() => navigate("/list-users")}>
              Users management
            </button>
            {/* <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 py-2 hidden group-hover:block">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => navigate("/list-users")}
            >
              List users
            </button>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
              Add user
            </button>
          </div> */}
          </div>
          {/* <div className="relative group">
            <button className="p-2 bg-gray-200 rounded-full focus:outline-none">
              Rooms management
            </button>
            <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 py-2 hidden group-hover:block">
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                List rooms
              </button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Add room
              </button>
            </div>
          </div> */}
        </div>
      )}
      <div ref={menuRef}>
        <button
          className="p-2 bg-gray-200 rounded-full focus:outline-none"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        {showMenu && (
          <div className="absolute right-4 mt-2 bg-white border rounded-lg shadow-lg w-48 py-2">
            <p className="px-4 py-2 text-gray-700">
              {userData.interacting_users.find((u) => u.id === userId)?.fullname}
            </p>
            <hr className="my-1" />
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => {
                handleOpenModal();
                setShowMenu(false); // Hide menu on click
              }}
            >
              Settings
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <ModalUpdateProfile
          title="Update Profile"
          onConfirm={handleFormSubmit} // Call handleFormSubmit on confirm
          onCancel={handleCloseModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleResetPassword={handleResetPassword} // Pass handleResetPassword to modal
        />
      )}
    </div>
  );
};

export default Navbar;