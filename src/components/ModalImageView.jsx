import React, { useEffect, useState, useRef } from "react";

const ModalImageView = ({ image, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div ref={modalRef} className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 h-4/5 ${isVisible ? 'scale-100' : 'scale-90'}`}>
        <img src={image} alt="Image" className="w-full h-full object-cover rounded-lg"/>
      </div>
    </div>
  );
};

export default ModalImageView;