import { useEffect, useState } from "react";
import {
  deleteTask,
  getTasks,
  updateTaskStatus,
  type Task,
  type TaskStatus,
} from "../api/task.api";

const statuses: TaskStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

const getStatusClass = (status: TaskStatus) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";

    case "In Progress":
      return "bg-blue-100 text-blue-700";

    case "Cancelled":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";

    case "Medium":
      return "bg-yellow-100 text-yellow-700";

    case "Low":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks();

      setTasks(response?.data ?? []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (
    taskId: string,
    status: TaskStatus,
  ) => {
    try {
      setError("");

      await updateTaskStatus(taskId, status);

      setTasks((current) =>
        current.map((task) =>
          task._id === taskId
            ? { ...task, status }
            : task,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update task status.");
    }
  };

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteTask(taskId);

      setTasks((current) =>
        current.filter((task) => task._id !== taskId),
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tasks
          </h1>

          <p className="text-sm text-gray-500">
            Manage vendor verification tasks
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          {tasks.length} Total Task
          {tasks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Loading tasks...
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            ✓
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No tasks found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Tasks created for vendors will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Task
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Assigned To
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Due Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {task.title}
                        </p>

                        <p className="mt-1 max-w-md text-sm text-gray-500">
                          {task.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {task.assignedTo || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(
                            task._id,
                            event.target
                              .value as TaskStatus,
                          )
                        }
                        className={`rounded-lg border-0 px-3 py-2 text-xs font-medium outline-none ${getStatusClass(
                          task.status,
                        )}`}
                      >
                        {statuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(task.dueDate)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(task._id)
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}