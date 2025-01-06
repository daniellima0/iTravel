require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const { getAllUsers, deleteAllUsers } = require("../models/user"); // Import the model
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

// DELETE all users
router.delete("/", async (req, res) => {
  try {
    const result = await deleteAllUsers(); // Call the model function to delete all users
    res.status(200).json({
      message: "All users have been deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all users:", error);
    res.status(500).json({ message: "Error deleting all users" });
  }
});

module.exports = router;
