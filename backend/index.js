require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectToMongo } = require("./db"); // Import database connection
const userRoutes = require("./routes/users"); // Import user routes
const authRoutes = require("./routes/auth"); // Import auth routes

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow credentials and explicitly set the origin
const corsOptions = {
  origin: "http://localhost:4200", // The frontend URL
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions)); // Use CORS middleware with the updated config

app.use(cookieParser()); // Enable cookie parsing for incoming requests

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

// Use the auth routes
app.use("/auth", authRoutes);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
