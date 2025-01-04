require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const jwt = require("jsonwebtoken");
const { getAllUsers } = require("../models/user"); // Import the model
const cookieParser = require("cookie-parser");

const router = express.Router();

// Use cookie-parser middleware to parse cookies in incoming requests
router.use(cookieParser());

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
