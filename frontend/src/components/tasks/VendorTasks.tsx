import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "../../api/task.api";

interface VendorTasksProps {
  vendorId: string;
}

const statuses: TaskStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

const priorities: TaskPriority[] = [
  "Low",
  "Medium",
  "High",
];

const getPriorityClass = (
  priority: TaskPriority,
) => {
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

const getStatusClass = (
  status: TaskStatus,
) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";

    case "In Progress":
      return "bg-blue-100 text-blue-700";

    case "Cancelled":
      return "bg-gray-100 text-gray-600";

    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const formatDate = (date?: string) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function VendorTasks({
  vendorId,
}: VendorTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [assignedTo, setAssignedTo] =
    useState("");
  const [priority, setPriority] =
    useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks(vendorId);

      setTasks(response?.data ?? []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      loadTasks();
    }
  }, [vendorId]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setPriority("Medium");
    setDueDate("");
  };

  const handleCreateTask = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Task description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createTask({
        title: title.trim(),
        description: description.trim(),
        vendorId,
        assignedTo: assignedTo.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      });

      resetForm();
      setShowCreateForm(false);

      await loadTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    status: TaskStatus,
  ) => {
    try {
      setError("");

      await updateTaskStatus(taskId, status);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status,
              }
            : task,
        ),
      );
    } catch (err) {
      console.error(
        "Failed to update task status:",
        err,
      );

      setError("Failed to update task status.");
    }
  };

  const handleDelete = async (
    taskId: string,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task._id !== taskId,
        ),
      );
    } catch (err) {
      console.error("Failed to delete task:", err);

      setError("Failed to delete task.");
    }
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Tasks
        </h2>

        <p className="text-sm text-gray-500">
          Loading tasks...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage vendor verification tasks
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreateForm((value) => !value)
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {showCreateForm
            ? "Cancel"
            : "+ Create Task"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form
          onSubmit={handleCreateTask}
          className="mb-6 rounded-xl border border-blue-100 bg-blue-50/40 p-5"
        >
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Create New Task
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Verify GST document"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={3}
                placeholder="Describe the task..."
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Assigned To
              </label>

              <input
                type="text"
                value={assignedTo}
                onChange={(event) =>
                  setAssignedTo(event.target.value)
                }
                placeholder="Team member"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as TaskPriority,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {priorities.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create Task"}
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">
            No tasks found for this vendor.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowCreateForm(true)
            }
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            Create the first task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="rounded-xl border border-gray-200 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {task.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                        task.priority,
                      )}`}
                    >
                      {task.priority}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        task.status,
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-gray-600">
                    {task.description}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <span className="text-gray-400">
                        Assigned To
                      </span>

                      <p className="mt-1 font-medium text-gray-700">
                        {task.assignedTo || "-"}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-400">
                        Due Date
                      </span>

                      <p className="mt-1 font-medium text-gray-700">
                        {formatDate(task.dueDate)}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-400">
                        Created
                      </span>

                      <p className="mt-1 font-medium text-gray-700">
                        {formatDate(task.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:w-44">
                  <select
                    value={task.status}
                    onChange={(event) =>
                      handleStatusChange(
                        task._id,
                        event.target
                          .value as TaskStatus,
                      )
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
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

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(task._id)
                    }
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}