require("dotenv").config(); // Load environment variables from .env

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI; // Use the environment variable

// Create a MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to connect to MongoDB
const connectToMongo = async () => {
  try {
    // Connect to the MongoDB server
    await client.connect();
    // Send a ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Get the `users` collection from the `itravel-db` database
const getUsersCollection = () => {
  return client.db("itravel-db").collection("users");
};

// Export the connection function
module.exports = { connectToMongo, client, getUsersCollection };
