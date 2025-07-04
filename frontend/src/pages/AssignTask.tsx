import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
}

const AssignTask: React.FC = () => {
  const [experts, setExperts] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const getLeadEmail = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email;
    } catch {
      return "";
    }
  };

  const fetchExperts = async () => {
    const res = await fetch("http://localhost:8080/api/auth/users?role=expert");
    const data = await res.json();
    console.log(data);
    setExperts(data);
  };

  const handleAssign = async () => {
    const payload = {
      title,
      description,
      assigned_to: assignedTo || getLeadEmail(),
      status: "todo",
    };

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/api/tasks/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add this line
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("✅ Task assigned successfully");
      setTitle("");
      setDescription("");
      setAssignedTo("");
    } else {
      alert("❌ Failed to assign task");
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📌 Assign Task</h1>

      <label className="block font-medium mb-1">Assign To</label>
      <select
        className="w-full border px-3 py-2 mb-4 rounded"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Assign to Myself</option>
        {experts.map((u) => (
          <option key={u.email} value={u.email}>
            {u.name} ({u.email})
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Task Title"
        className="w-full border px-3 py-2 mb-4 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        className="w-full border px-3 py-2 mb-4 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={handleAssign}
      >
        Assign Task
      </button>
    </div>
  );
};

export default AssignTask;
