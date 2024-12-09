import React, { useEffect, useState } from "react";
import { fetchUsers, registerUser, updateUser, resetPassword, deleteUser } from "./api/users"; // Import resetPassword and deleteUser functions
import Navbar from "./components/Navbar";
import useChat from "./hooks/useChat";
import { ROLE_NAMES, ROLE_MODERATOR, ROLE_MEMBER } from "./constants";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import "./Loader.css"; // Import loader styles
import Modal from "./components/Modal"; // Import Modal component

const ListUsers = ({ accessToken, userId, logout, role }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: "", username: "", email: "", password: "", role: ROLE_MEMBER });
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState(false); // Add loading state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Add state for delete modal
  const [userToDelete, setUserToDelete] = useState(null); // Add state for user to delete

  const {
    userData,
  } = useChat(accessToken, userId);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true); // Set loading to true
      try {
        const usersData = await fetchUsers(accessToken);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    getUsers();
  }, [accessToken]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData({ full_name: user.full_name, username: user.username, email: user.email, password: "", role: user.role });
    setActiveTab("edit");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "radio" ? (checked ? value : prevData[name]) : value,
    }));

    console.log("Form data:", formData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      if (selectedUser) {
        delete formData.password;
        await updateUser(accessToken, selectedUser.id, formData);
        const usersData = await fetchUsers(accessToken);
        setUsers(usersData);
        setSelectedUser(null);
        setFormData({ full_name: "", username: "", email: "", password: "", role: ROLE_MEMBER });
        setActiveTab("new");
        toast.success("User updated successfully");
      } else {
        await registerUser(formData);
        const usersData = await fetchUsers(accessToken);
        setUsers(usersData);
        setFormData({ full_name: "", username: "", email: "", password: "", role: ROLE_MEMBER });
        setActiveTab("new");
        toast.success("User created successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true); // Set loading to true
    try {
      await deleteUser(accessToken, userToDelete); // Call deleteUser API
      const usersData = await fetchUsers(accessToken);
      setUsers(usersData);
      toast.success("User deleted successfully");
      setShowDeleteModal(false); // Close modal
      setUserToDelete(null); // Reset user to delete
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleResetPassword = async (userId) => {
    setLoading(true); // Set loading to true
    try {
      await resetPassword(accessToken, userId); // Call resetPassword API
      toast.success("Password reset successfully");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Navbar userData={userData} userId={userId} logout={logout} role={role} accessToken={accessToken} />
      <div className="flex flex-1 justify-center overflow-hidden">
        <div className="w-full max-w-6xl p-4 shadow-md flex flex-col">
          {/* Add Modal component */}
          {showDeleteModal && (
            <Modal
              title="Confirm Delete"
              message="Are you sure you want to delete this user?"
              onConfirm={handleDeleteUser}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}
          <div className="mb-4">
            <button
              className={`p-2 ${activeTab === "new" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded-lg mr-2`}
              onClick={() => {
                setActiveTab("new");
                setSelectedUser(null);
                setFormData({ full_name: "", username: "", email: "", password: "", role: ROLE_MEMBER });
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
            <form onSubmit={handleFormSubmit} className="mb-4 grid grid-cols-2 gap-4">
              <h2 className="text-xl font-bold mb-2 col-span-2">
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
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>
              {activeTab === "new" && (
                <div className="mb-2">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="p-2 border rounded-lg w-full"
                    required
                  />
                </div>
              )}
              <div className="mb-2 col-span-2">
                <label className="block text-gray-700">Role</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={ROLE_MODERATOR}
                    checked={formData.role == ROLE_MODERATOR}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="mr-4">Moderator</label>
                  <input
                    type="radio"
                    name="role"
                    value={ROLE_MEMBER}
                    checked={formData.role == ROLE_MEMBER}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label>Member</label>
                </div>
              </div>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg col-span-2"
              >
                {selectedUser ? "Update User" : "Create User"}
              </button>
            </form>
          ) : null}
          <h2 className="text-xl font-bold mb-2">List of Users</h2>
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Full Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
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
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{ROLE_NAMES[user.role]}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="mr-2 p-1 bg-yellow-500 text-white rounded"
                        onClick={() => handleUserSelect(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="mr-2 p-1 bg-red-500 text-white rounded"
                        onClick={() => {
                          setUserToDelete(user.id); // Set user to delete
                          setShowDeleteModal(true); // Show delete modal
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="p-1 bg-blue-500 text-white rounded"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        Reset Password
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