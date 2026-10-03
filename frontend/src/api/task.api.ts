import { api } from "./axios";

export type TaskStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type TaskPriority =
  | "Low"
  | "Medium"
  | "High";

export interface Task {
  _id: string;
  title: string;
  description: string;
  vendorId: string;
  assignedTo?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  vendorId: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export const getTasks = async (vendorId?: string) => {
  const response = await api.get("/tasks", {
    params: vendorId ? { vendorId } : undefined,
  });

  return response.data;
};

export const getTaskById = async (taskId: string) => {
  const response = await api.get(`/tasks/${taskId}`);

  return response.data;
};

export const createTask = async (
  payload: CreateTaskPayload,
) => {
  const response = await api.post("/tasks", payload);

  return response.data;
};

export const updateTask = async (
  taskId: string,
  payload: UpdateTaskPayload,
) => {
  const response = await api.patch(
    `/tasks/${taskId}`,
    payload,
  );

  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
) => {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    { status },
  );

  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(`/tasks/${taskId}`);

  return response.data;
};