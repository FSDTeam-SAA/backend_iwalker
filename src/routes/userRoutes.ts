import express from "express";

import { upload } from "../middlewares/upload";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { uploadImage } from "../controllers/userController";

const router = express.Router();

router.post(
  "/avatar-upload",
  isAuthenticated,
  upload.single("avatar"),
  uploadImage as express.RequestHandler
);

export default router;
