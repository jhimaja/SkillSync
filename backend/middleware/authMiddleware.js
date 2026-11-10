const jwt = require("jsonwebtoken");

// This middleware protects private routes.
// It runs BEFORE the actual route logic and checks whether a valid JWT token
// was sent by the frontend in the "Authorization" header.
//
// Flow:
// 1. Frontend logs in -> backend sends back a JWT token.
// 2. Frontend stores token (in localStorage) and sends it with every request
//    that needs authentication, as: Authorization: Bearer <token>
// 3. This middleware reads that token, verifies it, and attaches the user's
//    id to req.user so the next controller function knows who is making the request.
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // jwt.verify checks the token's signature using our secret key.
    // If someone tampers with the token, this will throw an error.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };
    next(); // move on to the actual route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid or expired token.",
    });
  }
};

module.exports = protect;
