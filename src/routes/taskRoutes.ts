import express, { RequestHandler } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  toggleTaskNotification,
  updateTask,
} from "../controllers/taskController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, createTask as RequestHandler)
  .get(isAuthenticated, getAllTasks as RequestHandler);

router
  .route("/:taskId")
  .get(isAuthenticated, getTaskById as RequestHandler)
  .put(isAuthenticated, updateTask as RequestHandler)
  .delete(isAuthenticated, deleteTask as RequestHandler);

router
  .route("/:taskId/notification")
  .patch(isAuthenticated, toggleTaskNotification as RequestHandler);

export default router;
