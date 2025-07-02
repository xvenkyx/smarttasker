import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Forward JWT token if present
app.use((req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    req.headers["Authorization"] = token;
  }
  next();
});

// 🧭 Debug log
app.use((req, res, next) => {
  console.log("👉 Gateway received:", req.method, req.url);
  next();
});

// 🧭 User service proxy
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://smarttasker-user-service:5001",
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "/api/auth", // ✅ preserve full path
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log("🔁 Proxying request to user-service:", req.method, req.url);
    },
    onError: (err, req, res) => {
      console.error("❌ Proxy error (user-service):", err.message);
      res.status(500).send("User Service unavailable");
    },
  })
);

// 📋 Task service proxy
app.use(
  "/api/tasks",
  createProxyMiddleware({
    target: "http://smarttasker-task-service:8000",
    changeOrigin: true,
    pathRewrite: {
      "^/api/tasks": "/api/tasks", // ✅ preserve full path
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log("🔁 Proxying request to task-service:", req.method, req.url);
    },
    onError: (err, req, res) => {
      console.error("❌ Proxy error (task-service):", err.message);
      res.status(500).send("Task Service unavailable");
    },
  })
);

// ✅ Healthcheck route
app.get("/", (req, res) => {
  res.send("🛡️ API Gateway is running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
});
