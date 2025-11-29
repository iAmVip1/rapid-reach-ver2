import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaPhone, FaTrash, FaEye, FaEdit, FaUser, FaEnvelope, FaBuilding, FaCircle, FaSearch, FaFilter } from 'react-icons/fa';
import Socket from '../socket/SocketContext';
import { useCall } from '../socket/CallContext';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const { startCall } = useCall() || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/user');
        const data = await res.json();
        if (res.ok && data.success) {
          setUsers(data.users);
        } else {
          console.log('Failed to fetch users:', data);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  // Subscribe to socket events like Home.jsx (join + online-users)
  const hasJoined = useRef(false);
  useEffect(() => {
    const socket = Socket.getSocket();

    if (currentUser && socket && !hasJoined.current) {
      socket.emit('join', { id: currentUser._id, name: currentUser.username });
      hasJoined.current = true;
    }

    const handleOnlineUsers = (list) => {
      // Expecting array of { userId, ... } or ids; normalize
      setOnlineUsers(Array.isArray(list) ? list : []);
    };

    socket.on('online-users', handleOnlineUsers);
    return () => {
      socket.off('online-users', handleOnlineUsers);
    };
  }, [currentUser]);

  const isOnlineUser = (userId) => {
    const id = String(userId);
    return onlineUsers.some((u) => (u && typeof u === 'object' ? String(u.userId) === id : String(u) === id));
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/user/delete/${userId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(users.filter(user => user._id !== userId));
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleCallUser = (user) => {
    if (startCall && user._id) {
      console.log("Calling user:", user.username, "ID:", user._id);
      startCall(user._id);
    } else {
      console.error("Cannot start call - missing startCall function or user ID");
      alert(`Cannot call ${user.username}. Please try again.`);
    }
  };

  const getUserService = (user) => {
    if (user.isHospital) return 'Hospital';
    if (user.isFireDep) return 'Fire Department';
    if (user.isPoliceDep) return 'Police Department';
    if (user.isBlood) return 'Blood Bank';
    if (user.isPoliceVAn) return 'Police Vehicle';
    if (user.isAmbulance) return 'Ambulance';
    if (user.isFireTruck) return 'Fire Truck';
    return 'General User';
  };

  const getServiceColor = (service) => {
    switch (service) {
      case 'Hospital': return 'bg-blue-200 text-blue-800';
      case 'Fire Department': return 'bg-red-100 text-red-800';
      case 'Police Department': return 'bg-indigo-100 text-indigo-800';
      case 'Blood Bank': return 'bg-pink-100 text-pink-800';
      case 'Police Vehicle': return 'bg-purple-100 text-purple-800';
      case 'Ambulance': return 'bg-green-100 text-green-800';
      case 'Fire Truck': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter users based on search and service filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = filterService === 'all' || getUserService(user) === filterService;
    return matchesSearch && matchesService;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all registered users and their services</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FaUser className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Online Users</p>
                <p className="text-2xl font-bold text-gray-900">{onlineUsers.length}</p>
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
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Services</option>
                <option value="Hospital">Hospital</option>
                <option value="Fire Department">Fire Department</option>
                <option value="Police Department">Police Department</option>
                <option value="Blood Bank">Blood Bank</option>
                <option value="Police Vehicle">Police Vehicle</option>
                <option value="Ambulance">Ambulance</option>
                <option value="Fire Truck">Fire Truck</option>
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
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
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
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            src={user.profilePicture || 'https://via.placeholder.com/48x48?text=U'}
                            alt={user.username}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getServiceColor(getUserService(user))}`}>
                        {getUserService(user)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCircle className={`w-3 h-3 mr-2 ${isOnlineUser(user._id) ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${isOnlineUser(user._id) ? 'text-green-800' : 'text-gray-500'}`}>
                          {isOnlineUser(user._id) ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleCallUser(user)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                        >
                          <FaPhone className="w-3 h-3 mr-1" />
                          Call
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
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
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                    src={user.profilePicture || 'https://via.placeholder.com/48x48?text=U'}
                    alt={user.username}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaEnvelope className="w-3 h-3 mr-1" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCircle className={`w-3 h-3 mr-1 ${isOnlineUser(user._id) ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={`text-xs font-medium ${isOnlineUser(user._id) ? 'text-green-800' : 'text-gray-500'}`}>
                    {isOnlineUser(user._id) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getServiceColor(getUserService(user))}`}>
                  {getUserService(user)}
                </span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleCallUser(user)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  <FaPhone className="w-3 h-3 mr-2" />
                  Call
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                >
                  <FaTrash className="w-3 h-3 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}