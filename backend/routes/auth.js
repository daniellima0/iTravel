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

module.exports = router;
