require("dotenv").config(); // Load environment variables from .env
const { MongoClient, ServerApiVersion } = require("mongodb");

// MongoDB connection URI
const uri = process.env.MONGODB_URI;
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
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Function to get the users collection
const getUsersCollection = async () => {
  return client.db("itravel-db").collection("users");
};

const getPhotosCollection = async () => {
  return client.db("itravel-db").collection("photos");
};

module.exports = { connectToMongo, getUsersCollection, getPhotosCollection };
