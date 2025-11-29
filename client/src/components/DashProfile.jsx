import { useSelector, useDispatch } from "react-redux";
import React, { useRef, useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";


export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    await handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    // Local upload via dedicated profile image upload endpoint
    try {
      setImageFileUploading(true);
      setImageFileUploadError(null);
      setImageFileUploadProgress(0);

      const formDataToSend = new FormData();
      formDataToSend.append("profilePicture", file);

      const res = await fetch(`/api/user/upload/profile`, {
        method: "POST",
        body: formDataToSend,
      });
      const data = await res.json();
      if (!res.ok) {
        setImageFileUploadError(data.message || "Failed to upload image");
        setImageFileUploading(false);
        setImageFileUploadProgress(0);
        return;
      }

      setImageFileUploadProgress(100);
      
      // Update the user profile with the new image URL
      const updateRes = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture: data.imageUrl }),
      });
      const updateData = await updateRes.json();
      
      if (updateRes.ok) {
        // Update formData and redux user with new profile picture URL
        setFormData((prev) => ({ ...prev, profilePicture: data.imageUrl || prev.profilePicture }));
        dispatch(updateSuccess(updateData));
      } else {
        setImageFileUploadError(updateData.message || "Failed to update profile");
      }
      
      setImageFileUploading(false);
    } catch (error) {
      setImageFileUploadError(error.message || "Failed to upload image");
      setImageFileUploading(false);
      setImageFileUploadProgress(0);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    const isUnchanged =
      formData.username === currentUser.username &&
      formData.email === currentUser.email &&
      !formData.password &&
      (!formData.profilePicture ||
        formData.profilePicture === currentUser.profilePicture);

    if (isUnchanged) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for the image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

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

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : formData.profilePicture
                ? formData.profilePicture
                : currentUser?.profilePicture
                ? currentUser.profilePicture
                : "/uploads/default-avatar.jpg"
            }
            alt="profile picture"
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-300"
          />

          <div>
            <h3 className="text-lg font-bold text-gray-700">
              {currentUser.username}
            </h3>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                onClick={handleUploadClick}
              >
                Upload New Picture
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        {imageFileUploading && (
          <div className="mb-4 flex flex-col items-center">
            <div className="w-16 h-16">
              <CircularProgressbar
                value={parseInt(imageFileUploadProgress)}
                maxValue={100}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {imageFileUploadProgress}% Uploading...
            </p>
          </div>
        )}

        {imageFileUploadError && (
          <p className="text-red-600 text-sm">{imageFileUploadError}</p>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <button className="w-full bg-emerald-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-emerald-600 transition cursor-pointer">
          Update
        </button>

        {updateUserError && (
          <p className="mt-2 text-red-600">{updateUserError}</p>
        )}
        {updateUserSuccess && (
          <p className="mt-2 text-green-600">{updateUserSuccess}</p>
        )}
      </form>
     <div className="flex justify-between gap-4 mt-6">
  <button
    onClick={handleSignout}
    className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition cursor-pointer"
  >
    Sign Out
  </button>

  <button
    onClick={() => setShowModal(true)}
    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition cursor-pointer"
  >
    Delete Account
  </button>
</div>

      
      {showModal && (
  <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">

    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
      <p className="mb-6 text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteUser}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
