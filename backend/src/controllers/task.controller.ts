import { Request, Response } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../services/task.service.js";
import { TaskPriority, TaskStatus } from "../models/Task.model.js";
import { Vendor } from "../models/Vendor.model.js";

export async function createTaskController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      title,
      description,
      vendorId,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    if (!title || !description || !vendorId) {
      res.status(400).json({
        success: false,
        message: "title, description and vendorId are required",
      });
      return;
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
      return;
    }

    const task = await createTask({
      title,
      description,
      vendorId,
      assignedTo,
      priority,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
}

export async function getTasksController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const vendorId =
      typeof req.query.vendorId === "string"
        ? req.query.vendorId
        : undefined;

    const tasks = await getTasks(vendorId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
}

export async function getTaskByIdController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const task = await getTaskById(String(req.params.id));

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
}

export async function updateTaskController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const task = await updateTask(
      String(req.params.id),
      req.body
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
}

export async function updateTaskStatusController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { status } = req.body;

    const validStatuses: TaskStatus[] = [
      "Pending",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
      return;
    }

    const task = await updateTaskStatus(
      String(req.params.id),
      status
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
}

export async function deleteTaskController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const task = await deleteTask(String(req.params.id));

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
}