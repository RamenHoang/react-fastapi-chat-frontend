import React, { useEffect, useState } from "react";

const ModalUpdateProfile = ({ title, onConfirm, onCancel, formData, handleInputChange, handleResetPassword }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 w-3/4 max-w-3xl ${isVisible ? 'scale-100' : 'scale-90'}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <form className="space-y-6 grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="p-3 border rounded-lg w-full"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-3 border rounded-lg w-full"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="p-3 border rounded-lg w-full"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="p-3 border rounded-lg w-full"
              required
            />
          </div>
        </form>
        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded"
            onClick={handleResetPassword} // Call handleResetPassword on click
          >
            Forgot Password
          </button>
          <div>
            <button
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded mr-4"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onCancel, 300);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-6 py-3 rounded"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onConfirm, 300);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateProfile;