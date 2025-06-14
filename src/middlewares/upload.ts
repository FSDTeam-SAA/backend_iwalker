import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/AppError";

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|tiff/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (!allowedTypes.test(ext)) {
    return cb(new AppError("Only image files are allowed", 400));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter,
});
