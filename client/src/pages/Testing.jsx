import React from "react";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaIdCard } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ApplicationUI() {
  return (
    <div className="flex items-center justify-center py-10 bg-gray-50">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-2xl p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
          User Details
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaUser className="text-emerald-600" /> User Information
            </h2>

            {/* Small Screen Image */}
            <div className="flex flex-col items-center md:hidden mb-4">
              <img
                src="https://via.placeholder.com/150"
                alt="User"
                className="w-40 h-40 rounded-full object-cover shadow-md"
              />
              <p className="text-sm text-gray-500 font-bold mt-2">User Image</p>
            </div>

            {/* User Details */}
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <FaUser className="text-emerald-600" />
                <strong>Username:</strong> John Doe
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-600" />
                <strong>Address:</strong> Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-emerald-600" />
                <strong>Email:</strong> johndoe@email.com
              </li>
              <li className="flex items-center gap-2">
                <FaBriefcase className="text-emerald-600" />
                <strong>Work:</strong> Electrician
              </li>
              <li className="flex items-center gap-2">
                <MdWorkHistory className="text-emerald-600" />
                <strong>Experience:</strong> 3 years
              </li>
              <li className="flex items-center gap-2">
                <FaIdCard className="text-emerald-600" />
                <strong>User ID:</strong> #U12345
              </li>
            </ul>
          </div>

          {/* User Image (Large screen) */}
          <div className="hidden md:flex flex-col items-center">
            <a href="https://via.placeholder.com/400" target="_blank" rel="noreferrer">
              <img
                src="https://via.placeholder.com/150"
                alt="User"
                className="w-44 h-44 rounded-full object-cover shadow-lg hover:scale-105 transition-transform"
              />
            </a>
            <p className="text-sm text-gray-500 font-bold mt-3">User Image</p>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaIdCard className="text-emerald-600" /> User Documents
          </h2>
          <div className="flex flex-col items-center">
            <a
              href="https://via.placeholder.com/400"
              target="_blank"
              rel="noreferrer"
              className="w-80 md:w-1/2 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all"
            >
              <img
                src="https://via.placeholder.com/400"
                alt="Document"
                className="w-full object-cover"
              />
            </a>
          </div>
        </div>

        {/* Booking Section */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-all shadow-md">
            Book Now
          </button>

          <div className="text-sm text-teal-600 mt-4">
            You should be logged in to Book.{" "}
            <Link className="text-blue-500 hover:underline" to="/signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
