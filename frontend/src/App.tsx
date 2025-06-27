import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard.tsx';
import TaskBoard from './pages/TaskBoard.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks" element={<TaskBoard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
