const mongoose = require("mongoose");

// Define the schema for a user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Add other fields if necessary
});

// Create a model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
