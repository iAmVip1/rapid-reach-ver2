import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { buildPublicPath } from '../utils/fileHelpers.js';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, profilePicture } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, 'All fields are required'));
    }

    // If an image was uploaded via Multer, use it as the profile picture
    const uploadedProfilePic = req.file ? buildPublicPath(req.file.path) : null;
    const finalProfilePic = uploadedProfilePic || profilePicture || undefined;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: finalProfilePic,

      // convert string to boolean
      isHospital: req.body.isHospital === 'true' || req.body.isHospital === true,
      isFireDep: req.body.isFireDep === 'true' || req.body.isFireDep === true,
      isPoliceDep: req.body.isPoliceDep === 'true' || req.body.isPoliceDep === true,
      isPoliceVAn: req.body.isPoliceVAn === 'true' || req.body.isPoliceVAn === true,
      isAmbulance: req.body.isAmbulance === 'true' || req.body.isAmbulance === true,
      isBlood: req.body.isBlood === 'true' || req.body.isBlood === true,
      isFireTruck: req.body.isFireTruck === 'true' || req.body.isFireTruck === true,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Signup is successful' });

  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res.status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

 export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };