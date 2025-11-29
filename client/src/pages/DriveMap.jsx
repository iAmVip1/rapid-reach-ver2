import React, { useState, useEffect } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import VechicleMap from "../components/VechicleMap";
import SocketContext from "../socket/SocketContext";

const DriveMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const socket = SocketContext.getSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [category, setCategory] = useState("");
  const [showNearest, setShowNearest] = useState(false);
  const [nearestResults, setNearestResults] = useState([]);
  const [loadingNearest, setLoadingNearest] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);


  // Track online users
  useEffect(() => {
    if (!socket) return;
    if (currentUser?._id) {
      socket.emit("join", { id: currentUser._id, name: currentUser.username });
    }
    const handleOnlineUsers = (users) => setOnlineUsers(users || []);
    socket.on("online-users", handleOnlineUsers);
    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket, currentUser]);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        if (socket && currentUser?._id && Number.isFinite(lat) && Number.isFinite(lng)) {
          socket.emit("location-update", {
            id: currentUser._id,
            name: currentUser.username,
            lat,
            lng,
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, currentUser]);

  // Read search params from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userNameFromUrl = urlParams.get("userName");
    const vechicleNumberFromUrl = urlParams.get("vechicleNumber");
    const categoryFromUrl = urlParams.get("category");
    const nearestFromUrl = urlParams.get("nearest");

    if (userNameFromUrl) {
      setDriverName(userNameFromUrl);
    }
    if (vechicleNumberFromUrl) {
      setVehicleNumber(vechicleNumberFromUrl);
    }
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
    if (nearestFromUrl === "true") {
      setShowNearest(true);
      // Fetch nearest drives when nearest is enabled
      fetchNearestDrives(userNameFromUrl, vechicleNumberFromUrl, categoryFromUrl);
    } else {
      setNearestResults([]);
    }
  }, [location.search]);

  const isOnlineUser = (userId) => onlineUsers.some((u) => u.userId === userId);

  // Haversine distance calculation
  const haversineDistance = (coords1, coords2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
    const lat1 = (coords1.lat * Math.PI) / 180;
    const lat2 = (coords2.lat * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch and calculate nearest drives
  const fetchNearestDrives = async (userName, vechicleNumber, category) => {
    if (!userLocation) {
      // Try to get location once
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Retry after getting location
          setTimeout(() => fetchNearestDrives(userName, vechicleNumber, category), 100);
        },
        (error) => {
          console.error("Error getting location for nearest:", error);
          setLoadingNearest(false);
        }
      );
      return;
    }

    setLoadingNearest(true);
    try {
      const urlParams = new URLSearchParams();
      if (userName) urlParams.set("userName", userName);
      if (vechicleNumber) urlParams.set("vechicleNumber", vechicleNumber);
      if (category) urlParams.set("category", category);

      const res = await fetch(`/api/drive/get?${urlParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch drives");
      const data = await res.json();
      const drives = data.data || [];

      // Match drives with online users to get locations
      const drivesWithLocations = drives
        .filter((drive) => {
          const onlineUser = onlineUsers.find(
            (u) => u && typeof u === "object" && String(u.userId) === String(drive.userRef)
          );
          return (
            onlineUser &&
            Number.isFinite(onlineUser?.lat) &&
            Number.isFinite(onlineUser?.lng)
          );
        })
        .map((drive) => {
          const onlineUser = onlineUsers.find(
            (u) => u && typeof u === "object" && String(u.userId) === String(drive.userRef)
          );
          const driveLocation = {
            lat: onlineUser.lat,
            lng: onlineUser.lng,
          };

          const distance = haversineDistance(userLocation, driveLocation);

          return {
            ...drive,
            lat: onlineUser.lat,
            lng: onlineUser.lng,
            distance,
          };
        })
        .sort((a, b) => a.distance - b.distance);

      setNearestResults(drivesWithLocations);
    } catch (err) {
      console.error("Error fetching nearest drives:", err);
    } finally {
      setLoadingNearest(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const urlParams = new URLSearchParams();
    if (driverName) {
      urlParams.set("userName", driverName);
    }
    if (vehicleNumber) {
      urlParams.set("vechicleNumber", vehicleNumber);
    }
    if (category) {
      urlParams.set("category", category);
    }
    
    navigate(`/drivemap?${urlParams.toString()}`);
  };

  const handleNearest = () => {
    const urlParams = new URLSearchParams(location.search);
    
    // Keep existing search params
    if (driverName) {
      urlParams.set("userName", driverName);
    }
    if (vehicleNumber) {
      urlParams.set("vechicleNumber", vehicleNumber);
    }
    if (category) {
      urlParams.set("category", category);
    }
    
    // Toggle nearest parameter
    if (showNearest) {
      urlParams.delete("nearest");
      setShowNearest(false);
      setNearestResults([]);
    } else {
      urlParams.set("nearest", "true");
      setShowNearest(true);
      // Fetch nearest drives
      fetchNearestDrives(driverName, vehicleNumber, category);
    }
    
    navigate(`/drivemap?${urlParams.toString()}`);
  };

  // Update nearest results when online users change
  useEffect(() => {
    if (showNearest && userLocation) {
      const urlParams = new URLSearchParams(location.search);
      fetchNearestDrives(
        urlParams.get("userName") || driverName,
        urlParams.get("vechicleNumber") || vehicleNumber,
        urlParams.get("category") || category
      );
    }
  }, [onlineUsers, userLocation]);

  return (
    <div className="min-h-screen flex">
      {/* Mobile Toggle Button - Fixed to center vertically */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-1/2 left-0 -translate-y-1/2 bg-pink-600 text-white px-3 py-3 rounded-r-full shadow-lg z-40 lg:hidden hover:bg-pink-700 transition-all duration-300"
          aria-label="Open Menu"
        >
          <MdMenu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar - Fixed within viewport */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-xl p-6 w-80 max-w-[85vw] transform
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-0 lg:w-64 lg:h-screen lg:block lg:z-0 overflow-hidden flex flex-col
          z-50 `}
      >
        {/* Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-600 bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition lg:hidden"
          aria-label="Close Menu"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6 pt-4">
          <h2 className="text-lg font-bold text-gray-900">Search & Filters</h2>
          <p className="text-sm text-gray-500 mt-1">Find emergency vehicles</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-shrink-0">
          {/* Driver Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver Name
            </label>
            <input
              type="text"
              placeholder="Enter driver name..."
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
            />
          </div>

          {/* Vehicle Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Number
            </label>
            <input
              type="text"
              placeholder="Enter vehicle number..."
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
            >
              <option value="">All Categories</option>
              <option value="Ambulance">Ambulance</option>
              <option value="Police Vehicle">Police Vehicle</option>
              <option value="Fire Truck">Fire Truck</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-pink-700 transition shadow-md hover:shadow-lg"
          >
            Search Vehicles
          </button>

          {/* Search Departments */}
          <Link to={"/mapview"}>
          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg"
          >
            Search Departments
          </button>
          </Link>
          {/* Nearest Button */}
          <button
            type="button"
            onClick={handleNearest}
            className={`w-full rounded-lg px-4 py-3 font-semibold transition shadow-md hover:shadow-lg ${
              showNearest
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {showNearest ? "✓ Nearest Active" : "Show Nearest"}
          </button>
        </form>

        {/* Nearest Results Section */}
        {showNearest && (
          <div className="mt-6 flex-1 overflow-hidden">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              Nearest Drivers
            </h3>
            
            <div className="space-y-3 overflow-y-auto h-full max-h-[calc(100vh-500px)] pb-4 pr-2">
              {/* Loading State */}
              {loadingNearest && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              )}

              {/* No Results State */}
              {!loadingNearest && nearestResults.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🔍</div>
                  <p className="text-gray-500 text-sm">No nearby drivers found</p>
                  <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
                </div>
              )}

              {/* Results List */}
              {!loadingNearest && nearestResults.map((drive) => {
                const driverName = `${drive.firstName || ""} ${drive.lastName || ""}`.trim() || drive.userName;
                return (
                  <Link
                    key={drive._id}
                    to={`/drive/${drive._id}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:border-pink-300 hover:shadow-md transition-all duration-200 bg-white no-underline"
                  >
                    <div className="flex items-center gap-3">
                      {/* Driver Info */}
                      <div className="flex-1 min-w-0">
                        {/* Title with Online Status */}
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-800 truncate">
                            {driverName}
                          </h4>
                          {isOnlineUser(drive.userRef) && (
                            <span 
                              className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"
                              title="Online"
                            />
                          )}
                        </div>

                        {/* Vehicle Number and Category */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {drive.category}
                          </span>
                          {typeof drive.distance === "number" &&
                            Number.isFinite(drive.distance) && (
                            <span className="text-xs text-gray-500 font-medium">
                              {drive.distance.toFixed(2)} km
                            </span>
                          )}
                        </div>

                        {/* Vehicle Number */}
                        {drive.vechicleNumber && (
                          <p className="text-xs text-gray-500 mt-1">
                            🚗 {drive.vechicleNumber}
                          </p>
                        )}

                        {/* Address */}
                        {drive.defaultAddress && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            📍 {drive.defaultAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* Backdrop Overlay - Only for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}
      <div className="flex-1">
              <VechicleMap />
            </div>
    </div>
    
  );
};

export default DriveMap;