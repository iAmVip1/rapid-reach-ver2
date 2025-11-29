import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { FaHospital, FaTint, FaShieldAlt, FaFire } from "react-icons/fa";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import StarRating from "../components/StarRating";
import { useCall } from "../socket/CallContext";
import CommentSection from "../components/CommentSection";

// Default Leaflet marker icon (local assets via package)
const defaultIcon = L.icon({
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url
  ).toString(),
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).toString(),
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getCategoryIconElement = (category) => {
  const normalized = (category || "").toLowerCase();
  const size = 25;
  if (normalized.includes("hospital"))
    return <FaHospital size={size} color="#d32f2f" />;
  if (normalized.includes("blood"))
    return <FaTint size={size} color="#b31217" />;
  if (normalized.includes("police"))
    return <FaShieldAlt size={size} color="#1976d2" />;
  if (normalized.includes("fire"))
    return <FaFire size={size} color="#ef6c00" />;
  return <FaHospital size={size} color="#555" />;
};

// Create a pointed (teardrop) marker with the FA icon inside and department name
const makePointedDivIcon = (category, departmentName) => {
  const iconEl = getCategoryIconElement(category);
  const html = `
    <div style="position: relative; width: 40px; height: 40px;">
      <div style="position:absolute; inset:0; background:#ffffff; border:1px solid rgba(0,0,0,0.25); box-shadow:0 2px 4px rgba(0,0,0,0.35); border-radius:50% 50% 50% 0; transform: rotate(-45deg);">
        <div style="position:absolute; top:50%; left:50%; transform: translate(-50%, -50%) rotate(45deg); display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%;">
          ${ReactDOMServer.renderToString(iconEl)}
        </div>
      </div>
    </div>
  `;

  // Department name ABOVE marker now
  const containerHtml = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; white-space: nowrap;">
      <div style="
        margin-bottom: 4px;
        font-weight: 700;
        font-size: 12px;
        color: #000;
        text-align: center;
        background: rgba(255,255,255,0.9);
        padding: 2px 6px;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      ">
        ${departmentName || ""}
      </div>
      ${html}
    </div>
  `;

  return L.divIcon({
    className: "",
    html: containerHtml,
    iconSize: [40, 60],
    iconAnchor: [20, 60],   // adjust anchor since label is on top
    popupAnchor: [0, -70],  // push popup above label
  });
};

export default function Post() {
  const { startCall } = useCall() || {};
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
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

    // Cleanup on unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get/${params.postId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setPost(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.postId]);

  const position = useMemo(() => {
    if (!post) return null;
    const lat = Number(post.latitude);
    const lng = Number(post.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    return null;
  }, [post]);

  const overlayIcon = useMemo(
    () => makePointedDivIcon(post?.category, post?.departmentName),
    [post?.category, post?.departmentName]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">Error loading post</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!post || !position) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xl">Location unavailable</p>
          <p className="text-sm mt-2">This post doesn't have location information</p>
        </div>
      </div>
    );
  } 

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="h-96 md:h-[500px] w-full">
            <MapContainer
              center={position}
              zoom={15}
              className="w-full h-full"
              style={{ zIndex: 1 }} // Lower z-index to prevent covering navbar
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Post Location Marker */}
              <Marker position={position} icon={overlayIcon}>
                <Popup>
                  <div className="flex items-center gap-3">
                    {getCategoryIconElement(post.category)}
                    <div>
                      <div className="font-bold text-gray-800">{post.departmentName}</div>
                      <div className="text-sm text-gray-600">{post.address}</div>
                      {post.category && (
                        <div className="text-sm text-gray-500 mt-1">
                          Category: {post.category}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={L.divIcon({
                    className: "",
                    html: `
                      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; white-space: nowrap;">
                        <div style="
                          margin-bottom: 4px;
                          font-weight: 700;
                          font-size: 12px;
                          color: #000;
                          text-align: center;
                          background: rgba(255,255,255,0.9);
                          padding: 2px 6px;
                          border-radius: 4px;
                          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                        ">
                          ${currentUser?.username || "You"}
                        </div>
                        <div style="position: relative; width: 30px; height: 30px;">
                          <img src="https://cdn-icons-png.flaticon.com/512/64/64113.png" 
                               style="width: 30px; height: 30px; object-fit: contain;" />
                        </div>
                      </div>
                    `,
                    iconSize: [30, 50],
                    iconAnchor: [15, 50],
                    popupAnchor: [0, -60],
                  })}
                >
                  <Popup>
                    <div className="font-bold">You are here</div>
                  </Popup>
                 
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Section - Main Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                  {/* Logo/Image */}
                  <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img
                      src={post.imageUrls}
                      alt={post.departmentName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>

                  {/* Department Info */}
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                      {post.departmentName}
                    </h1>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {post.description}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MdCall className="text-blue-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Primary Phone</p>
                      <p className="font-semibold text-gray-800">{post.phoneNumber1}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaPhoneAlt className="text-blue-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Secondary Phone</p>
                      <p className="font-semibold text-gray-800">{post.phoneNumber2}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-blue-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{post.userMail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-gray-800">{post.address}</p>
                    </div>
                  </div>
                </div>

                {/* Call Button */}
                {currentUser && post.userRef !== currentUser._id && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Call button clicked, post.userRef:", post?.userRef);
                        if (startCall && post?.userRef) {
                          console.log("Starting call to:", post.userRef);
                          startCall(post.userRef);
                        } else {
                          console.log("Cannot start call - missing startCall function or userRef");
                        }
                      }}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <MdCall className="inline mr-2" />
                      Call Now
                    </button>
                  </div>
                )}
              </div>

              {/* Right Section - Additional Info */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Info</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold text-gray-800">{post.category}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-semibold text-gray-800">{post.departmentName}</p>
                    </div>

                    {userLocation && position && (
                      <div>
                        <p className="text-sm text-gray-500">Distance</p>
                        <p className="font-semibold text-gray-800">
                          {calculateDistance(userLocation, position).toFixed(1)} km
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommentSection postId={post._id} />
    </div>
  );
}

// Helper function to calculate distance between two points
function calculateDistance(point1, point2) {
  const R = 6371; // Radius of Earth in km
  const lat1 = point1[0];
  const lon1 = point1[1];
  const lat2 = point2[0];
  const lon2 = point2[1];

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
}
