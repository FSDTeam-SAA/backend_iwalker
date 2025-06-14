import express from "express";

import { upload } from "../middlewares/upload";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { deleteAvatar, uploadAvatar } from "../controllers/userController";

const router = express.Router();

router.post(
  "/add-avatar",
  isAuthenticated,
  upload.single("avatar"),
  uploadAvatar as express.RequestHandler
);

router.delete(
  "/delete-avatar",
  isAuthenticated,
  deleteAvatar as express.RequestHandler
);

export default router;
