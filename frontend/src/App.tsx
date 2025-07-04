import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import UserTasks from "./pages/UserTasks.tsx";
import AssignTask from "./pages/AssignTask";
import Navbar from "./components/Navbar.tsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<UserTasks />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/assign-task" element={<AssignTask />} />
      </Routes>
    </>
  );
}

export default App;
