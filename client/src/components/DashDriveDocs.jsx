import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaPlus, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaUser, FaIdCard, FaCar } from "react-icons/fa";

export default function DashDriveDocs() {
  const { currentUser } = useSelector((state) => state.user);
  const [userDrive, setUserDrive] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusDisplay = (drive) => {
    const raw = drive?.status ? String(drive.status).toLowerCase() : (drive?.approved ? "approved" : "pending");
    switch (raw) {
      case "approved":
        return { label: "Approved", cls: "bg-cyan-400 text-white" };
      case "rejected":
        return { label: "Rejected", cls: "bg-red-500 text-white" };
      default:
        return { label: "Pending", cls: "bg-green-500 text-white" };
    }
  };

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        setLoading(true);
        
        const res = await fetch(`/api/user/drive/${currentUser._id}`);
        const data = await res.json();
        if (res.ok && data?.data?.length > 0) {
          const mine = data.data.find((d) => d.userRef === currentUser._id);
          if (mine) setUserDrive(mine);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchDrive();
    }
  }, [currentUser?._id]);

  const handleDriveDelete = async (driveId) => {
    if (window.confirm("Are you sure you want to delete your drive details? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/drive/delete/${driveId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setUserDrive(null);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your drive details...</p>
        </div>
      </div>
    );
  }
console.log(userDrive);

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            My Drive Details
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your driver and vehicle information. Update your details anytime.
          </p>
        </div>

        {userDrive ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={userDrive.licenseUrls?.[0] || "https://via.placeholder.com/1200x400?text=License+Image"}
                alt="License"
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg flex items-center gap-2">
                      <FaCar />
                      {userDrive.vechicleNumber}
                    </h2>
                    <span className={`${getStatusDisplay(userDrive).cls} px-3 py-1 rounded-full text-sm font-semibold`}>
                      {getStatusDisplay(userDrive).label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {userDrive.firstName} {userDrive.lastName}
                </h3>
                <p className="text-gray-600">{userDrive.company}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-cyan-400" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Primary Phone</p>
                        <p className="font-semibold text-gray-800">{userDrive.phoneNumber1}</p>
                      </div>
                    </div>
                    {userDrive.phoneNumber2 && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaPhone className="text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Secondary Phone</p>
                          <p className="font-semibold text-gray-800">{userDrive.phoneNumber2}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold text-gray-800">{userDrive.userMail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-cyan-400" />
                    Vehicle Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Default Address</p>
                        <p className="font-semibold text-gray-800">{userDrive.defaultAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaIdCard className="text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">License Number</p>
                        <p className="font-semibold text-gray-800">{userDrive.licenseNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaCar className="text-cyan-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Vehicle</p>
                        <p className="font-semibold text-gray-800">{userDrive.vechicleNumber} • {userDrive.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents and images lists */}
              {(userDrive.licenseUrls?.length > 0 || userDrive.documentUrls?.length > 0) && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userDrive.licenseUrls?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">License Images</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {userDrive.licenseUrls.map((u) => (
                          <img key={u} src={u} alt="license" className="w-full h-28 object-cover rounded-lg shadow" />
                        ))}
                      </div>
                    </div>
                  )}
                  {userDrive.documentUrls?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Documents</h4>
                      <ul className="space-y-2">
                        {userDrive.documentUrls.map((d, i) => (
                          <li key={d} className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
                            <a href={d} target="_blank" rel="noopener noreferrer" className="text-indigo-600 truncate max-w-xs sm:max-w-md">
                              Document {i + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to={`/update-drive/${userDrive._id}`} className="flex-1">
                  <button className="w-full bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                    <FaEdit />
                    Edit Details
                  </button>
                </Link>

                <Link to={`/drive/${userDrive._id}`} className="flex-1">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                    <FaEye />
                    View Public Page
                  </button>
                </Link>

                <button
                  type="button"
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={() => handleDriveDelete(userDrive._id)}
                >
                  <FaTrash />
                  Delete Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUser className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                No Drive Details Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Add your driving and vehicle details to get started. This will be your public profile.
              </p>
              <Link to="/create-drive">
                <button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto">
                  <FaPlus />
                  Add My Drive Details
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
