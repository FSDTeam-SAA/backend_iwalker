import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import { AppError } from "../utils/AppError";
import { deleteLocalFile } from "../utils/deleteLocalFile";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) throw new AppError("No file provided", 400);

    const localPath = req.file.path;

    const result = await cloudinary.uploader.upload(localPath, {
      folder: "uploads",
      use_filename: true,
      resource_type: "image",
    });

    deleteLocalFile(localPath);

    return res.status(200).json({
      status: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    if (req.file?.path) deleteLocalFile(req.file.path);
    next(error);
  }
};
