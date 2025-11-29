import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { FaCar, FaAmbulance, FaShieldAlt, FaFire } from "react-icons/fa";
import SocketContext from "../socket/SocketContext";

// Get vehicle type icon based on category
const getVehicleIconElement = (category) => {
  const normalized = (category || "").toLowerCase();
  const size = 25;
  if (normalized.includes("ambulance")) {
    return <FaAmbulance size={size} color="#10b981" />;
  } else if (normalized.includes("police")) {
    return <FaShieldAlt size={size} color="#1976d2" />;
  } else if (normalized.includes("fire")) {
    return <FaFire size={size} color="#ef6c00" />;
  }
  return <FaCar size={size} color="#555" />;
};

// Div icon for marker - pointed teardrop style with driver/vehicle name
const makeVehicleDivIcon = (category, driverName) => {
  const iconEl = getVehicleIconElement(category);
  const html = `
    <div style="position: relative; width: 40px; height: 40px;">
      <div style="position:absolute; inset:0; background:#ffffff; border:1px solid rgba(0,0,0,0.25); box-shadow:0 2px 4px rgba(0,0,0,0.35); border-radius:50% 50% 50% 0; transform: rotate(-45deg);">
        <div style="position:absolute; top:50%; left:50%; transform: translate(-50%, -50%) rotate(45deg); display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%;">
          ${ReactDOMServer.renderToString(iconEl)}
        </div>
      </div>
    </div>
  `;
  
  // Create container with pointer and driver name
  const containerHtml = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; white-space: nowrap;">
      
      <div style="
        margin-top: 4px;
        font-weight: 700;
        font-size: 12px;
        color: #000;
        text-align: center;
        background: rgba(255,255,255,0.9);
        padding: 2px 6px;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      ">
        ${driverName || ""}
      </div>
      ${html}
    </div>
  `;
  
  return L.divIcon({
    className: "",
    html: containerHtml,
    iconSize: [40, 60], // height increased for driver name
    iconAnchor: [20, 40], // point the tip to the exact location
    popupAnchor: [0, -60], // popup above marker + driver name
  });
};

// Helper for user/other-user location marker icon (same style as ShowMap/Post)
const makeUserLocationIcon = (username) =>
  L.divIcon({
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
          ${username || "You"}
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
  });

// Helper component to fit map to markers around user location
function FitBounds({ userLocation }) {
  const map = useMap();
  const [initialZoomSet, setInitialZoomSet] = useState(false);

  useEffect(() => {
    if (!userLocation) return;

    const zoomLevel = 15;
    if (!initialZoomSet) {
      map.setView(userLocation, zoomLevel);
      setInitialZoomSet(true);
    } else {
      map.panTo(userLocation);
    }
  }, [userLocation, map, initialZoomSet]);

  return null;
}

export default function VechicleMap() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [userLocation, setUserLocation] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = SocketContext.getSocket();

  // Fetch drives from API
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const fetchDrives = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/drive/get?${searchQuery}`);
        if (!res.ok) throw new Error("Failed to fetch drives");
        const data = await res.json();
        setDrives(data.data || []);
      } catch (err) {
        console.error("Error fetching drives:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, [location.search]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation([lat, lng]);
        // Emit location to server so others can see us on the map
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

    // Cleanup on unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Join the socket room and receive online users (with locations if available)
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

  // Check if nearest filter is active
  const urlParams = new URLSearchParams(location.search);
  const showNearest = urlParams.get("nearest") === "true";

  // Haversine distance calculation
  const haversineDistance = (coords1, coords2) => {
    const R = 6371; // Earth's radius in km
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

  // Match drives with online users to get locations and calculate distances
  let onlineDrivesWithLocation = drives
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
      
      // Calculate distance if user location is available
      let distance = null;
      if (userLocation && Array.isArray(userLocation) && userLocation.length === 2) {
        distance = haversineDistance(
          { lat: userLocation[0], lng: userLocation[1] },
          driveLocation
        );
      }

      return {
        ...drive,
        lat: onlineUser.lat,
        lng: onlineUser.lng,
        distance,
      };
    });

  // Sort by nearest if nearest filter is active
  if (showNearest && userLocation && Array.isArray(userLocation) && userLocation.length === 2) {
    onlineDrivesWithLocation = onlineDrivesWithLocation
      .filter((drive) => drive.distance !== null)
      .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
      .slice(0, 50); // Limit to nearest 50 drivers
  }

  if (loading) return <div className="text-center mt-6">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-6 text-red-500">Error loading drives</div>
    );
  // Always render the map even if there are no drives

  return (
    <div className="flex flex-col space-y-4 min-h-screen">
      <MapContainer
        zoom={13}
        minZoom={10}
        maxZoom={18}
        className="w-full z-0"
        style={{ height: "100vh", width: "100%" }} // Full height of the screen
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render online drives as markers (drives with online users that have locations) */}
        {onlineDrivesWithLocation.map((drive, idx) => {
          const lat = Number(drive.lat);
          const lng = Number(drive.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

          const position = [lat, lng];
          const driverName = `${drive.firstName || ""} ${drive.lastName || ""}`.trim() || drive.userName;
          const icon = makeVehicleDivIcon(drive.category, driverName);

          return (
            <Marker key={drive._id || idx} position={position} icon={icon}>
              <Popup>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {getVehicleIconElement(drive.category)}
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {driverName}
                    </div>
                    <div style={{ fontSize: 12 }}>
                      {drive.vechicleNumber || "N/A"}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      {drive.defaultAddress}
                    </div>
                    {drive.category && (
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        Category: {drive.category}
                      </div>
                    )}
                    {drive.distance !== null && drive.distance !== undefined && (
                      <div style={{ fontSize: 12, marginTop: 4, color: "#1976d2" }}>
                        Distance: {drive.distance.toFixed(2)} km
                      </div>
                    )}
                    <div style={{ fontSize: 12, marginTop: 4, color: "#10b981" }}>
                      ● Online
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User location marker (same style as ShowMap/Post) */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={makeUserLocationIcon(currentUser?.username)}
          >
            <Popup>
              <div style={{ fontWeight: "700" }}>You are here</div>
            </Popup>
          </Marker>
        )}

        {/* Online users markers (excluding the current user and drivers) */}
        {onlineUsers
          .filter((u) => {
            if (!u || typeof u !== "object") return false;
            // Exclude current user
            if (u.userId === currentUser?._id) return false;
            // Only show users with valid coordinates
            if (!Number.isFinite(u?.lat) || !Number.isFinite(u?.lng)) return false;
            // Exclude users who are drivers - check if their userId matches any drive's userRef
            // Only check if drives array has items to avoid unnecessary computation
            if (drives.length > 0) {
              const isDriver = drives.some((drive) => {
                const driveUserRef = drive.userRef ? String(drive.userRef) : null;
                const userId = u.userId ? String(u.userId) : null;
                return driveUserRef && userId && driveUserRef === userId;
              });
              // Don't show if they're a driver (they're shown as vehicle markers)
              if (isDriver) return false;
            }
            return true;
          })
          .map((u) => (
            <Marker
              key={u.userId}
              position={[u.lat, u.lng]}
              icon={makeUserLocationIcon(u.name || "Online user")}
            >
              <Popup>
                <div style={{ fontWeight: 600 }}>{u.name || "Online user"}</div>
                <div style={{ fontSize: 12 }}>Online</div>
              </Popup>
            </Marker>
          ))}

        {/* Fit bounds to focus on the user location */}
        <FitBounds userLocation={userLocation} />
      </MapContainer>
    </div>
  );
}
