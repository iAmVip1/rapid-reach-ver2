import React from 'react'
import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaDiscord
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className=" border-t-4 border-teal-500 p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Logo and Title */}
        <Link
            to="/"
            className="font-bold text-sm sm:text-xl flex items-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1200px-Flag_of_the_Red_Cross.svg.png"
              alt="logo"
              className="h-6"
            />
            <span
              className="px-2 py-1 bg-gradient-to-r from-emerald-400 to-cyan-400 text-sm
       rounded-lg text-white"
            >
              Rapid
            </span>
            <span>Reach</span>
          </Link>

        {/* Links */}
        <div className="flex gap-12">
          {/* About Section */}
          <div>
            <h4 className="font-semibold mb-2">ABOUT</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Help and Support</a></li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h4 className="font-semibold mb-2">FOLLOW US</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><a href="#">Github</a></li>
              <li><a href="#">Discord</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-300">© 2025 Rapid Reach</span>
        <div className="flex gap-4 mt-4 md:mt-0 text-gray-600 dark:text-gray-300">
          <a href="#"><FaFacebook size={24} /></a>
          <a href="#"><FaInstagram size={24} /></a>
          <a href="#"><FaGithub size={24} /></a>
          <a href="#"><FaTwitter size={24} /></a>
          <a href="#"><FaDiscord size={24} /></a>
        </div>
      </div>
    </footer>
  )
}
