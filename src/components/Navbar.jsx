import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userData, userId, logout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-4 shadow-md">
      <h1
        className="text-2xl font-bold text-gray-800 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Chat Application
      </h1>
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
        <div className="relative group">
          <button className="p-2 bg-gray-200 rounded-full focus:outline-none">
            Rooms management
          </button>
          {/* <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 py-2 hidden group-hover:block">
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
              List rooms
            </button>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
              Add room
            </button>
          </div> */}
        </div>
      </div>
      <div>
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
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
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
    </div>
  );
};

export default Navbar;