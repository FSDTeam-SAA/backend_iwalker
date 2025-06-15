import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated";
import { AppError } from "../utils/AppError";
import { Task } from "../models/task.model";

// create task
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, date, startTime, endTime, location, isFullDay } = req.body;

    if (!name || !date)
      throw new AppError("Task name and date are required", 400);

    if (!isFullDay && (!startTime || !endTime)) {
      throw new AppError(
        "Start time and end time are required if not full day",
        400
      );
    }

    const task = await Task.create({
      user: req.user?._id,
      name,
      date,
      startTime: isFullDay ? undefined : startTime,
      endTime: isFullDay ? undefined : endTime,
      location,
      isFullDay,
    });

    return res.status(201).json({
      status: true,
      statusCode: 200,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// get all tasks
export const getAllTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    const tasks = await Task.find({ user: userId }).populate(
      "user",
      "name email avatar"
    );

    return res.status(200).json({
      status: true,
      statusCode: 200,
      count: tasks.length,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// get a particular task
export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?._id;

    const task = await Task.findOne({ _id: taskId, user: userId }).populate(
      "user",
      "name email avatar"
    );

    if (!task) {
      throw new AppError("Task not found or you do not have permission", 404);
    }

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// update task
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?._id;

    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      throw new AppError("Task not found or unauthorized access", 404);
    }

    const { name, date, startTime, endTime, location, isFullDay } = req.body;

    if (name !== undefined) task.name = name;
    if (date !== undefined) task.date = date;
    if (startTime !== undefined) task.startTime = startTime;
    if (endTime !== undefined) task.endTime = endTime;
    if (location !== undefined) task.location = location;
    if (isFullDay !== undefined) task.isFullDay = isFullDay;

    await task.save();

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// delete task
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?._id;

    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      throw new AppError("Task not found or unauthorized access", 404);
    }

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
