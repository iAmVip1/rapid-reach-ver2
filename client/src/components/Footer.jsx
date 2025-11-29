import Logo from "../../../images/logo1.png";
import LogoDark from "../../../images/logo1dark.png";
import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaDiscord,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext"; 

export default function Footer() {
  const { theme } = useTheme(); 

  return (
    <footer className="border-t-4 border-teal-500 p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-6">
        {/* Logo + Title */}
        <Link
          to="/"
          className="font-bold text-sm sm:text-xl flex flex-col items-center"
        >
          <img
            src={theme === "dark" ? LogoDark : Logo}
            alt="logo"
            className="h-18 mb-2"
          />

          <div className="flex items-center">
            <span className="px-2 py-1 bg-gradient-to-r from-emerald-400 to-cyan-400 text-sm rounded-lg text-white">
              Rapid
            </span>
            <span className="ml-1">Reach</span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-8">
          {/* About Section */}
          <div>
            <h4 className="font-semibold mb-2">ABOUT</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Help and Support</a>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h4 className="font-semibold mb-2">FOLLOW US</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <a href="#">Github</a>
              </li>
              <li>
                <a href="#">Discord</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-6 pt-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            © 2025 Rapid Reach
          </span>

          <div className="flex gap-4 text-gray-600 dark:text-gray-300">
            <a href="#">
              <FaFacebook size={24} />
            </a>
            <a href="#">
              <FaInstagram size={24} />
            </a>
            <a href="#">
              <FaGithub size={24} />
            </a>
            <a href="#">
              <FaTwitter size={24} />
            </a>
            <a href="#">
              <FaDiscord size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
