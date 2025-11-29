import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";

export default function UpdatePost() {
  //image
  const [image, setImage] = useState(null);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [preview, setPreview] = useState(null);

  //form
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { postId } = useParams();
  const [formData, setFromData] = useState({
    departmentName: "",
    address: "",
    longitude: "",
    latitude: "",
    website: "",
    phoneNumber1: "",
    phoneNumber2: "",
    registrationNo: "",
    category: "",
    description: "",
    imageUrls: [],
    documentUrls: [],
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetchLoading(true);
        const res = await fetch(`/api/post/get/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setFromData({
            ...data,
            documentUrls: Array.isArray(data.documentUrls)
              ? data.documentUrls
              : [],
            imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setFetchLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Auto-generate location
  const handleAutoGenerateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lng = pos.coords.longitude.toFixed(6);
          const lat = pos.coords.latitude.toFixed(6);
          setLongitude(lng);
          setLatitude(lat);
          setFromData((prev) => ({
            ...prev,
            longitude: lng,
            latitude: lat,
          }));
          fetchAddress(lat, lng)
        },
        (err) => {
          console.error(err);
          alert("Unable to fetch location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // (Multer handles image upload on submit; no separate Cloudinary upload)
  const handleUploadImage = () => {
    alert("Image will be uploaded when you submit the form.");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // Create a preview URL
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = (index) => {
    setFromData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files || []);
    setDocuments(files);
  };

  const handleRemoveDocument = (index) => {
    setFromData((prev) => ({
      ...prev,
      documentUrls: prev.documentUrls.filter((_, i) => i !== index),
    }));
  };

  // form specification
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const key = name || id;
    setFromData((prev) => ({
      ...prev,
      [key]: value,
    }));

     if (key === "latitude" || key === "longitude") {
      const lat = key === "latitude" ? value : formData.latitude;
      const lng = key === "longitude" ? value : formData.longitude;
      if (lat && lng) {
        fetchAddress(lat, lng);
      }
    }
  };

  // address
  async function fetchAddress(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setFromData((prev) => ({
          ...prev,
          address: data.display_name,
        }));
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // image is optional on update; if provided, backend will replace imageUrls
      const hasDocuments =
        documents.length > 0 ||
        (Array.isArray(formData.documentUrls) &&
          formData.documentUrls.length > 0);
      if (!hasDocuments) {
        return setError("You must include at least one supporting document");
      }
      if (formData.phoneNumber1.length < 10)
        return setError("Phone numbers must be 10 numbers");
      if (formData.phoneNumber2.length < 10)
        return setError("Phone numbers must be 10 numbers");
      if (formData.phoneNumber1 == formData.phoneNumber2)
        return setError("Phone numbers must be different");

      setLoading(true);
      setError(false);

      const formDataToSend = new FormData();
      Object.entries({
        ...formData,
        userRef: currentUser._id,
        userMail: currentUser.email,
        userImage: currentUser.profilePicture,
      }).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });
      if (image) {
        formDataToSend.append("image", image);
      }
      documents.forEach((doc) => formDataToSend.append("documents", doc));

      const res = await fetch(`/api/post/update/${postId}`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/post/${postId}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      let cat = "";
      if (currentUser.isHospital) cat = "Hospital";
      else if (currentUser.isFireDep) cat = "Fire Department";
      else if (currentUser.isPoliceDep) cat = "Police Department";
      else if (currentUser.isBlood) cat = "Blood Bank";

      setFromData((prev) => ({
        ...prev,
        category: cat,
      }));
    }
  }, [currentUser]);

  if (fetchLoading) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update your details.
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Dept name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department Name
          </label>
          <input
            type="text"
            className="block w-full mt-1 border border-gray-300 rounded-md p-2 bg-gray-100"
            value={formData.departmentName}
            id="departmentName"
            onChange={handleChange}
          />
        </div>

        {/* Location Field */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Longitude:
            </label>
            <input
              type="text"
              value={formData.longitude}
              id="longitude"
              className="block w-full mt-1 border border-gray-300 rounded-md p-2 bg-gray-100"
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Latitude:
            </label>
            <input
              type="text"
              value={formData.latitude}
              onChange={handleChange}
              id="latitude"
              className="block w-full mt-1 border border-gray-300 rounded-md p-2 bg-gray-100"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAutoGenerateLocation}
              className="bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-md font-medium shadow-md"
            >
              Auto Generate
            </button>
          </div>
        </div>

        {/* Address */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Address:
          </label>
          <input
            type="text"
            className="block w-full mt-1 border border-gray-300 rounded-md p-2 bg-gray-100"
            value={formData.address}
            id="address"
            onChange={handleChange}
          />
        </div>

        {/* Website */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Website:
          </label>
          <input
            type="text"
            placeholder="e.g. example.com"
            className="block w-full mt-1 border border-gray-300 rounded-md p-2"
            value={formData.website}
            id="website"
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            placeholder="Write a short description"
            className="block w-full mt-1 border border-gray-300 rounded-md p-2 h-30"
            value={formData.description}
            id="description"
            onChange={handleChange}
          />
        </div>

        {/* Phone Fields */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number:
          </label>
          <input
            type="number"
            placeholder="e.g. 07991 123 456"
            className="block w-full mt-1 border border-gray-300 rounded-md p-2"
            value={formData.phoneNumber1}
            id="phoneNumber1"
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number:
          </label>
          <input
            type="number"
            placeholder="e.g. 07991 123 456"
            className="block w-full mt-1 border border-gray-300 rounded-md p-2"
            value={formData.phoneNumber2}
            id="phoneNumber2"
            onChange={handleChange}
          />
        </div>

        {/* Registration */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Registration Number:
          </label>
          <input
            type="text"
            placeholder="e.g. 123456789"
            className="block w-full mt-1 border border-gray-300 rounded-md p-2"
            value={formData.registrationNo}
            id="registrationNo"
            onChange={handleChange}
          />
        </div>

        {/* Certification Upload */}
        <div className="mt-4 border border-dotted border-teal-500 p-3 rounded-md">
          <label className="block text-sm font-medium text-gray-700">
            Certification
          </label>
          <div className="max-w-md mx-auto rounded-lg overflow-hidden">
            <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              {!preview ? (
                <div className="absolute flex flex-col items-center pointer-events-none">
                  <img
                    alt="File Icon"
                    className="mb-3"
                    src="https://img.icons8.com/dusk/64/000000/file.png"
                  />
                  <span className="block text-gray-500 font-semibold">
                    Drag & drop your files here
                  </span>
                  <span className="block text-gray-400 font-normal mt-1">
                    or click to upload
                  </span>
                </div>
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg "
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="h-full w-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleUploadImage}
              className="border-2 rounded-md hover:bg-blue-500 hover:text-white border-blue-500 py-2 px-6 font-bold"
            >
              {loadingImage ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Local preview of newly selected image (optional) */}
          {preview && (
            <div className="flex justify-center mt-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">New Image Preview:</h3>
                <img
                  src={preview}
                  alt="New"
                  className="rounded shadow-md w-64"
                />
              </div>
            </div>
          )}
        </div>

        {/* Document Upload */}
        <div className="mt-6 border border-dotted border-indigo-500 p-3 rounded-md">
          <label className="block text-sm font-medium text-gray-700">
            Supporting Documents
          </label>
          <div className="max-w-md mx-auto rounded-lg overflow-hidden">
            <div className="relative h-32 rounded-lg border-2 border-indigo-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div className="absolute flex flex-col items-center pointer-events-none text-center px-4">
                <img
                  alt="Document Icon"
                  className="mb-3"
                  src="https://img.icons8.com/dusk/64/000000/documents.png"
                />
                <span className="block text-gray-500 font-semibold">
                  Drag & drop documents here
                </span>
                <span className="block text-gray-400 font-normal mt-1">
                  Accepts PDF, DOCX, JPG, PNG
                </span>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                className="h-full w-full opacity-0 cursor-pointer"
                onChange={handleDocumentChange}
              />
            </div>
          </div>

          {documents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-base font-semibold text-gray-700">
                Documents ready to upload
              </h4>
              <ul className="mt-2 space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.name}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm text-sm"
                  >
                    <span className="text-gray-700 truncate pr-4">
                      {doc.name}
                    </span>
                    <span className="text-gray-500">
                      {(doc.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {formData.documentUrls.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-base font-semibold text-gray-700">
                Existing Documents
              </h4>
              <ul className="space-y-2">
                {formData.documentUrls.map((docUrl, index) => (
                  <li
                    key={docUrl}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm"
                  >
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 truncate max-w-xs sm:max-w-md"
                    >
                      Document {index + 1}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <RxCrossCircled className="w-4 h-4" />
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {error && <p className="text-red-600 mt-4">{error}</p>}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
