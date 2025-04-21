import jwt from 'jsonwebtoken';
import { User } from '../models/auth.model.js';

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during authentication"
    });
  }
};
