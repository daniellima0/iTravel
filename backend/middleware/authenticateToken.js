require("dotenv").config(); // Load environment variables from .env
const jwt = require("jsonwebtoken");

// JWT Secret (Same secret key as used in registration)
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  // Get the token from cookies
  const token = req.cookies.authToken;

  // If no token is found
  if (!token) {
    return res
      .status(403)
      .json({ message: "No token provided, please log in." });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Call next() to pass control to the next middleware or route handler
    next();
  });
};

module.exports = authenticateToken;
