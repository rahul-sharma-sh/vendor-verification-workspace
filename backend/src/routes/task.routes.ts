import { Router } from "express";

import {
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  getTasksController,
  updateTaskController,
  updateTaskStatusController,
} from "../controllers/task.controller.js";

const router = Router();

router.post("/", createTaskController);

router.get("/", getTasksController);

router.get("/:id", getTaskByIdController);

router.patch("/:id", updateTaskController);

router.patch(
  "/:id/status",
  updateTaskStatusController
);

router.delete("/:id", deleteTaskController);

export default router;