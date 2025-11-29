import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Signup with single image upload (field name: 'image')
router.post('/signup', upload.single('image'), signup);
router.post('/signin', signin);
router.post('/google', google);

export default router;
