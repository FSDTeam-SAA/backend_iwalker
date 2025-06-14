import express, { RequestHandler } from "express";
import {
  changePassword,
  login,
  registerUser,
} from "../controllers/authController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.post("/register", registerUser as express.RequestHandler);
router.route("/login").post(login as express.RequestHandler);
router.put(
  "/change-password",
  isAuthenticated,
  changePassword as RequestHandler
);

export default router;
