const mongoose = require("mongoose");

// user-service/models/User.js (MongoDB)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "lead", "expert"],
    required: true,
  }
});


module.exports = mongoose.model("User", userSchema);