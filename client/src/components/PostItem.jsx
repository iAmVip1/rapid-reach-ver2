import React from "react";
import {
  FaHospital,
  FaMapMarkerAlt,
  FaTint,
  FaShieldAlt,
  FaFire,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PostItem({ post, isOnline = false }) {
  const categoryIcons = {
    Hospital: {
      icon: <FaHospital />,
      label: "Hospital",
      color: "text-green-600",
    },
    "Blood Bank": {
      icon: <FaTint />,
      label: "Blood Bank",
      color: "text-red-600",
    },
    "Police Department": { 
      icon: <FaShieldAlt />, 
      label: "Police Department", 
      color: "text-blue-600" 
    },
    "Fire Department": {
      icon: <FaFire />,
      label: "Fire Department",
      color: "text-orange-500",
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-600 shadow-md hover:shadow-lg cursor-pointer transition-shadow overflow-hidden rounded-lg w-full max-w-[300px] mx-auto">
      <Link to={`/post/${post._id}`}>
        <img
          src={post.imageUrls[0]}
          alt="Cover Image"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold truncate">
              {post.departmentName}
            </p>
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={isOnline ? 'Available' : 'Unavailable'}></div>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="h-4 w-4 text-green-700" />
            <p className="text-sm font-semibold truncate w-full">
              {post.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-200">
            {post.description}
          </p>
          <div className="text-slate-700 flex flex-wrap gap-4">
            <div className="font-bold text-xs">
              {categoryIcons[post.category] && (
                <p
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    categoryIcons[post.category].color
                  }`}
                >
                  {categoryIcons[post.category].icon}{" "}
                  {categoryIcons[post.category].label}
                </p>
              )}

              {/* Display the distance if available */}
              {post.distance && (
                <p className="text-sm text-gray-500 dark:text-gray-200">
                  Distance: {post.distance} km
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
