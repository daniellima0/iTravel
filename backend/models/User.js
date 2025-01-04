const { getUsersCollection } = require("../db");
const bcrypt = require("bcryptjs");

// Create a new user and insert into the database
const createUser = async (username, email, password) => {
  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the users collection
    const usersCollection = await getUsersCollection();

    // Insert the new user
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword, // Store the hashed password
    });

    return result;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const usersCollection = await getUsersCollection();
    return await usersCollection.find().toArray();
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

module.exports = { createUser, getAllUsers };
