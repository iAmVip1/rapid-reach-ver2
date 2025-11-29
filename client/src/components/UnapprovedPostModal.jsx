import React from 'react';
import { FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaCalendar, FaCheck, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function UnapprovedPostModal({ post, onClose, onApprove, onDelete, onCall, isOnline }) {
  if (!post) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Post Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.imageUrls[0].startsWith('http') ? post.imageUrls[0] : `http://localhost:3000${post.imageUrls[0]}`}
                alt={post.departmentName}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {post.departmentName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{post.description}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaCalendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaPhone className="w-4 h-4 mr-2 text-blue-500" />
                <span>{post.phoneNumber1}</span>
              </div>
              {post.phoneNumber2 && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaPhone className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{post.phoneNumber2}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaEnvelope className="w-4 h-4 mr-2 text-green-500" />
                <span>{post.userMail}</span>
              </div>
              {post.website && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaGlobe className="w-4 h-4 mr-2 text-purple-500" />
                  <a href={post.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {post.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-red-500" />
              Location
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{post.address}</p>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              <span>Lat: {post.latitude}, Lng: {post.longitude}</span>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Category</h4>
              <p className="text-gray-600 dark:text-gray-400">{post.category}</p>
            </div>
            {post.registrationNo && (
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Registration Number</h4>
                <p className="text-gray-600 dark:text-gray-400">{post.registrationNo}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          {post.documentUrls && post.documentUrls.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Supporting Documents</h4>
              <div className="space-y-2">
                {post.documentUrls.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.startsWith('http') ? doc : `http://localhost:3000${doc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    Document {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 px-6 py-4 flex flex-wrap gap-3">
          <button
            onClick={() => onCall(post)}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
          >
            <FaPhone className="w-4 h-4 mr-2" />
            Call User
          </button>
          {!post.approved && (
            <button
              onClick={() => onApprove(post._id)}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              <FaCheck className="w-4 h-4 mr-2" />
              Approve
            </button>
          )}
          {post.approved && (
            <Link to={`/post/${post._id}`} className="flex-1 min-w-[120px]">
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                <FaEye className="w-4 h-4 mr-2" />
                View Public
              </button>
            </Link>
          )}
          <button
            onClick={() => onDelete(post._id)}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <FaTrash className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

