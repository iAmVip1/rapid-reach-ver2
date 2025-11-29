import express from 'express';
import { createPost, deletePost, getAllPosts, getPost, updatePost, approvePost } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../middleware/multer.js';

const router = express.Router();
const postMediaUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'documents', maxCount: 5 },
]);

// Create/Update Post with single image upload (field name: 'image')
router.post('/create', verifyToken, postMediaUpload, createPost);
router.delete('/delete/:id', verifyToken, deletePost);
router.post('/update/:id', verifyToken, postMediaUpload, updatePost);
router.get('/get/:id', getPost);
// Public list: approved only
router.get('/get', getAllPosts);
// Admin list with includeUnapproved=true support (auth required)
router.get('/admin/get', verifyToken, getAllPosts);
router.post('/approve/:id', verifyToken, approvePost);

export default router;
