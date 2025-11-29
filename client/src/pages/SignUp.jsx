import { Link, useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "serviceType") {
      setFormData((prev) => ({
        ...prev,
        isHospital: false,
        isFireDep: false,
        isPoliceDep: false,
        isPoliceVAn: false,
        isAmbulance: false,
        isBlood: false,
        isFireTruck: false,
        [value]: true,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value.trim() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      if (image) {
        // field name must be 'image' to match Multer on /api/auth/signup
        formDataToSend.append("image", image);
      }
      formDataToSend.append("isHospital", formData.isHospital || false);
      formDataToSend.append("isFireDep", formData.isFireDep || false);
      formDataToSend.append("isPoliceDep", formData.isPoliceDep || false);
      formDataToSend.append("isPoliceVAn", formData.isPoliceVAn || false);
      formDataToSend.append("isAmbulance", formData.isAmbulance || false);
      formDataToSend.append("isBlood", formData.isBlood || false);
      formDataToSend.append("isFireTruck", formData.isFireTruck || false);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
console.log(formData);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create an account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter your valid details.
        </p>

        <form onSubmit={handleSubmit}>
          <ProfilePhotoSelector image={image} setImage={setImage} />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="user@gmail.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="************"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="serviceType"
              className="block text-sm font-medium text-gray-700"
            >
              Select Service Type
            </label>
            <select
              id="serviceType"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value=""> 🙍🏻‍♂️ User</option>
              <option value="isHospital"> 🏥 Hospital</option>
              <option value="isFireDep"> 🧯 Fire Department</option>
              <option value="isPoliceDep"> 🏬 Police Department</option>
              <option value="isPoliceVAn"> 🚓 Police Vehicle</option>
              <option value="isAmbulance"> 🚑 Ambulance</option>
              <option value="isBlood"> 🩸 Blood Bank</option>
              <option value="isFireTruck"> 🚒 Fire Truck</option>
            </select>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          <p>Already have an account? </p>
          <Link to={"/sign-in"}>
            <div className="text-orange-500 font-medium hover:underline">
              Login
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
