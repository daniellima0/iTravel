require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const jwt = require("jsonwebtoken");
const { createUser, getAllUsers } = require("../models/user"); // Import the model
const authenticateToken = require("../middleware/authenticateToken");
const cookieParser = require("cookie-parser");

const router = express.Router();

// Use cookie-parser middleware to parse cookies in incoming requests
router.use(cookieParser());

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

// POST route to create a new user and set HttpOnly cookie
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate the input data
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    // Assuming createUser is a function that creates a user in the database
    const result = await createUser(username, email, password);

    // Generate a JWT token
    const token = jwt.sign(
      { userId: result.insertedId, username: username, email: email }, // Payload
      JWT_SECRET, // Secret key to sign the token
      { expiresIn: "2h" } // Expiration time
    );

    // Set the JWT token as an HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Make the cookie inaccessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure cookie is only sent over HTTPS in production
      maxAge: 7200000, // Cookie expiry time in milliseconds (1 hour)
      sameSite: "strict", // Restrict sending the cookie only to the same site
    });

    // Respond with the user details (you can exclude the password field)
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
