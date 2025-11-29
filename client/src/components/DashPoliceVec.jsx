import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPhone, FaTrash, FaEye, FaCircle, FaSearch, FaFilter, FaShieldAlt, FaMapMarkerAlt, FaCalendar, FaCheck, FaCar, FaUser, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function DashPoliceVec() {
  const { currentUser } = useSelector((state) => state.user);
  const [policeDrives, setPoliceDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch police vehicle drives (include unapproved for admin review)
  useEffect(() => {
    const fetchPoliceDrives = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/drive/admin/get?vehicleType=police-vehicle&includeUnapproved=true', {
          credentials: 'include',
        });
        const data = await res.json();
        console.log('Police Vehicle API Response:', data);
        
        if (res.ok) {
          const drives = data.data || [];
          setPoliceDrives(drives);
          console.log('Police vehicle drives found:', drives.length);
        } else {
          console.log('Failed to fetch police vehicle drives:', data);
        }
      } catch (error) {
        console.log('Error fetching police vehicle drives:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliceDrives();
  }, []);

  // Mock online users for demo (replace with real socket implementation)
  useEffect(() => {
    const mockOnlineUsers = policeDrives.slice(0, 2).map(drive => drive.userRef);
    setOnlineUsers(mockOnlineUsers);
  }, [policeDrives]);

  const isOnlineUser = (userId) => {
    return onlineUsers.includes(userId);
  };

  const handleDeleteDrive = async (driveId) => {
    if (window.confirm('Are you sure you want to delete this police vehicle drive? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/drive/delete/${driveId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setPoliceDrives(policeDrives.filter(drive => drive._id !== driveId));
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleApprove = async (driveId) => {
    if (window.confirm('Approve this police vehicle drive?')) {
      try {
        const res = await fetch(`/api/drive/approve/${driveId}`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setPoliceDrives(policeDrives.map(drive => 
            drive._id === driveId ? { ...drive, approved: true } : drive
          ));
        } else {
          alert(data.message || 'Failed to approve drive');
        }
      } catch (error) {
        console.log('Error approving drive:', error.message);
        alert('Failed to approve drive');
      }
    }
  };

  const handleCallPolice = (drive) => {
    alert(`Calling ${drive.firstName} ${drive.lastName}...`);
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

  // Filter drives based on search and status filter
  const filteredDrives = policeDrives.filter(drive => {
    const fullName = `${drive.firstName} ${drive.lastName}`;
    const matchesSearch = fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.vechicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.defaultAddress?.toLowerCase().includes(searchTerm.toLowerCase());
    const status = drive.approved ? 'approved' : 'pending';
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading police vehicle drives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Police Vehicle Management</h1>
          <p className="text-gray-600">Manage all police vehicle drives and their services</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaShieldAlt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Police Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{policeDrives.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Online Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{onlineUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaCar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(policeDrives.map(drive => drive.vechicleNumber)).size}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaEnvelope className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{policeDrives.filter(drive => drive.userMail).length}</p>
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
                placeholder="Search by driver name, vehicle number, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
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
                    Driver
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vehicle
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
                {filteredDrives.map((drive) => (
                  <tr key={drive._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            src={drive.userImage || drive.licenseUrls?.[0] || 'https://via.placeholder.com/48x48?text=P'}
                            alt={`${drive.firstName} ${drive.lastName}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{drive.firstName} {drive.lastName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaCalendar className="w-3 h-3 mr-1" />
                            {formatDate(drive.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{drive.phoneNumber1}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaEnvelope className="w-3 h-3 mr-1" />
                        {drive.userMail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{drive.vechicleNumber}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1 text-red-500" />
                        {drive.defaultAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCircle className={`w-3 h-3 mr-2 ${isOnlineUser(drive.userRef) ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(!!drive.approved)}`}>
                          {drive.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {drive.approved && (
                          <Link to={`/drive/${drive._id}`}>
                            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                              <FaEye className="w-3 h-3 mr-1" />
                              View
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={() => handleCallPolice(drive)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <FaPhone className="w-3 h-3 mr-1" />
                          Call
                        </button>
                        {!drive.approved && (
                          <button
                            onClick={() => handleApprove(drive._id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            title="Approve Drive"
                          >
                            <FaCheck className="w-3 h-3 mr-1" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteDrive(drive._id)}
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
          {filteredDrives.map((drive) => (
            <div key={drive._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                    src={drive.userImage || drive.licenseUrls?.[0] || 'https://via.placeholder.com/48x48?text=P'}
                    alt={`${drive.firstName} ${drive.lastName}`}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{drive.firstName} {drive.lastName}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaCalendar className="w-3 h-3 mr-1" />
                      {formatDate(drive.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCircle className={`w-3 h-3 mr-1 ${isOnlineUser(drive.userRef) ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(!!drive.approved)}`}>
                    {drive.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaPhone className="w-3 h-3 mr-2 text-blue-500" />
                  {drive.phoneNumber1}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaEnvelope className="w-3 h-3 mr-2 text-green-500" />
                  {drive.userMail}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCar className="w-3 h-3 mr-2 text-purple-500" />
                  {drive.vechicleNumber}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaMapMarkerAlt className="w-3 h-3 mr-2 text-red-500" />
                  {drive.defaultAddress}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {drive.approved && (
                  <Link to={`/vechicle/${drive._id}`} className="flex-1 min-w-0">
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                      <FaEye className="w-3 h-3 mr-2" />
                      View
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => handleCallPolice(drive)}
                  className="flex-1 min-w-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <FaPhone className="w-3 h-3 mr-2" />
                  Call
                </button>
                {!drive.approved && (
                  <button
                    onClick={() => handleApprove(drive._id)}
                    className="flex-1 min-w-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <FaCheck className="w-3 h-3 mr-2" />
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDrive(drive._id)}
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
        {filteredDrives.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No police vehicle drives found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
