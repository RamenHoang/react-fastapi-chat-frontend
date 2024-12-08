import React, { useEffect, useState } from "react";
import { fetchUsers } from "./api/users";
import Navbar from "./components/Navbar";
import useChat from "./hooks/useChat";
import { ROLE_NAMES, ROLE_MODERATOR, ROLE_MEMBER } from "./constants";

const ListUsers = ({ accessToken, userId, logout, role }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: "", username: "", role: ROLE_MEMBER });
  const [activeTab, setActiveTab] = useState("new");

  const {
    userData,
  } = useChat(accessToken, userId);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers(accessToken);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, [accessToken]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData({ full_name: user.full_name, username: user.username, role: user.role });
    setActiveTab("edit");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add logic to create or update user
    console.log("Form submitted:", formData);
  };

  const handleDeleteUser = (userId) => {
    // Add logic to delete user
    console.log("Delete user with id:", userId);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <Navbar userData={userData} userId={userId} logout={logout} />
      <div className="flex flex-1 justify-center overflow-hidden">
        <div className="w-full max-w-3xl p-4 shadow-md flex flex-col">
          <div className="mb-4">
            <button
              className={`p-2 ${activeTab === "new" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded-lg mr-2`}
              onClick={() => {
                setActiveTab("new");
                setSelectedUser(null);
                setFormData({ full_name: "", username: "", role: ROLE_MEMBER });
              }}
            >
              New User
            </button>
            <button
              className={`p-2 ${activeTab === "edit" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded-lg`}
              onClick={() => setActiveTab("edit")}
              disabled={!selectedUser}
            >
              Edit User
            </button>
          </div>
          {activeTab === "new" || (activeTab === "edit" && selectedUser) ? (
            <form onSubmit={handleFormSubmit} className="mb-4">
              <h2 className="text-xl font-bold mb-2">
                {selectedUser ? "Edit User" : "New User"}
              </h2>
              <div className="mb-2">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Role</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={ROLE_MODERATOR}
                    checked={formData.role === ROLE_MODERATOR}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="mr-4">Moderator</label>
                  <input
                    type="radio"
                    name="role"
                    value={ROLE_MEMBER}
                    checked={formData.role === ROLE_MEMBER}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label>Member</label>
                </div>
              </div>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg"
              >
                {selectedUser ? "Update User" : "Create User"}
              </button>
            </form>
          ) : null}
          <h2 className="text-xl font-bold mb-2">List of Users</h2>
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Full Name</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b">{user.id}</td>
                    <td className="py-2 px-4 border-b">{user.username}</td>
                    <td className="py-2 px-4 border-b">{user.full_name}</td>
                    <td className="py-2 px-4 border-b">{ROLE_NAMES[user.role]}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="mr-2 p-1 bg-yellow-500 text-white rounded"
                        onClick={() => handleUserSelect(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="p-1 bg-red-500 text-white rounded"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUsers;