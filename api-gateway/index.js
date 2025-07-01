import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Middleware to forward JWT token
app.use((req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    req.headers["Authorization"] = token;
  }
  next();
});

// 🧭 User service proxy
app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://user-service:5001",
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" },
  })
);

// 📋 Task service proxy
app.use(
  "/api/tasks",
  createProxyMiddleware({
    target: "http://task-service:8000",
    changeOrigin: true,
    pathRewrite: { "^/api/tasks": "" },
  })
);

// ✅ Healthcheck route
app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🌐 API Gateway listening on port ${PORT}`);
});
