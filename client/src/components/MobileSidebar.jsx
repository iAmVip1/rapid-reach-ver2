import React, { useEffect, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import SocketContext from "../socket/SocketContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MobileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [results, setResults] = useState([]); // store fetched results
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  // socket: track online users similar to Home.jsx
  useEffect(() => {
    const socket = SocketContext.getSocket();
    const handleOnlineUsers = (users) => setOnlineUsers(users || []);
    socket.on("online-users", handleOnlineUsers);
    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  const isOnlineUser = (userId) => onlineUsers.some((u) => u.userId === userId);

  // Handle Submit (search button / enter key)
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1) Update the /mapview URL query so the main map (ShowMap) fetches the same filters
    const urlParams = new URLSearchParams(location.search);
    if (search) {
      urlParams.set("departmentName", search);
    } else {
      urlParams.delete("departmentName");
    }
    if (category) {
      urlParams.set("category", category);
    } else {
      urlParams.delete("category");
    }
    navigate(`/mapview?${urlParams.toString()}`);

    // 2) Still show results list in the sidebar (optional preview)
    setHasSearched(true);
    setLoading(true);
    setError("");
    setResults([]); // reset previous results

    const fetchPosts = async () => {
      try {
        const query = new URLSearchParams({
          departmentName: search,
          category,
        }).toString();

        const res = await fetch(`/api/post/get?${query}`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const data = await res.json();
        const rawList = Array.isArray(data) ? data : data?.data || [];

        const normalized = rawList.map((post, index) => ({
          _id: post._id || post.id || String(index),
          image:
            (post.imageUrls && post.imageUrls[0]) ||
            post.image ||
            "/placeholder.jpg",
          name: post.departmentName || post.title || post.name || "Unknown",
          category: post.category || "",
          phone:
            post.phoneNumber1 ||
            post.phone ||
            post.contactNumber ||
            post.tel ||
            "",
          latitude: post.latitude,
          longitude: post.longitude,
          userRef: post.userRef,
          isAvailable: isOnlineUser(post.userRef),
        }));

        let finalResults = normalized;

        // Filter by availability
        if (sortBy === "available") {
          finalResults = finalResults.filter((p) => p.isAvailable);
        }

        // Sort by nearest using Haversine (just like GridView)
        if (sortBy === "nearest" && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const userCoords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };

              const haversineDistance = (coords1, coords2) => {
                const R = 6371;
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

              const sortedResults = finalResults
                .map((post) => {
                  const hasCoords =
                    typeof post.latitude === "number" &&
                    typeof post.longitude === "number";
                  return {
                    ...post,
                    distance: hasCoords
                      ? haversineDistance(userCoords, {
                          lat: post.latitude,
                          lng: post.longitude,
                        })
                      : Infinity,
                  };
                })
                .sort((a, b) => a.distance - b.distance);

              setResults(sortedResults);
              setLoading(false);
            },
            (err) => {
              console.warn("Geolocation failed:", err);
              setResults(finalResults);
              setLoading(false);
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
          );
          return; // exit early so we don't overwrite setResults
        }

        // Default: no nearest sorting
        setResults(finalResults);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching:", err);
        setError(err.message || "Failed to load results");
        setLoading(false);
      }
    };

    fetchPosts();
  };

  return (
    <>
      {/* Toggle Button (only visible on mobile) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-1/2 left-0 -translate-y-1/2 bg-pink-600 text-white px-3 py-2 rounded-r-full shadow-lg z-40 lg:hidden hover:bg-pink-700 transition"
          aria-label="Open Menu"
        >
          <MdMenu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-r-xl shadow-lg p-6 w-72 sm:w-80 max-w-[85vw] lg:w-64 transform z-50
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:sticky lg:top-0 lg:w-64 lg:block lg:h-screen overflow-hidden flex flex-col min-h-0 md:overflow-y-auto`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-700 bg-white shadow rounded-lg p-2 hover:bg-gray-100 transition lg:hidden"
          aria-label="Close Menu"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        <h2 className="text-sm font-semibold text-gray-900 uppercase mb-5">
          Filters
        </h2>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-4 shrink-0">
          {/* Search Bar */}
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            >
              <option value="">Select Category</option>
              <option value="Hospital">Hospital</option>
              <option value="Police Department">Police Department</option>
              <option value="Fire Department">Fire Department</option>
              <option value="Blood Bank">Blood Bank</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            >
              <option value="">Select</option>
              <option value="nearest">Nearest</option>
              <option value="available">Available</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white rounded-lg px-3 py-2 font-semibold hover:bg-pink-700 transition"
          >
            Search
          </button>

          {/* Submit Vehicles */}
          <Link to={"/drivemap"}>
          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded-lg px-3 py-2 font-semibold hover:bg-green-700 transition"
            >
            Search Vehicles
          </button>
            </Link>
        </form>

        {/* Results Preview */}
        <div className="mt-6 space-y-4 overflow-y-auto flex-1 min-h-0 pr-1 scroll-smooth [-webkit-overflow-scrolling:touch] md:max-h-[calc(100vh-400px)] md:overflow-y-auto">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}

          {!loading && error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && hasSearched && !error && results.length === 0 && (
            <p className="text-sm text-gray-400">No results found.</p>
          )}

          {results.map((item) => (
            <div
              key={item._id}
              
            >
              <Link to={`/post/${item._id}`} className="flex items-center gap-3 border rounded-lg p-2 shadow-sm hover:shadow-md transition">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  {item.name}
                  {isOnlineUser(item.userRef) && (
                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block flex-shrink-0"></span>
                  )}
                </h3>
                <p className="text-xs text-gray-500">
                  {item.category}
                  {typeof item.distance === "number" &&
                    Number.isFinite(item.distance) && (
                      <span className="ml-2 text-gray-400">
                        {item.distance.toFixed(2)} km
                      </span>
                    )}
                </p>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default MobileSidebar;
