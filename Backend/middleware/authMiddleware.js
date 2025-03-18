import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error("Invalid token payload");

    console.log(`🔹 Decoded Token:`, decoded); // Log the decoded token

    req.user = { id: decoded.id }; // Ensure user ID is accessible
    next();
  } catch (error) {
    console.error("❌ Authentication error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
