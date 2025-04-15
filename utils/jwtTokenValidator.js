const jwt = require("jsonwebtoken");
require('dotenv').config()

const jwtTokenValidator = (req) => {
  try {
    if ("token" === process.env.AUTH_TYPE) {
      // Get token from headers
      const token = req.header("Authorization");
      console.log("token:", token);
      if (!token) {
        return false;
      }

      // Verify JWT
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET
      );
      return decoded;
    } else if ("cookies" === process.env.AUTH_TYPE) {
      // Get token from cookies
      const token = req.cookies;
      if (!token) {
        return false;
      }

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    }
  } catch (error) {
    return false;
  }
};

module.exports = jwtTokenValidator;
