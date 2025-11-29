import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RxCrossCircled } from 'react-icons/rx'


export default function UpdateDrivepost() {
  const navigate = useNavigate();
  const { driveId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    defaultAddress: '',
    phoneNumber1: '',
    phoneNumber2: '',
    licenseNo: '',
    vechicleNumber: '',
    company: '',
    licenseUrls: [],
    documentUrls: [],
    category: '',
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [licenseImage, setLicenseImage] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [licenseUploading, setLicenseUploading] = useState(false);

  const [vehicleDocs, setVehicleDocs] = useState([]);
  const [vehicleDocUploading, setVehicleDocUploading] = useState(false);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        setLoadingInitial(true);
        const res = await fetch(`/api/drive/owner-get/${driveId}`);
        const data = await res.json();
        if (data?.success === false) {
          setError(data.message || 'Failed to load drive');
        } else if (data?._id) {
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            defaultAddress: data.defaultAddress || '',
            phoneNumber1: data.phoneNumber1 || '',
            phoneNumber2: data.phoneNumber2 || '',
            licenseNo: data.licenseNo || '',
            vechicleNumber: data.vechicleNumber || '',
            company: data.company || '',
            licenseUrls: Array.isArray(data.licenseUrls) ? data.licenseUrls : [],
            documentUrls: Array.isArray(data.documentUrls) ? data.documentUrls : [],
            category: data.category || '',
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingInitial(false);
      }
    };
    if (driveId) fetchDrive();
  }, [driveId]);

  // Set category based on user role - MUST be before any early returns
  useEffect(() => {
    if (currentUser) {
      let cat = "";
      if (currentUser.isPoliceVAn) cat = "police-vehicle";
      else if (currentUser.isAmbulance) cat = "ambulance";
      else if (currentUser.isFireTruck) cat = "fire-truck";

      setFormData((prev) => ({
        ...prev,
        category: cat,
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const key = name || id;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLicenseFileChange = (e) => {
    const file = e.target.files[0];
    setLicenseImage(file);
    setLicensePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUploadLicense = () => {
    alert('License image will be uploaded when you submit the form.');
  };

  const handleRemoveLicense = (index) => {
    setFormData((prev) => ({
      ...prev,
      licenseUrls: prev.licenseUrls.filter((_, i) => i !== index),
    }));
  };

  const handleVehicleDocChange = (e) => {
    const files = Array.from(e.target.files || []);
    setVehicleDocs(files);
  };

  const handleUploadVehicleDoc = () => {
    alert('Document will be uploaded when you submit the form.');
  };

  const handleRemoveVehicleDoc = (index) => {
    setFormData((prev) => ({
      ...prev,
      documentUrls: prev.documentUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // basic validations
      const hasDocuments =
        vehicleDocs.length > 0 ||
        (Array.isArray(formData.documentUrls) &&
          formData.documentUrls.length > 0);
      if (formData.licenseUrls.length < 1)
        return setError('You must upload at least one license image');
      if (!hasDocuments)
        return setError('You must include at least one vehicle document');
      if (!formData.firstName || !formData.lastName) return setError('Name is required');
      if (!formData.defaultAddress) return setError('Default address is required');
      if (!formData.licenseNo) return setError('License number is required');
      if (!formData.company) return setError('Company is required');
      if (!formData.vechicleNumber) return setError('Vehicle number is required');
      if (String(formData.phoneNumber1).length < 10) return setError('Phone numbers must be 10 numbers');
      if (String(formData.phoneNumber2).length < 10) return setError('Phone numbers must be 10 numbers');
      if (formData.phoneNumber1 == formData.phoneNumber2) return setError('Phone numbers must be different');

      setLoading(true);
      setError(false);

      const formDataToSend = new FormData();
      Object.entries({
        ...formData,
        userRef: currentUser._id,
        userMail: currentUser.email,
        userImage: currentUser.profilePicture,
        userName: currentUser.username,
      }).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });
      if (licenseImage) {
        formDataToSend.append('image', licenseImage);
      }
      vehicleDocs.forEach((doc) => formDataToSend.append('documents', doc));

      const res = await fetch(`/api/drive/update/${driveId}`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message || 'Failed to update drive');
        return;
      }
      navigate('/dashboard?tab=drive');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
 
  if (loadingInitial) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen ">
        <div className="text-center text-gray-600 my-10">Loading drive...</div>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen ">
      <h1 className="text-center text-3xl my-7 font-semibold ">
        Please fill up the details.
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-2xl">

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              placeholder="Name"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 bg-gray-100 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Surname"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 bg-gray-100 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Default Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Default Address
          </label>
          <input
            type="text"
            placeholder="Address"
            id="defaultAddress"
            value={formData.defaultAddress}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 bg-gray-100 focus:ring-2 focus:ring-blue-400"
          />
        </div>
 
        {/* Phone Numbers */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number 1
          </label>
          <input
            type="number"
            placeholder="Enter your Number"
            id="phoneNumber1"
            value={formData.phoneNumber1}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number 2
          </label>
          <input
            type="number"
            placeholder="Enter your Number"
            id="phoneNumber2"
            value={formData.phoneNumber2}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Number
          </label>
          <input
            type="text"
            placeholder="License"
            id="licenseNo"
            value={formData.licenseNo}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* License Image Section */}
        <div className="border border-dotted border-teal-500 p-3 rounded-md">
          <label className="block text-sm font-medium text-gray-700">
            License Image
          </label>

          <div className="max-w-md mx-auto mt-3 rounded-lg overflow-hidden">
            <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              {!licensePreview ? (
                <div className="absolute flex flex-col items-center text-center px-4">
                  <img
                    alt="File Icon"
                    className="mb-3"
                    src="https://img.icons8.com/dusk/64/000000/file.png"
                  />
                  <span className="text-gray-500 font-semibold">
                    Drag & drop your files here
                  </span>
                  <span className="text-gray-400 font-normal mt-1">
                    or click to upload
                  </span>
                </div>
              ) : (
                <img
                  src={licensePreview}
                  alt="License Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="h-full w-full opacity-0 cursor-pointer"
                onChange={handleLicenseFileChange}
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleUploadLicense}
              className="border-2 rounded-md hover:bg-blue-500 hover:text-white border-blue-500 py-2 px-6 font-bold transition"
            >
              {licenseUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {formData.licenseUrls.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="text-base font-semibold text-gray-700">License Gallery</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.licenseUrls.map((imgUrl, index) => (
                  <div key={imgUrl} className="relative group">
                    <img src={imgUrl} alt={`Uploaded ${index + 1}`} className="rounded-lg shadow-md w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveLicense(index)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 rounded-full p-1 transition-colors"
                      title="Remove image"
                    >
                      <RxCrossCircled className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

         {/* Vechile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vechicle Number
          </label>
          <input
            type="text"
            placeholder="Vechicle"
            id="vechicleNumber"
            value={formData.vechicleNumber}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Vechile Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vechicle Company
          </label>
          <input
            type="text"
            placeholder="Company Name"
            id="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Vehchile Upload (documents stay on Cloudinary via existing URLs; new uploads are optional) */}
        <div className="border border-dotted border-indigo-500 p-3 rounded-md">
          <label className="block text-sm font-medium text-gray-700">
            Vechicle Documents (Blue Book)
          </label>

          <div className="max-w-md mx-auto mt-3 rounded-lg overflow-hidden">
            <div className="relative h-32 rounded-lg border-2 border-indigo-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div className="absolute flex flex-col items-center text-center px-4">
                <img
                  alt="Document Icon"
                  className="mb-3"
                  src="https://img.icons8.com/dusk/64/000000/documents.png"
                />
                <span className="text-gray-500 font-semibold">
                  Drag & drop documents here
                </span>
                <span className="text-gray-400 font-normal mt-1">
                  Accepts PDF, DOCX, JPG, PNG
                </span>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="h-full w-full opacity-0 cursor-pointer"
                onChange={handleVehicleDocChange}
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleUploadVehicleDoc}
              className="border-2 rounded-md hover:bg-indigo-500 hover:text-white border-indigo-500 py-2 px-6 font-bold transition"
            >
              {vehicleDocUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>

        {vehicleDocs.length > 0 && (
          <div className="mt-4">
            <h4 className="text-base font-semibold text-gray-700">
              Documents ready to upload
            </h4>
            <ul className="mt-2 space-y-2">
              {vehicleDocs.map((doc) => (
                <li
                  key={doc.name}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm text-sm"
                >
                  <span className="text-gray-700 truncate pr-4">{doc.name}</span>
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
                Uploaded Documents
              </h4>
              <ul className="space-y-2">
                {formData.documentUrls.map((docUrl, index) => (
                  <li key={docUrl} className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
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
                      onClick={() => handleRemoveVehicleDoc(index)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}
