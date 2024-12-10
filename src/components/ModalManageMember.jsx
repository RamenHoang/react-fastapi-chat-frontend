import React, { useEffect, useState } from "react";

const ModalManageMember = ({ title, onCancel, groupMembers, handleKickUser }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 w-3/4 max-w-3xl ${isVisible ? 'scale-100' : 'scale-90'}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className={`space-y-4 ${groupMembers.length > 5 ? 'max-h-96 overflow-y-auto' : ''}`}>
          {groupMembers.map((member) => (
            <div key={member.id} className="flex justify-between items-center">
              <span>{member.full_name}</span>
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={() => handleKickUser(member.id)} // Kick user from group
              >
                Kick
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onCancel, 300);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalManageMember;