import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function DeleteModal({ isOpen, onClose, onDelete, commentId }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-auto shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent the modal content from closing when clicked
      >
        <div className="flex justify-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-4xl" />
        </div>
        <h3 className="text-center text-xl text-gray-700 mb-4">
          Are you sure you want to delete this comment?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
            onClick={() => onDelete(commentId)}
          >
            Yes, I'm sure
          </button>
          <button
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
}
