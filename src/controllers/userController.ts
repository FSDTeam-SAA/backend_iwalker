import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import { AppError } from "../utils/AppError";
import { deleteLocalFile } from "../utils/deleteLocalFile";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated";

// change avatar
export const uploadAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!req.file) throw new AppError("No file provided", 400);

    const localPath = req.file.path;

    const result = await cloudinary.uploader.upload(localPath, {
      folder: "avatars",
      use_filename: true,
      resource_type: "image",
    });

    if (user?.publicId) {
      await cloudinary.uploader.destroy(user.publicId);
    }

    user!.avatar = result.secure_url;
    user!.publicId = result.public_id;
    await user!.save();

    deleteLocalFile(localPath);

    return res.status(200).json({
      status: true,
      message: "Avatar uploaded successfully",
      avatar: user!.avatar,
    });
  } catch (error) {
    if (req.file?.path) deleteLocalFile(req.file.path);
    next(error);
  }
};

// delete avatar
export const deleteAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user?.avatar || !user?.publicId)
      throw new AppError("No avatar found to delete", 404);

    await cloudinary.uploader.destroy(user.publicId);

    user.avatar = undefined;
    user.publicId = undefined;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
