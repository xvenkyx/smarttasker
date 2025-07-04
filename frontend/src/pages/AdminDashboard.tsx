import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
}

interface StatItem {
  status?: string;
  count: number;
  assigned_to?: string;
}

interface Stats {
  total_tasks: number;
  by_status: StatItem[];
  by_user: StatItem[];
}

const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append("status", statusFilter);
      if (userFilter) queryParams.append("assigned_to", userFilter);
      if (startDate && endDate) {
        queryParams.append("start_date", startDate);
        queryParams.append("end_date", endDate);
      }

      const res = await fetch(
        `http://localhost:8080/api/tasks/all?${queryParams.toString()}`
      );
      const data = await res.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tasks/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Admin Task Dashboard</h1>

      {/* Filter Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Filter by User"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={fetchTasks}
          className="md:col-span-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-semibold">Total Tasks</h2>
            <p className="text-2xl">{stats.total_tasks}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-semibold">Tasks by Status</h2>
            {stats.by_status.map((s, i) => (
              <p key={i}>
                {s.status}: {s.count}
              </p>
            ))}
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-semibold">Tasks by User</h2>
            {stats.by_user.map((u, i) => (
              <p key={i}>
                {u.assigned_to}: {u.count}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Task Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Assigned To</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td className="border px-4 py-2">{task.title}</td>
                  <td className="border px-4 py-2">{task.assigned_to}</td>
                  <td className="border px-4 py-2">{task.status}</td>
                  <td className="border px-4 py-2">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
