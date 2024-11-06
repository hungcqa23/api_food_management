import catchAsync from '../utils/catchAsync';
import { Response, NextFunction } from 'express';
import User from '../models/schemas/user.schema';
import AppError from '../utils/app-error';
import factory from './factory.controllers';
import multer, { Multer } from 'multer';

import { AuthRequest } from '../models/interfaces/model.interfaces';

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const deleteUser = factory.deleteOne(User);
const deleteMe = factory.deleteOne(User);

const upload: Multer = multer({
  storage: multer.memoryStorage()
});
const uploadAvatar = upload.single('avatar');

const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
});

const filterObj = (obj: { [key: string]: any }, ...allowedFields: string[]) => {
  const newObj: { [key: string]: any } = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const updateMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let userId = req.user.id;
  if (req.params.id && req.user.role === 'admin') {
    userId = req.params.id;
  } else {
    return next(new AppError(`This route is not implemented!!`));
  }

  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError(`This route is not for password updates. Please use /update-my-password`));

  const filteredBody = filterObj(req.body, 'firstName', 'lastName');
  if (req.file) filteredBody.avatar = req.file?.buffer;

  const user = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export default {
  getAllUsers,
  getUser,
  deleteUser,
  getMe,
  deleteMe,
  updateMe
};
