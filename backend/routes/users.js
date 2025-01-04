const express = require("express");
const jwt = require("jsonwebtoken");
const { createUser, getAllUsers } = require("../models/user"); // Import the model
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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

    // Create a JWT payload
    const payload = {
      id: result.insertedId,
      username,
      email,
    };

    // Sign the JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

    res.status(201).json({
      message: "User created successfully",
      token, // Return the token to the client
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
