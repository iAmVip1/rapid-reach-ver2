import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaHospital,
  FaFire,
  FaShieldAlt,
  FaTint,
  FaAmbulance,
  FaCar,
  FaCircle,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaBuilding,
  FaUserCheck,
  FaFileAlt,
  FaClipboardList,
} from 'react-icons/fa';
import Socket from '../socket/SocketContext';

export default function DashHome() {
  const { currentUser } = useSelector((state) => state.user);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalDrives: 0,
    onlineUsers: 0,
    pendingPosts: 0,
    pendingDrives: 0,
    approvedPosts: 0,
    approvedDrives: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentDrives, setRecentDrives] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasJoined = useRef(false);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersRes = await fetch('/api/user', { credentials: 'include' });
        const usersData = await usersRes.json();
        const totalUsers = usersData.success ? usersData.users?.length || 0 : 0;

        // Fetch all posts (approved and unapproved)
        const postsRes = await fetch('/api/post/admin/get?includeUnapproved=true', {
          credentials: 'include',
        });
        const postsData = await postsRes.json();
        const allPosts = postsData.data || [];
        const pendingPosts = allPosts.filter((p) => !p.approved).length;
        const approvedPosts = allPosts.filter((p) => p.approved).length;
        const recentPostsData = allPosts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        // Fetch all drives (approved and unapproved)
        const drivesRes = await fetch('/api/drive/admin/get?includeUnapproved=true', {
          credentials: 'include',
        });
        const drivesData = await drivesRes.json();
        const allDrives = drivesData.data || [];
        const pendingDrives = allDrives.filter((d) => !d.approved).length;
        const approvedDrives = allDrives.filter((d) => d.approved).length;
        const recentDrivesData = allDrives
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalUsers,
          totalPosts: allPosts.length,
          totalDrives: allDrives.length,
          pendingPosts,
          pendingDrives,
          approvedPosts,
          approvedDrives,
        });

        setRecentPosts(recentPostsData);
        setRecentDrives(recentDrivesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchDashboardData();
    }
  }, [currentUser]);

  // Subscribe to socket events for online users
  useEffect(() => {
    const socket = Socket.getSocket();

    if (currentUser && socket && !hasJoined.current) {
      socket.emit('join', { id: currentUser._id, name: currentUser.username });
      hasJoined.current = true;
    }

    const handleOnlineUsers = (list) => {
      setOnlineUsers(Array.isArray(list) ? list : []);
      setStats((prev) => ({ ...prev, onlineUsers: Array.isArray(list) ? list.length : 0 }));
    };

    if (socket) {
      socket.on('online-users', handleOnlineUsers);
      return () => {
        socket.off('online-users', handleOnlineUsers);
      };
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category) => {
    if (category?.includes('Hospital')) return <FaHospital className="w-4 h-4 text-emerald-600" />;
    if (category?.includes('Fire')) return <FaFire className="w-4 h-4 text-orange-600" />;
    if (category?.includes('Police')) return <FaShieldAlt className="w-4 h-4 text-blue-600" />;
    if (category?.includes('Blood')) return <FaTint className="w-4 h-4 text-red-600" />;
    return <FaBuilding className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalPending = stats.pendingPosts + stats.pendingDrives;
  const approvalRate = stats.totalPosts + stats.totalDrives > 0
    ? ((stats.approvedPosts + stats.approvedDrives) / (stats.totalPosts + stats.totalDrives) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {currentUser?.username}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your platform today</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <FaUserCheck className="w-3 h-3 inline mr-1 text-green-500" />
                  {stats.onlineUsers} online now
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <FaUsers className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Posts */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <FaCheckCircle className="w-3 h-3 inline mr-1 text-green-500" />
                  {stats.approvedPosts} approved
                </p>
              </div>
              <div className="p-4 bg-emerald-100 rounded-lg">
                <FaFileAlt className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Total Drives */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Drives</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDrives}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <FaCheckCircle className="w-3 h-3 inline mr-1 text-green-500" />
                  {stats.approvedDrives} approved
                </p>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <FaCar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-orange-600">{totalPending}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <FaClock className="w-3 h-3 inline mr-1 text-orange-500" />
                  {stats.pendingPosts} posts, {stats.pendingDrives} drives
                </p>
              </div>
              <div className="p-4 bg-orange-100 rounded-lg">
                <FaExclamationTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Approval Rate Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Approval Rate</h3>
              <FaChartLine className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-end">
              <p className="text-4xl font-bold text-green-700">{approvalRate}%</p>
              <p className="text-sm text-gray-600 ml-2 mb-1">of all submissions</p>
            </div>
            <div className="mt-4 bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${approvalRate}%` }}
              ></div>
            </div>
          </div>

          {/* Online Users Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Active Users</h3>
              <FaCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex items-end">
              <p className="text-4xl font-bold text-blue-700">{stats.onlineUsers}</p>
              <p className="text-sm text-gray-600 ml-2 mb-1">users online</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.totalUsers > 0
                ? ((stats.onlineUsers / stats.totalUsers) * 100).toFixed(1)
                : 0}% of total users
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/dashboard?tab=documents"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <FaFileAlt className="w-4 h-4 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Manage Posts</span>
                </div>
              </Link>
              <Link
                to="/dashboard?tab=drive"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <FaCar className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Manage Drives</span>
                </div>
              </Link>
              <Link
                to="/dashboard?tab=users"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <FaUsers className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Manage Users</span>
                </div>
              </Link>
              {totalPending > 0 && (
                <Link
                  to="/dashboard?tab=documents"
                  className="block p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-orange-700">
                        Review {totalPending} Pending
                      </span>
                    </div>
                    <FaArrowUp className="w-3 h-3 text-orange-600" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaFileAlt className="w-5 h-5 text-emerald-600 mr-2" />
                  Recent Posts
                </h3>
                <Link
                  to="/dashboard?tab=documents"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post._id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(post.category)}
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {post.departmentName || 'Unnamed Post'}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{post.category}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{formatDate(post.createdAt)}</span>
                          {post.approved ? (
                            <span className="flex items-center text-green-600">
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </span>
                          ) : (
                            <span className="flex items-center text-orange-600">
                              <FaClock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaFileAlt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No posts yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Drives */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaCar className="w-5 h-5 text-purple-600 mr-2" />
                  Recent Drives
                </h3>
                <Link
                  to="/dashboard?tab=drive"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentDrives.length > 0 ? (
                <div className="space-y-4">
                  {recentDrives.map((drive) => (
                    <div
                      key={drive._id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FaCar className="w-4 h-4 text-purple-600" />
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {drive.firstName} {drive.lastName}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {drive.vechicleNumber} • {drive.category}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{formatDate(drive.createdAt)}</span>
                          {drive.approved ? (
                            <span className="flex items-center text-green-600">
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </span>
                          ) : (
                            <span className="flex items-center text-orange-600">
                              <FaClock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaCar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No drives yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Categories Overview */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaClipboardList className="w-5 h-5 text-gray-600 mr-2" />
            Service Categories Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              to="/dashboard?tab=hospital"
              className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors text-center"
            >
              <FaHospital className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">Hospitals</p>
            </Link>
            <Link
              to="/dashboard?tab=fire"
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors text-center"
            >
              <FaFire className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">Fire Dept</p>
            </Link>
            <Link
              to="/dashboard?tab=policeDep"
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-center"
            >
              <FaShieldAlt className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">Police</p>
            </Link>
            <Link
              to="/dashboard?tab=blood"
              className="p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors text-center"
            >
              <FaTint className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">Blood Bank</p>
            </Link>
            <Link
              to="/dashboard?tab=ambulance"
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-center"
            >
              <FaAmbulance className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">Ambulance</p>
            </Link>
            <Link
              to="/dashboard?tab=poilcevec"
              className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-center"
            >
              <FaCar className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">Police Veh</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
