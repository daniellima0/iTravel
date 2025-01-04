const express = require("express");
const User = require("../models/User"); // Import the User model
const router = express.Router();

// GET route to retrieve all users
router.get("/getUsers", async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find(); // This queries all users in the "users" collection
    res.json(users); // Send the list of users as a JSON response
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
