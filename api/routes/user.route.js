import express from 'express';
import { test, updateUser, deleteUser, signout, getUserPosts, getAllUsers, getUserDrives, getCommentUser, uploadProfileImage } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/test', test );
router.get('/', getAllUsers);
router.put('/update/:userId', verifyToken, upload.single('profilePicture'), updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/posts/:id', verifyToken, getUserPosts)
router.get('/drive/:id', verifyToken, getUserDrives)
router.get('/:userId', getCommentUser)
router.post('/upload/profile', verifyToken, upload.single('profilePicture'), uploadProfileImage);


export default router;