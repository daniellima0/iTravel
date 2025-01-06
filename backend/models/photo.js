const { getPhotosCollection } = require("../db");

// Save photo metadata
const savePhoto = async (photoData) => {
  try {
    const photosCollection = await getPhotosCollection();
    const result = await photosCollection.insertOne(photoData);
    return result;
  } catch (error) {
    throw new Error("Error saving photo: " + error.message);
  }
};

// Get all photos for a specific user
const getPhotosByUserId = async (userId) => {
  try {
    const photosCollection = await getPhotosCollection();
    return await photosCollection.find({ userId }).toArray();
  } catch (error) {
    throw new Error("Error fetching photos: " + error.message);
  }
};

// Delete all photos
const deleteAllPhotos = async () => {
  try {
    const photosCollection = await getPhotosCollection();
    const result = await photosCollection.deleteMany({});
    return result; // Return the number of deleted documents
  } catch (error) {
    throw new Error("Error deleting photos: " + error.message);
  }
};

module.exports = { savePhoto, getPhotosByUserId, deleteAllPhotos };
