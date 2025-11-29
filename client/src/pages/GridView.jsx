import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar, FaGasPump } from "react-icons/fa";
import { data, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Hospital from "../../../for uploading/hospital.jpg";
import MapImage from "../../../for uploading/map.jpg";
import PostItem from "../components/PostItem";
import SocketContext from "../socket/SocketContext";
import StarRating from "../components/StarRating";

export default function GridView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = SocketContext.getSocket();

  const [filters, setFilters] = useState({
    departmentName: "",
    address: "",
    category: "",
    availability: "",
  });
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [bestServices, setBestServices] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

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

  const haversineDistance = (coords1, coords2) => {
    const R = 6371;
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

    return R * c;
  };

  const calculatePriorityScore = (post, isOnline, userCoords = null) => {
    let score = 0;
    const maxScore = 5.0;

    if (isOnline) {
      score += 1.5;
    }

    if (post.approved) {
      score += 1.25;
    }

    const daysSinceCreation =
      (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation <= 30) {
      score += 1.0 * (1 - daysSinceCreation / 30);
    } else if (daysSinceCreation <= 90) {
      score += 0.5 * (1 - (daysSinceCreation - 30) / 60);
    }

    if (userCoords && post.latitude && post.longitude) {
      const distance = haversineDistance(userCoords, {
        lat: post.latitude,
        lng: post.longitude,
      });

      if (distance <= 10) {
        score += 0.75;
      } else if (distance <= 50) {
        score += 0.75 * (1 - (distance - 10) / 40);
      }
    }

    const categoryPriority = {
      Hospital: 0.5,
      "Fire Department": 0.5,
      "Police Department": 0.5,
      "Blood Bank": 0.4,
      Ambulance: 0.4,
      "Fire Truck": 0.3,
      "Police Vehicle": 0.3,
    };
    score += categoryPriority[post.category] || 0.2;

    return Math.min(score, maxScore);
  };

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

  useEffect(() => {
    if (posts.length === 0) {
      setBestServices([]);
      return;
    }

    const postsWithScores = posts
      .filter((post) => post.approved)
      .map((post) => {
        let distance = null;
        if (userLocation && post.latitude && post.longitude) {
          distance = haversineDistance(userLocation, {
            lat: post.latitude,
            lng: post.longitude,
          }).toFixed(2);
        }
        return {
          ...post,
          priorityScore: calculatePriorityScore(
            post,
            isOnlineUser(post.userRef),
            userLocation
          ),
          distance,
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 3);

    setBestServices(postsWithScores);
  }, [posts, onlineUsers, userLocation]);

  useEffect(() => {
    let filtered = [...posts];

    if (filters.availability === "available") {
      filtered = filtered.filter((post) => isOnlineUser(post.userRef));
    } else if (filters.availability === "unavailable") {
      filtered = filtered.filter((post) => !isOnlineUser(post.userRef));
    }

    setFilteredPosts(filtered);
  }, [posts, filters.availability, onlineUsers]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const departmentNameFromUrl = urlParams.get("departmentName");
    const addressFromUrl = urlParams.get("address");
    const categoryFromUrl = urlParams.get("category");

    if (departmentNameFromUrl || addressFromUrl || categoryFromUrl) {
      setFilters({
        departmentName: departmentNameFromUrl || "",
        address: addressFromUrl || "",
        category: categoryFromUrl || "",
        availability: "",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      setShowMore(false);

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/get?${searchQuery}`);
      const data = await res.json();
      console.log("Fetched posts:", data);
      if (data.data?.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setPosts(data.data || []);
      setLoading(false);
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (filters.departmentName) {
      urlParams.set("departmentName", filters.departmentName);
    }
    if (filters.address) {
      urlParams.set("address", filters.address);
    }
    if (filters.category) {
      urlParams.set("category", filters.category);
    }
    navigate(`/gridview?${urlParams.toString()}`);
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

          const sortedPosts = [...filteredPosts]
            .map((post) => {
              const distance = haversineDistance(userCoords, {
                lat: post.latitude,
                lng: post.longitude,
              });
              return { ...post, distance: distance.toFixed(2) }; // Attach distance to each post
            })
            .sort((a, b) => a.distance - b.distance); // Sort by distance

          setFilteredPosts(sortedPosts); // Update state with sorted posts
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location.");
        }
      );
    }

    if (value === "latest") {
      setFilteredPosts(
        [...filteredPosts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    }

    if (value === "oldest") {
      setFilteredPosts(
        [...filteredPosts].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      );
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-zinc-800 min-h-screen">
      {/* Search Bar */}

      <div className="bg-white dark:bg-zinc-700 shadow-sm py-4 px-6 flex flex-wrap gap-4 justify-between max-w-7xl mx-auto mt-4 rounded-lg">
        <input
          type="text"
          id="departmentName"
          placeholder="Name"
          className="border p-2 rounded w-64"
          value={filters.departmentName}
          onChange={handleChange}
        />
        <input
          type="text"
          id="address"
          placeholder="Address"
          className="border p-2 rounded w-64"
          value={filters.address}
          onChange={handleChange}
        />

        <select
          id="availability"
          className="border p-2 rounded w-56 dark:bg-zinc-700"
          value={filters.availability}
          onChange={handleChange}
        >
          <option value="">Services Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <select
          className="border p-2 rounded w-56 dark:bg-zinc-700"
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
          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow p-4">
            <div className="h-48 bg-gray-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
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
          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Filter</h2>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="font-medium mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                <Link to={"/gridview?category=Hospital"}>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm cursor-pointer">
                    Hospital
                  </span>
                </Link>
                <Link to={"/gridview?category=Blood+Bank"}>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm cursor-pointer">
                    Blood Bank
                  </span>
                </Link>
                <Link to={"/gridview?category=Police+Department"}>
                  <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-sm cursor-pointer">
                    Police Department
                  </span>
                </Link>
                <Link to={"/gridview?category=Fire+Department"}>
                  <span className="px-3 py-1 bg-red-100 text-orange-700 rounded-full text-sm cursor-pointer">
                    Fire Department
                  </span>
                </Link>
                <Link to={"/vehiclegrid?category=ambulance"}>
                  <span className="px-3 py-1 bg-red-100 text-orange-700 rounded-full text-sm cursor-pointer">
                    Ambulance
                  </span>
                </Link>
                <Link to={"/vehiclegrid?category=fire-truck"}>
                  <span className="px-3 py-1 bg-amber-200 text-amber-700 rounded-full text-sm cursor-pointer">
                    Fire Truck
                  </span>
                </Link>
                <Link to={"/vehiclegrid?category=police-vehicle"}>
                  <span className="px-3 py-1 bg-cyan-200 text-cyan-700 rounded-full text-sm cursor-pointer">
                    Police Vehicle
                  </span>
                </Link>
              </div>
            </div>

            {/* Category */}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Best Services - Priority Scoring */}
          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Best Service For You</h2>
            {bestServices.length === 0 ? (
              <p className=" text-center py-8">
                No services available yet. Check back soon!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bestServices.map((service, index) => (
                  <Link
                    key={service._id}
                    to={`/post/${service._id}`}
                    className="bg-white dark:bg-zinc-600 shadow-md hover:shadow-lg cursor-pointer transition-shadow overflow-hidden rounded-lg w-full max-w-[300px] mx-auto"
                  >
                    <img
                      src={service.imageUrls?.[0] || Hospital}
                      alt={service.departmentName}
                      className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                    />
                    <div className="p-3 flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold truncate flex-1">
                          {service.departmentName}
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
                        <p className="text-xs truncate">
                          {service.address}
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
                          <span className="text-xs ">
                            {service.distance} km
                          </span>
                        )}
                      </div>
                      <p className="text-xs  mt-1">
                        {service.category}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
            {/* Other posts */}
            {!loading && filteredPosts.length === 0 && (
              <p className="text-xl ">No Services found !!</p>
            )}
            {loading && (
              <p className="text-xl text-center w-full">Loading...</p>
            )}
            {!loading &&
              filteredPosts &&
              filteredPosts.map((post) => (
                <PostItem
                  key={post._id}
                  post={post}
                  isOnline={isOnlineUser(post.userRef)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
