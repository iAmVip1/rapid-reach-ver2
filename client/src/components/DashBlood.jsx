import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPhone, FaTrash, FaEye, FaEdit, FaUser, FaEnvelope, FaBuilding, FaCircle, FaSearch, FaFilter, FaHospital, FaMapMarkerAlt, FaCalendar, FaCheck, FaTimes, FaTint } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function DashBlood() {
  const { currentUser } = useSelector((state) => state.user);
  const [bloodPosts, setBloodPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch blood bank posts (include unapproved for admin review)
  useEffect(() => {
    const fetchBloodPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/post/admin/get?category=Blood%20Bank&includeUnapproved=true', {
          credentials: 'include',
        });
        const data = await res.json();
        console.log('Blood Bank API Response:', data); // Debug log
        
        if (res.ok) {
          // Handle the correct data structure: { success: true, count: number, data: array }
          const posts = data.data || [];
          setBloodPosts(posts);
          console.log('Blood bank posts found:', posts.length); // Debug log
        } else {
          console.log('Failed to fetch blood bank posts:', data);
        }
      } catch (error) {
        console.log('Error fetching blood bank posts:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodPosts();
  }, []);

  // Mock online users for demo (replace with real socket implementation)
  useEffect(() => {
    // Simulate online users - replace with actual socket implementation
    const mockOnlineUsers = bloodPosts.slice(0, 2).map(post => post.userRef);
    setOnlineUsers(mockOnlineUsers);
  }, [bloodPosts]);

  const isOnlineUser = (userId) => {
    return onlineUsers.includes(userId);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blood bank post? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/post/delete/${postId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
          setBloodPosts(bloodPosts.filter(post => post._id !== postId));
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleApprove = async (postId) => {
    if (window.confirm('Approve this blood bank post?')) {
      try {
        const res = await fetch(`/api/post/approve/${postId}`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setBloodPosts(bloodPosts.map(post => 
            post._id === postId ? { ...post, approved: true } : post
          ));
        } else {
          alert(data.message || 'Failed to approve post');
        }
      } catch (error) {
        console.log('Error approving post:', error.message);
        alert('Failed to approve post');
      }
    }
  };

  const handleCallBloodBank = (post) => {
    // Implement call functionality
    alert(`Calling ${post.departmentName}...`);
  };

  const getStatusColor = (approved) => {
    return approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter posts based on search and status filter
  const filteredPosts = bloodPosts.filter(post => {
    const matchesSearch = post.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const status = post.approved ? 'approved' : 'pending';
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blood bank posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Blood Bank Management</h1>
          <p className="text-gray-600">Manage all blood bank posts and their services</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaTint className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Blood Banks</p>
                <p className="text-2xl font-bold text-gray-900">{bloodPosts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Online Blood Banks</p>
                <p className="text-2xl font-bold text-gray-900">{onlineUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBuilding className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(bloodPosts.map(post => post.category)).size}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaEnvelope className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Blood Banks</p>
                <p className="text-2xl font-bold text-gray-900">{bloodPosts.filter(post => post.userMail).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blood banks by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Blood Bank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            src={post.imageUrls?.[0] || 'https://via.placeholder.com/48x48?text=B'}
                            alt={post.departmentName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{post.departmentName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaCalendar className="w-3 h-3 mr-1" />
                            {formatDate(post.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.phoneNumber1}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaEnvelope className="w-3 h-3 mr-1" />
                        {post.userMail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1 text-red-500" />
                        {post.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCircle className={`w-3 h-3 mr-2 ${isOnlineUser(post.userRef) ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(!!post.approved)}`}>
                          {post.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {post.approved && (
                          <Link to={`/post/${post._id}`}>
                            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                              <FaEye className="w-3 h-3 mr-1" />
                              View
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={() => handleCallBloodBank(post)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                        >
                          <FaPhone className="w-3 h-3 mr-1" />
                          Call
                        </button>
                        {/* Approve button - Only show for pending posts */}
                        {!post.approved && (
                          <>
                            <button
                              onClick={() => handleApprove(post._id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                              title="Approve Post"
                            >
                              <FaCheck className="w-3 h-3 mr-1" />
                              Approve
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        >
                          <FaTrash className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                    src={post.imageUrls?.[0] || 'https://via.placeholder.com/48x48?text=B'}
                    alt={post.departmentName}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{post.departmentName}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaCalendar className="w-3 h-3 mr-1" />
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCircle className={`w-3 h-3 mr-1 ${isOnlineUser(post.userRef) ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(!!post.approved)}`}>
                    {post.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaPhone className="w-3 h-3 mr-2 text-blue-500" />
                  {post.phoneNumber1}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaEnvelope className="w-3 h-3 mr-2 text-green-500" />
                  {post.userMail}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaMapMarkerAlt className="w-3 h-3 mr-2 text-red-500" />
                  {post.address}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.approved && (
                  <Link to={`/post/${post._id}`} className="flex-1 min-w-0">
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                      <FaEye className="w-3 h-3 mr-2" />
                      View
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => handleCallBloodBank(post)}
                  className="flex-1 min-w-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  <FaPhone className="w-3 h-3 mr-2" />
                  Call
                </button>
                {/* Approve button - Only show for pending posts */}
                {!post.approved && (
                  <>
                    <button
                      onClick={() => handleApprove(post._id)}
                      className="flex-1 min-w-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <FaCheck className="w-3 h-3 mr-2" />
                      Approve
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="flex-1 min-w-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                >
                  <FaTrash className="w-3 h-3 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTint className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No blood bank posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Debug Info:</p>
              <p>Total posts in database: {bloodPosts.length}</p>
              <p>Search term: "{searchTerm}"</p>
              <p>Filter status: "{filterStatus}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
