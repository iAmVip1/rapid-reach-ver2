import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Drive from '../models/drive.model.js';
import { buildPublicPath } from '../utils/fileHelpers.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }).lean();
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const test = (req, res) => {
    res.json({message: 'API is working'})
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId && !req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, 'Username can only contain letters and numbers'));
    }
  }

  try {
    const updatedFields = {};
    if (req.body.username) updatedFields.username = req.body.username;
    if (req.body.email) updatedFields.email = req.body.email;
    if (req.body.profilePicture) updatedFields.profilePicture = req.body.profilePicture;
    if (req.body.password) updatedFields.password = req.body.password;
    if (req.file) {
      const profilePath = buildPublicPath(req.file.path);
      if (profilePath) {
        updatedFields.profilePicture = profilePath;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updatedFields },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next (errorHandler(403, 'You are not allowed  to delete this user'));
  } 
  try {
   await User.findByIdAndDelete(req.params.userId);
   res.status(200).json('User has been deleted');
  } catch (error) {
    next(error)
  }
};

export const signout = (req, res, next) => {
try {
  res.clearCookie('access_token').status(200).json('User has been signed out');
} catch (error) {
  next(error);
}
}

export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = buildPublicPath(req.file.path);

    res.status(200).json({
      imageUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const posts = await Post.find({ userRef: req.params.id});
      res.status(200).json(posts);
    } catch (error) {
      next (error)
    }
  } else {
    return next (errorHandler(401, 'You can only view your own posts!'));
  }
}

export const getUserDrives = async (req, res, next) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const drives = await Drive.find({ userRef: req.params.id }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: drives });
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own drives!'));
  }
}

export const getCommentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
    
  }
}