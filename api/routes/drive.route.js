import express from 'express';
import { createDrive, deleteDrive, getAllDrives, getDrive, updateDrive, approveDrive, ownerGetDrive } from '../controllers/drive.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../middleware/multer.js';

const router = express.Router();
const driveMediaUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'documents', maxCount: 5 },
]);

// Create/Update Drive with single image upload (field name: 'image')
router.post('/create', verifyToken, driveMediaUpload, createDrive);
router.delete('/delete/:id', verifyToken, deleteDrive);
router.post('/update/:id', verifyToken, driveMediaUpload, updateDrive);
router.get('/get/:id', getDrive);
router.get('/owner-get/:id', verifyToken, ownerGetDrive);
// Public list: approved only
router.get('/get', getAllDrives);
// Admin list with includeUnapproved=true support (auth required)
router.get('/admin/get', verifyToken, getAllDrives);
router.post('/approve/:id', verifyToken, approveDrive);

export default router;

