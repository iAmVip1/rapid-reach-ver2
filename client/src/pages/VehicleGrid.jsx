import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaAmbulance, FaShieldAlt, FaFire } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MapImage from "../../../for uploading/map.jpg";
import VehicleItem from "../components/VehicleItem";
import SocketContext from "../socket/SocketContext";
import StarRating from "../components/StarRating";

export default function VehicleGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = SocketContext.getSocket();

  const [filters, setFilters] = useState({
    userName: "",
    defaultAddress: "",
    vehicleType: "",
    availability: "",
  });
  const [loading, setLoading] = useState(false);
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [bestServices, setBestServices] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Join socket and listen for online users
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

  const isOnlineUser = (userId) => onlineUsers.some((u) => u.userId === userId);

  // Get online user's location if available
  const getOnlineUserLocation = (userId) => {
    const onlineUser = onlineUsers.find((u) => u.userId === userId);
    if (onlineUser && onlineUser.lat && onlineUser.lng) {
      return {
        lat: onlineUser.lat,
        lng: onlineUser.lng,
      };
    }
    return null;
  };

  const haversineDistance = (coords1, coords2) => {
    const R = 6371; // Earth's radius in kilometers
    const lat1 = coords1.lat;
    const lon1 = coords1.lng;
    const lat2 = coords2.lat;
    const lon2 = coords2.lng;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  // Calculate priority score for drives
  const calculatePriorityScore = (drive, isOnline, userCoords = null) => {
    let score = 0;
    const maxScore = 5.0;

    // Online status bonus
    if (isOnline) {
      score += 1.5;
    }

    // Approved status bonus
    if (drive.approved) {
      score += 1.25;
    }

    // Recency bonus
    const daysSinceCreation = (Date.now() - new Date(drive.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation <= 30) {
      score += 1.0 * (1 - daysSinceCreation / 30);
    } else if (daysSinceCreation <= 90) {
      score += 0.5 * (1 - (daysSinceCreation - 30) / 60);
    }

    // Distance bonus (if user location and drive location available)
    if (userCoords) {
      const driveLocation = getOnlineUserLocation(drive.userRef);
      if (driveLocation) {
        const distance = haversineDistance(userCoords, driveLocation);
        if (distance <= 10) {
          score += 0.75;
        } else if (distance <= 50) {
          score += 0.75 * (1 - (distance - 10) / 40);
        }
      }
    }

    // Vehicle type priority
    const vehicleTypePriority = {
      ambulance: 0.5,
      "police-vehicle": 0.4,
      "fire-truck": 0.4,
    };
    score += vehicleTypePriority[filters.vehicleType] || 0.2;

    return Math.min(score, maxScore);
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location access denied or unavailable");
        }
      );
    }
  }, []);

  // Calculate best services based on priority scoring
  useEffect(() => {
    if (drives.length === 0) {
      setBestServices([]);
      return;
    }

    const drivesWithScores = drives
      .filter((drive) => drive.approved)
      .map((drive) => {
        let distance = null;
        const driveLocation = getOnlineUserLocation(drive.userRef);
        if (userLocation && driveLocation) {
          distance = haversineDistance(userLocation, driveLocation).toFixed(2);
        }
        return {
          ...drive,
          priorityScore: calculatePriorityScore(
            drive,
            isOnlineUser(drive.userRef),
            userLocation
          ),
          distance,
          vehicleType: filters.vehicleType || "vehicle",
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 3);

    setBestServices(drivesWithScores);
  }, [drives, onlineUsers, userLocation, filters.vehicleType]);

  // Filter drives by availability
  useEffect(() => {
    let filtered = [...drives];

    if (filters.availability === "available") {
      filtered = filtered.filter((drive) => isOnlineUser(drive.userRef));
    } else if (filters.availability === "unavailable") {
      filtered = filtered.filter((drive) => !isOnlineUser(drive.userRef));
    }

    // Ensure vehicleType is preserved on filtered drives
    const filteredWithType = filtered.map((drive) => ({
      ...drive,
      vehicleType: drive.vehicleType || filters.vehicleType || "vehicle",
    }));

    setFilteredDrives(filteredWithType);
  }, [drives, filters.availability, filters.vehicleType, onlineUsers]);

  // Fetch drives based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userNameFromUrl = urlParams.get("userName");
    const defaultAddressFromUrl = urlParams.get("defaultAddress");
    const vehicleTypeFromUrl = urlParams.get("vehicleType");

    if (userNameFromUrl || defaultAddressFromUrl || vehicleTypeFromUrl) {
      setFilters({
        userName: userNameFromUrl || "",
        defaultAddress: defaultAddressFromUrl || "",
        vehicleType: vehicleTypeFromUrl || "",
        availability: "",
      });
    }

    const fetchDrives = async () => {
      setLoading(true);
      setShowMore(false);

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/drive/get?${searchQuery}`);
      const data = await res.json();
      console.log("Fetched drives:", data);
      if (data.data?.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      // Add vehicleType to each drive based on current filter or URL parameter
      const currentVehicleType = vehicleTypeFromUrl || filters.vehicleType || "";
      const drivesWithType = (data.data || []).map((drive) => ({
        ...drive,
        vehicleType: currentVehicleType || "vehicle",
      }));

      setDrives(drivesWithType);
      setLoading(false);
    };

    fetchDrives();
  }, [location.search, filters.vehicleType]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (filters.userName) {
      urlParams.set("userName", filters.userName);
    }
    if (filters.defaultAddress) {
      urlParams.set("defaultAddress", filters.defaultAddress);
    }
    if (filters.vehicleType) {
      urlParams.set("vehicleType", filters.vehicleType);
    }
    navigate(`/vehiclegrid?${urlParams.toString()}`);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);

    if (value === "nearest") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const sortedDrives = [...filteredDrives]
            .map((drive) => {
              const driveLocation = getOnlineUserLocation(drive.userRef);
              if (driveLocation) {
                const distance = haversineDistance(userCoords, driveLocation);
                return { ...drive, distance: distance.toFixed(2) };
              }
              return { ...drive, distance: null };
            })
            .sort((a, b) => {
              if (a.distance === null) return 1;
              if (b.distance === null) return -1;
              return parseFloat(a.distance) - parseFloat(b.distance);
            });

          setFilteredDrives(sortedDrives);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location.");
        }
      );
    }

    if (value === "latest") {
      setFilteredDrives(
        [...filteredDrives].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    }

    if (value === "oldest") {
      setFilteredDrives(
        [...filteredDrives].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      );
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case "ambulance":
        return <FaAmbulance className="text-red-600" />;
      case "police-vehicle":
        return <FaShieldAlt className="text-blue-600" />;
      case "fire-truck":
        return <FaFire className="text-orange-600" />;
      default:
        return null;
    }
  };

  const getVehicleLabel = (type) => {
    switch (type) {
      case "ambulance":
        return "Ambulance";
      case "police-vehicle":
        return "Police Vehicle";
      case "fire-truck":
        return "Fire Truck";
      default:
        return "Vehicle";
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white shadow-sm py-4 px-6 flex flex-wrap gap-4 justify-between max-w-7xl mx-auto mt-4 rounded-lg">
        <input
          type="text"
          id="userName"
          placeholder="Driver Name"
          className="border p-2 rounded w-64"
          value={filters.userName}
          onChange={handleChange}
        />
        <input
          type="text"
          id="defaultAddress"
          placeholder="Address"
          className="border p-2 rounded w-64"
          value={filters.defaultAddress}
          onChange={handleChange}
        />

        <select
          id="availability"
          className="border p-2 rounded w-56"
          value={filters.availability}
          onChange={handleChange}
        >
          <option value="">Service Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <select
          className="border p-2 rounded w-56"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="">Sort By</option>
          <option value="nearest">Nearest</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 mt-6 px-4 lg:px-0">
        {/* Left Column - Visible on all devices */}
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
              <button className="mt-3 w-full border rounded-lg py-2">
                Show Full Map
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Filter</h2>
            </div>

            {/* Vehicle Type Filters */}
             <div>
                          <h3 className="font-medium mb-2">Category</h3>
                          <div className="flex flex-wrap gap-2">
                             <Link to={'/gridview?category=Hospital'}>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm cursor-pointer">
                              Hospital
                            </span>
                             </Link>
                             <Link to={'/gridview?category=Blood+Bank'}>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm cursor-pointer">
                              Blood Bank
                            </span>
                             </Link>
                              <Link to={'/gridview?category=Police+Department'}>
                            <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-sm cursor-pointer">
                              Police Department
                            </span>  
                              </Link>
                            <Link to={'/gridview?category=Fire+Department'}>
                            <span className="px-3 py-1 bg-gray-300 text-black rounded-full text-sm cursor-pointer">
                              Fire Department
                            </span>
                            </Link>
                            <Link to={'/vehiclegrid?category=ambulance'}>
                            <span className="px-3 py-1 bg-red-100 text-orange-700 rounded-full text-sm cursor-pointer">
                              Ambulance
                            </span>
                            </Link>
                            <Link to={'/vehiclegrid?category=fire-truck'}>
                            <span className="px-3 py-1 bg-amber-200 text-amber-700 rounded-full text-sm cursor-pointer">
                              Fire Truck
                            </span>
                            </Link>
                            <Link to={'/vehiclegrid?category=police-vehicle'}>
                            <span className="px-3 py-1 bg-cyan-200 text-cyan-700 rounded-full text-sm cursor-pointer">
                              Police Vehicle
                            </span>
                            </Link>
                          </div>
                        </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Best Services - Priority Scoring */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Best Service For You</h2>
            {bestServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No services available yet. Check back soon!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bestServices.map((service) => (
                  <Link
                    key={service._id}
                    to={`/drive/${service._id}`}
                    className="bg-white shadow-md hover:shadow-lg cursor-pointer transition-shadow overflow-hidden rounded-lg w-full max-w-[300px] mx-auto"
                  >
                    <img
                      src={service.userImage || "https://via.placeholder.com/300x220"}
                      alt={`${service.firstName} ${service.lastName}`}
                      className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                    />
                    <div className="p-3 flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold truncate flex-1">
                          {service.userName}
                        </p>
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            isOnlineUser(service.userRef)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          title={
                            isOnlineUser(service.userRef)
                              ? "Available"
                              : "Unavailable"
                          }
                        ></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="h-3 w-3 text-green-700 flex-shrink-0" />
                        <p className="text-xs text-gray-600 truncate">
                          {service.defaultAddress}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <StarRating
                          rating={service.priorityScore}
                          displayOnly={true}
                          size="w-5 h-5"
                          totalStars={5}
                        />
                        {service.distance && (
                          <span className="text-xs text-gray-500">
                            {service.distance} km
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getVehicleLabel(service.vehicleType)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
            {/* Other drives */}
            {!loading && filteredDrives.length === 0 && (
              <p className="text-xl">No Vehicles found !!</p>
            )}
            {loading && (
              <p className="text-xl text-center w-full">Loading...</p>
            )}
            {!loading &&
              filteredDrives &&
              filteredDrives.map((drive) => {
                // Ensure vehicleType is set for each drive
                const driveWithType = {
                  ...drive,
                  vehicleType: drive.vehicleType || filters.vehicleType || "vehicle",
                };
                return (
                  <VehicleItem
                    key={drive._id}
                    drive={driveWithType}
                    isOnline={isOnlineUser(drive.userRef)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
