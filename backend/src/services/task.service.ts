import { Task, TaskPriority, TaskStatus } from "../models/Task.model.js";

export interface CreateTaskInput {
  title: string;
  description: string;
  vendorId: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export async function createTask(input: CreateTaskInput) {
  return Task.create({
    ...input,
    dueDate: input.dueDate
      ? new Date(input.dueDate)
      : undefined,
  });
}

export async function getTasks(vendorId?: string) {
  const filter = vendorId ? { vendorId } : {};

  return Task.find(filter)
    .populate("vendorId", "companyName email")
    .sort({ createdAt: -1 });
}

export async function getTaskById(id: string) {
  return Task.findById(id).populate(
    "vendorId",
    "companyName email"
  );
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput
) {
  const updateData: Record<string, unknown> = {
    ...input,
  };

  if (input.dueDate) {
    updateData.dueDate = new Date(input.dueDate);
  }

  return Task.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("vendorId", "companyName email");
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus
) {
  return Task.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).populate("vendorId", "companyName email");
}

export async function deleteTask(id: string) {
  return Task.findByIdAndDelete(id);
}