const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authenticateUser = require("../middleware/authenticateUser");
const { createUser } = require("../models/user"); // Import the model
const { getUsersCollection } = require("../db");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// Use cookie-parser middleware to parse cookies in incoming requests
router.use(cookieParser());

// Create a status route that checks if the user is authenticated and still exists in the database
router.get("/status", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the request object (set by the authenticateUser middleware)

    // Query the users collection to check if the user still exists
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    // If the user does not exist, respond with a 404
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // If user exists, return the authenticated status and user details
    res.status(200).json({
      message: "Authenticated",
      user: {
        id: user._id,
        username: user.username, // Add other user details if needed
        email: user.email,
        // any other details you want to include
      },
    });
  } catch (error) {
    console.error("Error checking user status:", error);
    res.status(500).json({ message: "Error checking user status" });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password, photos } = req.body; // Include photos in the request body

  // Validate the input data
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    // Validate that `photos` is an array if provided
    if (photos && !Array.isArray(photos)) {
      return res
        .status(400)
        .json({ message: "Photos must be an array if provided." });
    }

    // Use the `createUser` function to insert the new user into the database
    const result = await createUser(username, email, password, photos || []); // Pass the photos array (default to empty array if not provided)

    // Generate a JWT token
    const token = jwt.sign(
      { userId: result.insertedId, username, email }, // Payload
      JWT_SECRET, // Secret key to sign the token
      { expiresIn: "2h" } // Expiration time
    );

    // Set the JWT token as an HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Make the cookie inaccessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure cookie is only sent over HTTPS in production
      maxAge: 7200000, // Cookie expiry time in milliseconds (2 hours)
      sameSite: "strict", // Restrict sending the cookie only to the same site
    });

    // Respond with the user details (excluding the password field)
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: result.insertedId,
        username,
        email,
        photos: photos || [], // Include photos in the response
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate the data
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // Get the users collection
    const usersCollection = await getUsersCollection();

    // Find the user by username
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email }, // Payload
      JWT_SECRET, // Secret key to sign the token
      { expiresIn: "1h" } // Token expiration time
    );

    // Set the JWT token in an HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 3600000, // Cookie expiry time (1 hour)
      sameSite: "Strict", // Mitigate CSRF attacks
    });

    // Respond with success message
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout route to clear the authToken cookie
router.post("/logout", (req, res) => {
  // Clear the authToken cookie by setting it to an empty value and expiring it immediately
  res.cookie("authToken", "", {
    httpOnly: true, // Ensure the cookie is not accessible via JavaScript
    secure: false, // Set to true if you're using HTTPS
    maxAge: 0, // Expire the cookie immediately
    sameSite: "Strict", // Mitigates CSRF attacks
  });

  // Send response confirming logout
  res.status(200).json({ message: "Successfully logged out" });
});

module.exports = router;
