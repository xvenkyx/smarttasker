import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(cors());

// ✅ Use body-parser with a raw body capture
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

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

// 🧭 User service proxy (clean + raw body)
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://user-service:5001",
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "/api/auth" },
    onProxyReq: (proxyReq, req, res) => {
      if (req.rawBody) {
        proxyReq.setHeader("Content-Length", req.rawBody.length);
        proxyReq.write(req.rawBody);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`✅ user-service responded with status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("❌ Proxy error (user-service):", err.message);
      res.status(500).send("User Service unavailable");
    }
  })
);

// 📋 Task service proxy (use same raw body logic if POSTs are sent here)
app.use(
  "/api/tasks",
  createProxyMiddleware({
    target: "http://task-service:8000",
    changeOrigin: true,
    pathRewrite: { "^/api/tasks": "/tasks" },
    onProxyReq: (proxyReq, req, res) => {
      if (req.rawBody) {
        proxyReq.setHeader("Content-Length", req.rawBody.length);
        proxyReq.write(req.rawBody);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`✅ task-service responded with status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("❌ Proxy error (task-service):", err.message);
      res.status(500).send("Task Service unavailable");
    }
  })
);

// ✅ Healthcheck
app.get("/", (req, res) => {
  res.send("🛡️ API Gateway is running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
});
