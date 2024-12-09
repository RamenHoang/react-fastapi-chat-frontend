import React, { useEffect, useState } from "react";

const Modal = ({ title, message, onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-90'}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onCancel, 300);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
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
  );
};

export default Modal;