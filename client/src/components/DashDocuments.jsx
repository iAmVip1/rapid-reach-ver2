import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaPlus, FaMapMarkerAlt, FaPhone, FaGlobe, FaEnvelope, FaBuilding, FaUser, FaIdCard } from "react-icons/fa";

export default function DashDocuments() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const getStatusDisplay = (post) => {
    const raw = post?.status ? String(post.status).toLowerCase() : (post?.approved ? 'approved' : 'pending');
    switch (raw) {
      case 'approved':
        return { label: 'Approved', cls: 'bg-cyan-400 text-white' };
      case 'rejected':
        return { label: 'Rejected', cls: 'bg-red-500 text-white' };
      default:
        return { label: 'Pending', cls: 'bg-green-500 text-white' };
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/posts/${currentUser._id}`);
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setUserPost(data[0]); // Get the first (and only) post
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser._id) {
      fetchPost();
    }
  }, [currentUser._id]);

  const handlePostDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete your details? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/post/delete/${postId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setUserPost(null);
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
          <p className="mt-4 text-gray-600">Loading your details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            My Details
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your personal and business information. Update your details anytime.
          </p>
        </div>

        {userPost ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header with Image */}
            <div className="relative">
              <img
                src={userPost.imageUrls}
                alt={userPost.departmentName}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                      {userPost.departmentName}
                    </h2>
                    <span className={`${getStatusDisplay(userPost).cls} px-3 py-1 rounded-full text-sm font-semibold`}>
                      {getStatusDisplay(userPost).label}
                    </span>
                  </div>
                 
                </div>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-6 md:p-8">
              {/* Department Name Section */}
              <div className="mb-8 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {userPost.departmentName}
                </h3>
                <p className="text-gray-600">{userPost.category}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Contact Information */}
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
                        <p className="font-semibold text-gray-800">{userPost.phoneNumber1}</p>
                      </div>
                    </div>

                    {userPost.phoneNumber2 && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaPhone className="text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Secondary Phone</p>
                          <p className="font-semibold text-gray-800">{userPost.phoneNumber2}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold text-gray-800">{userPost.userMail}</p>
                      </div>
                    </div>

                    {userPost.website && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaGlobe className="text-cyan-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <a
                            href={userPost.website}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            {userPost.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Business Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-cyan-400" />
                    Business Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Business Address</p>
                        <p className="font-semibold text-gray-800">{userPost.address}</p>
                      </div>
                    </div>

                    {userPost.registrationNo && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaIdCard className="text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Registration Number</p>
                          <p className="font-semibold text-gray-800">{userPost.registrationNo}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaBuilding className="text-cyan-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Business Category</p>
                        <p className="font-semibold text-gray-800">{userPost.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {userPost.description && (
                <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">About</h4>
                  <p className="text-gray-700 leading-relaxed">{userPost.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to={`/update-post/${userPost._id}`} className="flex-1">
                  <button className="w-full bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                    <FaEdit />
                    Edit Details
                  </button>
                </Link>

                <Link to={`/post/${userPost._id}`} className="flex-1">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                    <FaEye />
                    View Public Page
                  </button>
                </Link>

                <button
                  type="button"
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={() => handlePostDelete(userPost._id)}
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
                No Details Added Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Add your business or personal details to get started. This will be your public profile.
              </p>
              <Link to="/create-post">
                <button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto">
                  <FaPlus />
                  Add My Details
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
