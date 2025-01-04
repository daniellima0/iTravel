const express = require("express");
const { connectToMongo, getUsersCollection } = require("./db"); // Import the MongoDB connection

const app = express();
const port = process.env.PORT || 3000;

// Call the MongoDB connection function
connectToMongo();

// Example route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Create a route to get all users
app.get("/users", async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const users = await usersCollection.find().toArray(); // Query all users and convert to array
    res.json(users); // Send the users as JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
