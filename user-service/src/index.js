require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
// In Express backend (user-service)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get("/api/auth/ping", (req, res) => {
  console.log("🔔 Pinged");
  res.json({ message: "pong" });
});

app.post("/api/auth/echo", (req, res) => {
  console.log("📦 Received body:", req.body);
  res.json({ received: req.body });
});

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
  })
  .catch(err => console.error(err));

//port forwarding