const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Use cookie-parser middleware to parse cookies in incoming requests
router.use(cookieParser());

// Create a status route that checks if the user is authenticated
router.get("/status", authenticateToken, (req, res) => {
  // If we are here, it means the token is valid and the user is authenticated
  res.status(200).json({
    message: "Authenticated",
    user: req.user, // You can send back user details here if needed
  });
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
