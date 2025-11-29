import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { IoMdDocument } from "react-icons/io";
import { useSelector } from "react-redux";

import { FaUsers } from "react-icons/fa";

import { LuHospital } from "react-icons/lu";
import { MdBloodtype, MdLocalPolice } from "react-icons/md";
import { FaHouseFire } from "react-icons/fa6";

import { PiPoliceCarFill } from "react-icons/pi";
import { MdFireTruck } from "react-icons/md";
import { LuAmbulance } from "react-icons/lu";

export default function DashSideBar() {
  const [isHovered, setIsHovered] = useState(false);
  const DashSideBarWidth = isHovered ? "w-64" : "w-16";
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
    <div
     className={`hidden md:flex flex-col bg-white  transition-all duration-300 ease-in-out ${DashSideBarWidth} min-h-screen`}

      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_the_Red_Cross.svg"
            alt="Logo"
            className="h-6 w-6"
          />
          {isHovered && <span className="font-bold text-lg">Rapid Reach</span>}
        </div>
      </div>

      {isHovered && (
        <div className="flex items-center gap-3 px-4 py-2  rounded-md text-sm font-medium text-gray-700">
          <span>{userRole}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6">
        {isHovered && (
          <p className="px-4 text-xs text-gray-500 mb-1">NAVIGATION</p>
        )}
        <ul className="space-y-1">
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=home"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <HomeIcon className="w-5 h-5" />
                  {isHovered && <span>Dashboard</span>}
                </Link>
              </li>
            </>
          ) : null}

          <li>
            <Link
              to="/dashboard?tab=profile"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
            >
              <CgProfile className="w-5 h-5" />
              {isHovered && <span>Profile</span>}
            </Link>
          </li>
          {!currentUser.isAdmin && (
            <li>
              <Link
                to={`/dashboard?tab=${
                  currentUser?.isHospital ||
                  currentUser?.isFireDep ||
                  currentUser?.isPoliceDep ||
                  currentUser?.isBlood
                    ? "documents"
                    : currentUser?.isPoliceVAn ||
                      currentUser?.isAmbulance ||
                      currentUser?.isFireTruck
                    ? "drive"
                    : ""
                }`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
              >
                <IoMdDocument className="w-5 h-5" />
                {isHovered && <span>Documents</span>}
              </Link>
            </li>
          )}
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=users"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <FaUsers className="w-5 h-5" />
                  {isHovered && <span>Users</span>}
                </Link>
              </li>
            </>
          ) : null}
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=hospital"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <LuHospital className="w-5 h-5" />
                  {isHovered && <span>Hospital</span>}
                </Link>
              </li>
            </>
          ) : null}
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=policeDep"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <MdLocalPolice className="w-5 h-5" />
                  {isHovered && <span>Police Department</span>}
                </Link>
              </li>
            </>
          ) : null}
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=blood"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <MdBloodtype className="w-5 h-5" />
                  {isHovered && <span>Blood Banks</span>}
                </Link>
              </li>
            </>
          ) : null}
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=fire"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <FaHouseFire className="w-5 h-5" />
                  {isHovered && <span>Fire Department</span>}
                </Link>
              </li>
            </>
          ) : null}
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=ambulance"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <LuAmbulance className="w-5 h-5" />
                  {isHovered && <span>Ambulance</span>}
                </Link>
              </li>
            </>
          ) : null}
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=poilcevec"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <PiPoliceCarFill className="w-5 h-5" />
                  {isHovered && <span>Police Vechicle</span>}
                </Link>
              </li>
            </>
          ) : null}
          {currentUser.isAdmin ? (
            <>
              <li>
                <Link
                  to="/dashboard?tab=firetruck"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
                >
                  <MdFireTruck className="w-5 h-5" />
                  {isHovered && <span>Fire Truck</span>}
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
