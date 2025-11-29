import Drive from "../models/drive.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { buildPublicPath, parseArrayField } from "../utils/fileHelpers.js";

const getUploadedPaths = (files = []) =>
  (files || []).map((file) => buildPublicPath(file.path)).filter(Boolean);

export const createDrive = async (req, res, next) => {
    try {
        const licenseFile = req.file || req.files?.image?.[0];
        if (!licenseFile) {
            return next(errorHandler(400, 'License image is required'));
        }
        const licenseUrl = buildPublicPath(licenseFile.path);

        const documentUploads = getUploadedPaths(req.files?.documents);
        const persistedDocuments = parseArrayField(req.body.documentUrls);
        const documentUrls = [...persistedDocuments, ...documentUploads];

        if (documentUrls.length === 0) {
            return next(errorHandler(400, 'At least one vehicle document is required'));
        }

        const drivePayload = { 
            ...req.body, 
            approved: false,
            licenseUrls: [licenseUrl],
            documentUrls,
        };
        const drive = await Drive.create(drivePayload);
        return res.status(201).json(drive);

    } catch (error) {
        next(error);
        
    }
}

export const deleteDrive = async (req, res, next) => {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
        return next (errorHandler(404, 'Drive not found'));
    }
    if ( !req.user.isAdmin && req.user.id !== drive.userRef.toString()) {
        return next(errorHandler(401, 'You can only delete your own drives!'));
    }
    try {
        await Drive.findByIdAndDelete(req.params.id);
        res.status(200).json('Drive has been deleted! ')
    } catch (error) {
        next(error);
    }
}

export const updateDrive = async (req, res, next) => {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
        return next (errorHandler(404, 'Drive not found'));
    }
    if (!req.user.isAdmin && req.user.id !== drive.userRef) {
        return next(errorHandler(401, 'You can only update your own drive!'));
    }

    try {
        const updateData = { ...req.body };

        if (typeof updateData.documentUrls !== "undefined") {
            updateData.documentUrls = parseArrayField(updateData.documentUrls);
        }
        if (typeof updateData.licenseUrls !== "undefined") {
            updateData.licenseUrls = parseArrayField(updateData.licenseUrls);
        }

        const licenseFile = req.file || req.files?.image?.[0];
        if (licenseFile) {
            const licenseUrl = buildPublicPath(licenseFile.path);
            updateData.licenseUrls = [licenseUrl];
        }

        const newDocuments = getUploadedPaths(req.files?.documents);
        if (newDocuments.length) {
            const baseDocuments = Array.isArray(updateData.documentUrls)
                ? updateData.documentUrls
                : [];
            updateData.documentUrls = [...baseDocuments, ...newDocuments];
        }

        const updatedDrive = await Drive.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.status(200).json(updatedDrive);
    } catch (error) {
        next(error)
    }
}

export const getDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
   
    if (!drive) {
      return next(errorHandler(404, "Drive not found (no record)"));
    }

    if (!drive.approved) {
      return next(errorHandler(404, "Drive not found (not approved)"));
    }

    res.status(200).json(drive);
  } catch (error) {
    next(error);
  }
};

// Auth-required: allow owner/admin to view regardless of approval
export const ownerGetDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return next(errorHandler(404, 'Drive not found'));
    }
    const isOwner = req.user?.isAdmin || req.user?.id === drive.userRef?.toString();
    if (!isOwner && !drive.approved) {
      return next(errorHandler(404, 'Drive not found'));
    }
    return res.status(200).json(drive);
  } catch (error) {
    next(error);
  }
}

export const getAllDrives = async (req, res, next) => {
  try {
    // Extract search params from query string
    const { vechicleNumber, defaultAddress, vehicleType, userName, includeUnapproved, category} = req.query;

    // Build a dynamic filter object
    const filter = {};

    if (vechicleNumber) {
      filter.vechicleNumber = { $regex: vechicleNumber, $options: "i" }; 
    }
    if (userName) {
      filter.userName = { $regex: userName, $options: "i" }; 
    }
    if (defaultAddress) {
      filter.defaultAddress = { $regex: defaultAddress, $options: "i" };
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    // Filter by vehicle type (isAmbulance, isPoliceVAn, isFireTruck) by filtering users first
    if (vehicleType) {
      let userRoleFilter = {};
      if (vehicleType === 'ambulance') {
        userRoleFilter.isAmbulance = true;
      } else if (vehicleType === 'police-vehicle' || vehicleType === 'policeVec') {
        userRoleFilter.isPoliceVAn = true;
      } else if (vehicleType === 'fire-truck' || vehicleType === 'fireTruck') {
        userRoleFilter.isFireTruck = true;
      }

      // Find users with the specified role
      const usersWithRole = await User.find(userRoleFilter).select('_id');
      const userIds = usersWithRole.map(user => user._id.toString());
      
      // Filter drives by userRef
      if (userIds.length > 0) {
        filter.userRef = { $in: userIds };
      } else {
        // No users found with this role, return empty result
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }
    }

    // Default: only approved drives
    filter.approved = true;

    // Allow including unapproved only if the requester is an admin (requires auth middleware on route)
    if (includeUnapproved === 'true' && req.user?.isAdmin) {
      delete filter.approved;
    }

    const drives = await Drive.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      data: drives,
    });
  } catch (error) {
    next(error);
  }
};

export const approveDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return next(errorHandler(404, 'Drive not found'));

    if (!req.user?.isAdmin) {
      return next(errorHandler(403, 'Forbidden'));
    }

    drive.approved = true;
    await drive.save();

    res.status(200).json({ success: true, data: drive });
  } catch (error) {
    next(error);
  }
}

