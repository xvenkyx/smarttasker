import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const UserTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return { email: "", role: "" };
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { email: payload.email, role: payload.role };
    } catch {
      return { email: "", role: "" };
    }
  };

  const fetchTasks = async () => {
    const { email, role } = getUserFromToken();
    setEmail(email);
    setRole(role);
    if (!email) return;

    const res = await fetch(
      `http://localhost:8080/api/tasks/my?email=${email}`
    );
    const data = await res.json();
    setTasks(data.tasks);
  };

  const updateTaskStatus = async (id: number, newStatus: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/tasks/task/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ include token
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) fetchTasks();
    else console.error("❌ Failed to update status", await res.text());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-md text-gray-600 mb-2">Logged in as: {email} ({role})</h2>
      <h1 className="text-2xl font-bold mb-4">🧑‍💻 My Tasks</h1>

      <table className="min-w-full table-auto border border-gray-300 rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Created</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No tasks assigned.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.status}</td>
                <td className="border px-4 py-2">
                  {new Date(task.created_at).toLocaleString()}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => updateTaskStatus(task.id, "in_progress")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to mark this task as done?"
                      );
                      if (confirmed) {
                        updateTaskStatus(task.id, "done");
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Done
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTasks;
