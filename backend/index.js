const express = require("express");
const { connectToMongo } = require("./db"); // Import database connection
const userRoutes = require("./routes/users"); // Import user routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Call the MongoDB connection function
connectToMongo();

// Hello World
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use the user routes
app.use("/users", userRoutes);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
