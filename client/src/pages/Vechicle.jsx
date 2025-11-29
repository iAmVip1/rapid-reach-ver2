import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaCar, FaPhone, FaAmbulance, FaShieldAlt, FaFire } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import { useCall } from "../socket/CallContext";
import SocketContext from "../socket/SocketContext";
import ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CommentSection from "../components/CommentSection";

// Get vehicle type icon
const getVehicleIconElement = (vehicleType) => {
  const size = 25;
  if (vehicleType === 'ambulance') {
    return <FaAmbulance size={size} color="#10b981" />;
  } else if (vehicleType === 'police-vehicle') {
    return <FaShieldAlt size={size} color="#1976d2" />;
  } else if (vehicleType === 'fire-truck') {
    return <FaFire size={size} color="#ef6c00" />;
  }
  return <FaCar size={size} color="#555" />;
};

// Create a pointed marker with vehicle icon
const makeVehicleDivIcon = (vehicleType, driverName) => {
  const iconEl = getVehicleIconElement(vehicleType);
  const html = `
    <div style="position: relative; width: 40px; height: 40px;">
      <div style="position:absolute; inset:0; background:#ffffff; border:2px solid rgba(0,0,0,0.3); box-shadow:0 2px 4px rgba(0,0,0,0.35); border-radius:50% 50% 50% 0; transform: rotate(-45deg);">
        <div style="position:absolute; top:50%; left:50%; transform: translate(-50%, -50%) rotate(45deg); display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%;">
          ${ReactDOMServer.renderToString(iconEl)}
        </div>
      </div>
    </div>
  `;

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
        ${driverName || ""}
      </div>
      ${html}
    </div>
  `;

  return L.divIcon({
    className: "",
    html: containerHtml,
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    popupAnchor: [0, -70],
  });
};

export default function Vechicle() {
  const { startCall } = useCall() || {};
  const { driveId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const socket = SocketContext.getSocket();
  const hasJoined = useRef(false);

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [allDrives, setAllDrives] = useState([]);
  const [vehicleType, setVehicleType] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location and share it via socket
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser");
      return;
    }

    if (!socket || !currentUser?._id) return;

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

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, currentUser]);

  // Join socket and listen for online users
  useEffect(() => {
    if (!socket || !currentUser) return;

    if (!hasJoined.current) {
      socket.emit("join", { id: currentUser._id, name: currentUser.username });
      hasJoined.current = true;
    }

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || []);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket, currentUser]);

  // Fetch drive and determine vehicle type
  useEffect(() => {
    const fetchDrive = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/drive/get/${driveId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setDrive(data);
        
        // Determine vehicle type by checking which type includes this drive
        // Try all three types in parallel to find which one contains our drive
        const determineVehicleType = async () => {
          const types = ['ambulance', 'police-vehicle', 'fire-truck'];
          const promises = types.map(type => 
            fetch(`/api/drive/get?vehicleType=${type}`)
              .then(res => res.json())
              .then(result => ({
                type,
                drives: result.success && result.data ? result.data : []
              }))
              .catch(() => ({ type, drives: [] }))
          );
          
          const results = await Promise.all(promises);
          for (const result of results) {
            const found = result.drives.find(d => d._id === data._id);
            if (found) {
              setVehicleType(result.type);
              return;
            }
          }
        };
        
        determineVehicleType();
        
        setLoading(false);
        setError(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchDrive();
  }, [driveId]);

  // Fetch all drives of the same vehicle type
  useEffect(() => {
    if (!vehicleType) return;

    const fetchAllDrives = async () => {
      try {
        const res = await fetch(`/api/drive/get?vehicleType=${vehicleType}`);
        const data = await res.json();
        if (data.success && data.data) {
          setAllDrives(data.data);
        }
      } catch (err) {
        console.error("Error fetching all drives:", err);
      }
    };

    fetchAllDrives();
  }, [vehicleType]);

  // Check if current driver (post owner) is online (separate from location check)
  const isCurrentDriverOnline = useMemo(() => {
    if (!drive || !onlineUsers.length) return false;

    const onlineUser = onlineUsers.find(
      (u) => {
        if (!u) return false;
        if (typeof u === 'object' && u.userId) {
          return String(u.userId) === String(drive.userRef);
        }
        return String(u) === String(drive.userRef);
      }
    );

    return !!onlineUser;
  }, [drive, onlineUsers]);

  // Get current driver's location if they're online and have shared location
  // Also check if viewing user is the driver themselves and has location
  const currentDriverOnlineLocation = useMemo(() => {
    if (!drive) return null;

    // Check if viewing user is the driver themselves
    const isViewingOwnPage = currentUser && String(currentUser._id) === String(drive.userRef);
    
    // If viewing own page and has location, use that
    if (isViewingOwnPage && userLocation && Array.isArray(userLocation) && userLocation.length === 2) {
      const [lat, lng] = userLocation;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return {
          ...drive,
          lat,
          lng,
          isCurrentDriver: true,
        };
      }
    }

    // Otherwise, check if driver is in online users list
    if (!isCurrentDriverOnline || !onlineUsers.length) return null;

    const onlineUser = onlineUsers.find(
      (u) => {
        if (!u || typeof u !== 'object' || !u.userId) return false;
        return String(u.userId) === String(drive.userRef);
      }
    );

    if (!onlineUser) return null;

    // Check if we have valid location data from socket
    if (typeof onlineUser.lat === 'number' && 
        typeof onlineUser.lng === 'number' &&
        Number.isFinite(onlineUser.lat) && 
        Number.isFinite(onlineUser.lng)) {
      return {
        ...drive,
        lat: onlineUser.lat,
        lng: onlineUser.lng,
        isCurrentDriver: true,
      };
    }

    return null;
  }, [drive, isCurrentDriverOnline, onlineUsers, currentUser, userLocation]);

  // Filter online drives with locations (excluding current driver if they're in the list)
  const onlineDrivesWithLocation = useMemo(() => {
    if (!allDrives.length || !onlineUsers.length) return [];

    return allDrives
      .filter(drive => {
        // Skip the current driver - we handle them separately
        if (drive._id === currentDriverOnlineLocation?._id) return false;

        // Check if driver is online
        const isOnline = onlineUsers.some(
          (u) => u && typeof u === 'object' 
            ? String(u.userId) === String(drive.userRef) 
            : String(u) === String(drive.userRef)
        );
        if (!isOnline) return false;

        // Check if we have location data
        const onlineUser = onlineUsers.find(
          (u) => u && typeof u === 'object' 
            ? String(u.userId) === String(drive.userRef) 
            : String(u) === String(drive.userRef)
        );
        return onlineUser && 
               typeof onlineUser.lat === 'number' && 
               typeof onlineUser.lng === 'number' &&
               Number.isFinite(onlineUser.lat) && 
               Number.isFinite(onlineUser.lng);
      })
      .map(drive => {
        const onlineUser = onlineUsers.find(
          (u) => u && typeof u === 'object' 
            ? String(u.userId) === String(drive.userRef) 
            : String(u) === String(drive.userRef)
        );
        return {
          ...drive,
          lat: onlineUser.lat,
          lng: onlineUser.lng,
          isCurrentDriver: false,
        };
      });
  }, [allDrives, onlineUsers, currentDriverOnlineLocation]);

  // Calculate map center - prioritize current driver's location, then other online drivers, then user location
  const mapCenter = useMemo(() => {
    // Validate coordinates helper
    const isValidCoord = (coord) => {
      return Array.isArray(coord) && 
             coord.length === 2 && 
             typeof coord[0] === 'number' && 
             typeof coord[1] === 'number' &&
             Number.isFinite(coord[0]) && 
             Number.isFinite(coord[1]) &&
             coord[0] >= -90 && coord[0] <= 90 &&
             coord[1] >= -180 && coord[1] <= 180;
    };

    // All online drivers with locations (including current driver)
    const allOnlineDrives = [];
    if (currentDriverOnlineLocation) {
      allOnlineDrives.push(currentDriverOnlineLocation);
    }
    allOnlineDrives.push(...onlineDrivesWithLocation);

    if (allOnlineDrives.length > 0) {
      const validLocs = allOnlineDrives.filter(d => 
        typeof d.lat === 'number' && typeof d.lng === 'number' &&
        Number.isFinite(d.lat) && Number.isFinite(d.lng)
      );
      if (validLocs.length > 0) {
        // If only one location, center on it
        if (validLocs.length === 1) {
          return [validLocs[0].lat, validLocs[0].lng];
        }
        // If multiple locations, center on average
        const lats = validLocs.map(d => d.lat);
        const lngs = validLocs.map(d => d.lng);
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        if (isValidCoord([avgLat, avgLng])) {
          return [avgLat, avgLng];
        }
      }
    }
    
    // Use current user's location if available and valid (fallback)
    if (userLocation && isValidCoord(userLocation)) {
      return userLocation;
    }
    
    // Default center (Kathmandu, Nepal - adjust as needed)
    return [27.7172, 85.3240];
  }, [currentDriverOnlineLocation, onlineDrivesWithLocation, userLocation]);

  // Check if we have any online drivers with location data to show on map
  const hasOnlineDriversWithLocation = currentDriverOnlineLocation || onlineDrivesWithLocation.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !drive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">Error loading vehicle</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('=== Vechicle.jsx Debug ===');
  console.log('Drive:', drive);
  console.log('Drive userRef:', drive?.userRef);
  console.log('Vehicle Type:', vehicleType);
  console.log('Online Users:', onlineUsers);
  console.log('Online Users userRefs:', onlineUsers.map(u => u?.userId || u));
  console.log('Is Current Driver Online:', isCurrentDriverOnline);
  console.log('Current Driver Online Location:', currentDriverOnlineLocation);
  console.log('All Drives:', allDrives);
  console.log('Online Drives with Location:', onlineDrivesWithLocation);
  console.log('Has Online Drivers With Location:', hasOnlineDriversWithLocation);
  console.log('Map Center:', mapCenter);
  
  // Detailed matching debug
  if (drive && onlineUsers.length > 0) {
    const matchedUser = onlineUsers.find(u => {
      if (!u) return false;
      if (typeof u === 'object' && u.userId) {
        return String(u.userId) === String(drive.userRef);
      }
      return String(u) === String(drive.userRef);
    });
    console.log('Matched Online User:', matchedUser);
    console.log('Matched User has location:', matchedUser && matchedUser.lat !== undefined && matchedUser.lng !== undefined);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Map Section - Show map only if there are online drivers with location */}
        {hasOnlineDriversWithLocation ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="h-96 md:h-[500px] w-full relative" style={{ minHeight: '400px' }}>
              {mapCenter && Array.isArray(mapCenter) && mapCenter.length === 2 ? (
                <MapContainer
                  
                  center={mapCenter}
                  zoom={
                    ((currentDriverOnlineLocation ? 1 : 0) + onlineDrivesWithLocation.length) === 1 
                      ? 15 
                      : ((currentDriverOnlineLocation ? 1 : 0) + onlineDrivesWithLocation.length) > 1 
                        ? 12 
                        : 13
                  }
                  className="w-full h-full"
                  style={{ zIndex: 1, height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Current Driver Marker (if online and has location) */}
                  {currentDriverOnlineLocation && (
                    <Marker
                      position={[currentDriverOnlineLocation.lat, currentDriverOnlineLocation.lng]}
                      icon={makeVehicleDivIcon(vehicleType, `${currentDriverOnlineLocation.firstName} ${currentDriverOnlineLocation.lastName}`)}
                    >
                      <Popup>
                        <div className="flex items-center gap-3">
                          {getVehicleIconElement(vehicleType)}
                          <div>
                            <div className="font-bold text-gray-800">
                              {currentDriverOnlineLocation.firstName} {currentDriverOnlineLocation.lastName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {currentDriverOnlineLocation.vechicleNumber}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {currentDriverOnlineLocation.defaultAddress}
                            </div>
                            <div className="text-sm text-gray-500">
                              Phone: {currentDriverOnlineLocation.phoneNumber1}
                            </div>
                            <div className="text-xs text-green-600 mt-1 font-semibold">
                              ● Online (Current Driver)
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* Other Online Driver Markers */}
                  {onlineDrivesWithLocation.map((drive) => (
                    <Marker
                      key={drive._id}
                      position={[drive.lat, drive.lng]}
                      icon={makeVehicleDivIcon(vehicleType, `${drive.firstName} ${drive.lastName}`)}
                    >
                      <Popup>
                        <div className="flex items-center gap-3">
                          {getVehicleIconElement(vehicleType)}
                          <div>
                            <div className="font-bold text-gray-800">
                              {drive.firstName} {drive.lastName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {drive.vechicleNumber}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {drive.defaultAddress}
                            </div>
                            <div className="text-sm text-gray-500">
                              Phone: {drive.phoneNumber1}
                            </div>
                            <div className="text-xs text-green-600 mt-1 font-semibold">
                              ● Online
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

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
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Loading map...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* No online drivers with location message */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {vehicleType === 'ambulance' ? (
                  <FaAmbulance className="text-3xl text-gray-400" />
                ) : vehicleType === 'police-vehicle' ? (
                  <FaShieldAlt className="text-3xl text-gray-400" />
                ) : vehicleType === 'fire-truck' ? (
                  <FaFire className="text-3xl text-gray-400" />
                ) : (
                  <FaCar className="text-3xl text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {isCurrentDriverOnline 
                  ? 'Driver Location Not Available' 
                  : 'Driver is Currently Offline'}
              </h3>
              <p className="text-gray-600">
                {isCurrentDriverOnline ? (
                  <>
                    {drive?.firstName} {drive?.lastName} is online but has not shared their location yet.
                    They need to enable location sharing for their position to appear on the map.
                  </>
                ) : (
                  <>
                    {drive?.firstName} {drive?.lastName} is not online or has not connected to the system.
                    The map will appear when they come online and share their location.
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Driver Information Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main info */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaUser className="text-emerald-600" /> Driver Information
                </h2>

                {/* Small Screen Image */}
                <div className="flex flex-col items-center md:hidden mb-4">
                  <img
                    src={drive.userImage || "https://via.placeholder.com/150"}
                    alt="User"
                    className="w-40 h-40 rounded-full object-cover shadow-md"
                  />
                  <p className="text-sm text-gray-500 font-bold mt-2">Driver Image</p>
                </div>

                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    <FaUser className="text-emerald-600" />
                    <span className="font-semibold">Full Name:</span>&nbsp;
                    {drive.firstName} {drive.lastName}
                  </li>
                  <li className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-emerald-600" />
                    <span className="font-semibold">Default Address:</span>&nbsp;
                    {drive.defaultAddress}
                  </li>
                  <li className="flex items-center gap-2">
                    <FaEnvelope className="text-emerald-600" />
                    <span className="font-semibold">Email:</span>&nbsp;
                    {drive.userMail}
                  </li>
                  <li className="flex items-center gap-2">
                    <FaPhone className="text-emerald-600" />
                    <span className="font-semibold">Phone 1:</span>&nbsp;
                    {drive.phoneNumber1}
                  </li>
                  {drive.phoneNumber2 && (
                    <li className="flex items-center gap-2">
                      <FaPhone className="text-emerald-600" />
                      <span className="font-semibold">Phone 2:</span>&nbsp;
                      {drive.phoneNumber2}
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <FaCar className="text-emerald-600" />
                    <span className="font-semibold">Vechicle Info:</span>&nbsp;
                    {drive.vechicleNumber}, {drive.company}
                  </li>
                </ul>
              </div>

              {/* Driver image (large) */}
              <div className="hidden md:flex flex-col items-center">
                <a href={drive.userImage || "https://via.placeholder.com/400"} target="_blank" rel="noreferrer">
                  <img
                    src={drive.userImage || "https://via.placeholder.com/150"}
                    alt="userImage"
                    className="w-44 h-44 rounded-full object-cover shadow-lg hover:scale-105 transition-transform"
                  />
                </a>
                <p className="text-sm text-gray-500 font-bold mt-3">Driver Image</p>
              </div>
            </div>

            
            {/* Call Button */}
            {currentUser && drive.userRef !== currentUser._id && (
              <div className="mt-8 ">
                <button
                  type="button"
                  onClick={() => {
                    if (startCall && drive?.userRef) {
                      startCall(drive.userRef);
                    }
                  }}
                  className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-all shadow-md"
                >
                  <MdCall className="inline mr-2" />
                  Call Now
                </button>
              </div>
            )}
          </div>
        </div>
        <CommentSection postId={drive._id} />
      </div>
    </div>
  );
}
