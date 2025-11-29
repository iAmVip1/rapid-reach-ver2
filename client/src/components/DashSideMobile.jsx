import React from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashSideMobile({ isOpen, onClose }) {
  const { currentUser } = useSelector((state) => state.user);


  let userRole = "";

if (currentUser?.isAdmin) {
  userRole = "Admin";
} else if (currentUser?.isHospital) {
  userRole = "Hospital";
} else if (currentUser?.isFireDep) {
  userRole = "Fire Department";
} else if (currentUser?.isPoliceDep) {
  userRole = "Police Department";
} else if (currentUser?.isBlood) {
  userRole = "Blood Bank";
} else if (currentUser?.isPoliceVAn) {
  userRole = "Police Vehicle";
} else if (currentUser?.isAmbulance) {
  userRole = "Ambulance";
} else if (currentUser?.isFireTruck) {
  userRole = "Fire Truck";
}

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gradient-to-r from-emerald-400 to-cyan-400 text-white z-50 p-4 
        transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        {/* Header with X */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Navigation</h1>
          <button
            type="button"
            className="text-white text-xl"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Search Box */}
          <div className="font-bold">{userRole}</div>
        {/* Static Menu Items */}
        <ul className="space-y-3">
          <li>
            <Link
              to="/dashboard?tab=profile"
              className="block bg-gray-100 p-2 rounded-md text-black hover:bg-gray-200"
              onClick={onClose} // optional: close sidebar after click
            >
              Profile
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard?tab=documents"
              className="block bg-gray-100 p-2 rounded-md text-black hover:bg-gray-200"
              onClick={onClose}
            >
              Documents
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
