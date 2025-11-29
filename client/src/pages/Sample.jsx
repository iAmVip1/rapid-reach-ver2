import React, { useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Hospital from "../../../for uploading/hospital.jpg";
import MapImage from "../../../for uploading/map.jpg";

export default function GridViewUI() {
  const [sortOption, setSortOption] = useState("");
  const [filters, setFilters] = useState({
    departmentName: "",
    address: "",
    category: "",
    availability: "",
  });

  const dummyServices = [
    {
      id: 1,
      name: "City Hospital",
      address: "Downtown Street 21",
      category: "Hospital",
      image: Hospital,
      status: "available",
      distance: "2.4 km",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Police Department HQ",
      address: "Main Avenue",
      category: "Police Department",
      image: Hospital,
      status: "unavailable",
      distance: "4.1 km",
      rating: 4.2,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white shadow-sm py-4 px-6 flex flex-wrap gap-4 justify-between max-w-7xl mx-auto mt-4 rounded-lg">
        <input
          type="text"
          id="departmentName"
          placeholder="Name"
          className="border p-2 rounded w-64"
          value={filters.departmentName}
          onChange={(e) => setFilters({ ...filters, departmentName: e.target.value })}
        />
        <input
          type="text"
          id="address"
          placeholder="Address"
          className="border p-2 rounded w-64"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />

        <select
          id="availability"
          className="border p-2 rounded w-56"
          value={filters.availability}
          onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
        >
          <option value="">Services Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <select
          className="border p-2 rounded w-56"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="nearest">Nearest</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Search
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 mt-6 px-4 lg:px-0">
        {/* Left Column */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={MapImage}
                alt="Map"
                className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
              />
            </div>
            <Link to="/mapView">
              <button className="mt-3 w-full border rounded-lg py-2 hover:bg-gray-100">
                Show Full Map
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Filter</h2>
            </div>

            <div>
              <h3 className="font-medium mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                <Link to="#">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm cursor-pointer">
                    Hospital
                  </span>
                </Link>
                <Link to="#">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm cursor-pointer">
                    Blood Bank
                  </span>
                </Link>
                <Link to="#">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm cursor-pointer">
                    Police Department
                  </span>
                </Link>
                <Link to="#">
                  <span className="px-3 py-1 bg-red-100 text-orange-700 rounded-full text-sm cursor-pointer">
                    Fire Department
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Best Services */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Best Service For You</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dummyServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white shadow-md hover:shadow-lg cursor-pointer transition-shadow overflow-hidden rounded-lg"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate">
                        {service.name}
                      </p>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          service.status === "available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="h-3 w-3 text-green-700" />
                      <p className="text-xs text-gray-600 truncate">
                        {service.address}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-1 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(service.rating)
                                ? "fill-yellow-400"
                                : "fill-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {service.distance}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {service.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Services */}
          <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dummyServices.map((service) => (
              <div
                key={service.id}
                className="bg-white shadow-md hover:shadow-lg cursor-pointer transition-shadow overflow-hidden rounded-lg"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 flex flex-col gap-2">
                  <p className="text-sm font-semibold truncate">{service.name}</p>
                  <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                    <FaMapMarkerAlt className="text-green-700 h-3 w-3" />{" "}
                    {service.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(service.rating)
                              ? "fill-yellow-400"
                              : "fill-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {service.distance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
