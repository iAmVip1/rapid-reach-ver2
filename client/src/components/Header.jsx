import React, { useState } from "react";
import { FaChevronDown, FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useTheme } from "./ThemeContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const isDriverRole =
    currentUser?.isPoliceVAn || currentUser?.isAmbulance || currentUser?.isFireTruck;

  return (
    <header className=" bg-gray-50 dark:bg-zinc-800 shadow-md sticky top-0 z-50">
      <nav className="border-gray-200">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4 h-16">
          {/* Logo - Left Side */}
          <Link
            to="/"
            className="font-bold text-sm sm:text-xl flex items-center flex-shrink-0"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1200px-Flag_of_the_Red_Cross.svg.png"
              alt="logo"
              className="h-8"
            />
            <span
              className="px-2 py-1 bg-gradient-to-r from-emerald-400 to-cyan-400
       rounded-lg text-white"
            >
              Rapid
            </span>
            <span>Reach</span>
          </Link>

          {/* Center Navigation - Desktop */}
          <ul className="hidden md:flex items-center justify-center space-x-8 flex-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-colors duration-200 font-medium ${
                    isActive
                      ? "bg-rose-700 text-white"
                      : "hover:bg-rose-700 hover:text-white"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-colors duration-200 font-medium ${
                    isActive
                      ? "bg-rose-700 text-white"
                      : "hover:bg-rose-700 hover:text-white"
                  }`
                }
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-colors duration-200 font-medium ${
                    isActive
                      ? "bg-rose-700 text-white"
                      : "hover:bg-rose-700 hover:text-white"
                  }`
                }
              >
                Contact Us
              </NavLink>
            </li>
          </ul>

          <button
            className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            color="gray"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          {/* Right Side - Login/User Profile */}
          <div className="hidden md:flex items-center flex-shrink-0">
            {currentUser ? (
              <button className="group relative border-none block text-gray-500 text-lg px-3 py-1 rounded z-50">
                <img
                  src={
                    currentUser?.profilePicture                     
                  }
                  alt="profile picture"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 rounded-lg p-3 mt-1 shadow-md scale-y-0 group-hover:scale-y-100 origin-top duration-200 bg-white space-y-2 w-auto min-w-[200px]">
                  <div className="text-sm block py-2 px-4 hover:font-semibold border-b-2 border-dashed border-gray-400 last:border-0">
                    <div>{currentUser.username}</div>
                    <div className="font-medium truncate">
                      {currentUser.email}
                    </div>
                  </div>
                  <a
                    href="/dashboard?tab=profile"
                    className="block py-2 px-4 text-sm hover:font-semibold hover:bg-gray-500 hover:text-white rounded-xl"
                  >
                    Profile
                  </a>

                  {isDriverRole && (
                    <Link
                      to="/drivemap"
                      className="block py-2 px-4 text-sm hover:font-semibold hover:bg-emerald-600 hover:text-white rounded-xl"
                    >
                      Share my location
                    </Link>
                  )}

                  <div className="border-b-2 border-dashed border-gray-400 last:border-0"></div>
                  <div className="py-2">
                    <div
                      className="block px-4 py-2 text-sm hover:cursor-pointer hover:bg-red-500 hover:text-white rounded-xl"
                      onClick={handleSignout}
                    >
                      Sign out
                    </div>
                  </div>
                </div>
              </button>
            ) : (
              <NavLink
                to="/sign-in"
                className={({ isActive }) =>
                  `ml-2 px-4 py-2 rounded-xl transition-colors duration-200 font-medium ${
                    isActive
                      ? "bg-rose-700 text-white"
                      : "hover:bg-rose-700 hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Profile Picture for Mobile */}
            {currentUser && (
              <button
                className="group relative border-none block text-gray-500 text-lg px-3 py-1 rounded z-50"
                onClick={toggleDropdown}
              >
                <img
                  src={
                    currentUser?.profilePicture
                      
                  }
                  alt="profile picture"
                  className="w-8 h-8 rounded-full object-cover"
                />
                {isOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 transform rounded-lg p-3 mt-1 shadow-md scale-y-100 origin-top duration-200 bg-white space-y-2 w-40">
                    <div className="text-sm block py-2 px-4 hover:font-semibold border-b-2 border-dashed border-gray-400 last:border-0">
                      <div>{currentUser.username}</div>
                      <div className="font-medium truncate">
                        {currentUser.email}
                      </div>
                    </div>
                    <a
                      href="/dashboard?tab=profile"
                      className="block py-2 px-4 text-sm hover:font-semibold hover:bg-gray-500 hover:text-white rounded-xl"
                    >
                      Profile
                    </a>

                    {isDriverRole && (
                      <Link
                        to="/drivemap"
                        className="block py-2 px-4 text-sm hover:font-semibold hover:bg-emerald-600 hover:text-white rounded-xl"
                      >
                        Share my location
                      </Link>
                    )}

                    <div className="border-b-2 border-dashed border-gray-400 last:border-0"></div>
                    <div className="py-2">
                      <div
                        className="block px-4 py-2 text-sm hover:cursor-pointer hover:bg-red-500 hover:text-white rounded-xl"
                        onClick={handleSignout}
                      >
                        Sign out
                      </div>
                    </div>
                  </div>
                )}
              </button>
            )}

            {/* Hamburger Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 space-y-2 border-t border-gray-200">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-4 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-rose-700 text-white font-medium"
                    : "text-gray-600 hover:bg-rose-700 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-4 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-rose-700 text-white font-medium"
                    : "text-gray-600 hover:bg-rose-700 hover:text-white"
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-4 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-rose-700 text-white font-medium"
                    : "text-gray-600 hover:bg-rose-700 hover:text-white"
                }`
              }
            >
              Contact Us
            </NavLink>
            {!currentUser && (
              <NavLink
                to="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-xl transition-colors duration-200 ${
                    isActive
                      ? "bg-rose-700 text-white font-medium"
                      : "text-gray-600 hover:bg-rose-700 hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
