import express from "express";

import { upload } from "../middlewares/upload";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  deleteAvatar,
  getUserById,
  uploadAvatar,
} from "../controllers/userController";

const router = express.Router();

router
  .route("/add-avatar")
  .post(
    isAuthenticated,
    upload.single("avatar"),
    uploadAvatar as express.RequestHandler
  );

router
  .route("/delete-avatar")
  .delete(isAuthenticated, deleteAvatar as express.RequestHandler);

router
  .route("/profile")
  .get(isAuthenticated, getUserById as express.RequestHandler);

export default router;
