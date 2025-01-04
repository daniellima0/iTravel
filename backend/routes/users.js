const express = require("express");
const { createUser, getAllUsers } = require("../models/user"); // Import the model
const router = express.Router();

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

// POST to create a new user
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate the data
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    const result = await createUser(username, email, password);
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: result.insertedId,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

module.exports = router;
