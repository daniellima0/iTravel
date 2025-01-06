export interface Photo {
  image: string | File; // Store as a base64 string or File object
  location: {
    longitude: number;
    latitude: number;
  } | null; // Optional location data
  createdAt: Date; // Timestamp when the photo was added
  description?: string; // Optional description of the photo
  [key: string]: any; // Additional fields for extensibility
}
