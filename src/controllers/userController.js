import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    const user = req.user;

    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    const uploadResult = await saveFileToCloudinary(
      req.file.buffer,
      user._id.toString(),
    );

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { avatar: uploadResult.secure_url },
      { new: true },
    );

    res.status(200).json({
      url: updatedUser.avatar,
    });
  } catch (err) {
    next(err);
  }
};

/* (опционально, но часто есть в структуре задания) */
export const getCurrentUser = async (req, res) => {
  const { _id, email, username, avatar } = req.user;

  res.json({
    _id,
    email,
    username,
    avatar,
  });
};