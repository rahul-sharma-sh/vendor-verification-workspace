import mongoose, { Document, Schema } from "mongoose";

export type TaskStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type TaskPriority =
  | "Low"
  | "Medium"
  | "High";

export interface ITask extends Document {
  title: string;
  description: string;
  vendorId: mongoose.Types.ObjectId;
  assignedTo?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    assignedTo: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);