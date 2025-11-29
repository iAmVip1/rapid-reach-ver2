import React from "react";
import {
  FaAmbulance,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaFire,
  FaCar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function VehicleItem({ drive, isOnline = false }) {
  // Determine vehicle type based on drive data or user role
  // This will be determined by which endpoint returned this drive
  const getVehicleType = () => {
    // If we have vehicle type info, use it
    if (drive.vehicleType) {
      return drive.vehicleType;
    }
    // Otherwise, we can infer from other data if needed
    return "vehicle";
  };

  const vehicleType = drive.category || "vehicle";

  const vehicleIcons = {
    ambulance: {
      icon: <FaAmbulance />,
      label: "Ambulance",
      color: "text-red-600",
    },
    "police-vehicle": {
      icon: <FaShieldAlt />,
      label: "Police Vehicle",
      color: "text-blue-600",
    },
    "fire-truck": {
      icon: <FaFire />,
      label: "Fire Truck",
      color: "text-orange-600",
    },
    vehicle: {
      icon: <FaCar />,
      label: "Vehicle",
      color: "text-gray-600",
    },
  };

  const vehicleIcon = vehicleIcons[vehicleType] || vehicleIcons.vehicle;

  // Use userImage as the main image, fallback to license image or default
  const displayImage = drive.userImage || 
    (drive.licenseUrls && drive.licenseUrls[0]) || 
    "https://via.placeholder.com/300x220";

  return (
    <div className="bg-white dark:bg-zinc-600 shadow-md hover:shadow-lg cursor-pointer transition-shadow overflow-hidden rounded-lg w-full max-w-[300px] mx-auto">
      <Link to={`/drive/${drive._id}`}>
        <img
          src={displayImage}
          alt={`${drive.firstName} ${drive.lastName}`}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold truncate">
              {drive.userName}
            </p>
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
              title={isOnline ? "Available" : "Unavailable"}
            ></div>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="h-4 w-4 text-green-700" />
            <p className="text-sm font-semibold truncate w-full">
              {drive.defaultAddress}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Vehicle:</span>
            <span className="truncate">{drive.vechicleNumber}</span>
          </div>
          <div className="text-slate-700 flex flex-wrap gap-4 dark:text-gray-200">
            <div className="font-bold text-xs">
              <p
                className={`flex items-center gap-2 whitespace-nowrap ${vehicleIcon.color}`}
              >
                {vehicleIcon.icon} {vehicleIcon.label}
              </p>

              {/* Display the distance if available */}
              {drive.distance && (
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-200">
                  Distance: {drive.distance} km
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-200">
            <span>Company: {drive.company}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
