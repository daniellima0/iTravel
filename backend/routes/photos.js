const express = require("express");
const { getPhotosByUserId, deleteAllPhotos } = require("../models/photo");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { getPhotosCollection, getUsersCollection } = require("../db");
const { ObjectId } = require("mongodb"); // Import ObjectId

const router = express.Router();
router.use(cookieParser());

const authenticateUser = (req, res, next) => {
  const token = req.cookies.authToken; // Ensure token is being read from cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    req.user = { id: decoded.userId }; // Attach user ID from token to request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error); // Log any errors
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// POST /photos - Add a new photo
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { image, location, createdAt } = req.body;
    const userId = req.user.id; // Extract user ID from authenticated request

    console.log("userId", userId);

    const photosCollection = await getPhotosCollection();
    const usersCollection = await getUsersCollection();

    // Create the new photo document
    const photo = {
      image,
      location,
      createdAt,
      userId, // Associate the photo with the current user
    };

    const result = await photosCollection.insertOne(photo);
    const photoId = result.insertedId; // Get the inserted photo's ID

    // Update the user's photos array with the new photo ID
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) }, // Convert userId to ObjectId
      { $push: { photos: photoId } } // Add the new photo ID to the photos array
    );

    const updatedUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    res
      .status(201)
      .json({ message: "Photo uploaded successfully!", photo, updatedUser });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ message: "Error uploading photo" });
  }
});

// Get photos for the authenticated user
router.get("/", authenticateUser, async (req, res) => {
  try {
    const photos = await getPhotosByUserId(req.user.id);
    res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /photos - Delete all photos
router.delete("/", async (req, res) => {
  try {
    const result = await deleteAllPhotos();

    res.status(200).json({
      message: "All photos have been deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting photos:", error);
    res.status(500).json({ message: "Error deleting photos" });
  }
});

module.exports = router;
