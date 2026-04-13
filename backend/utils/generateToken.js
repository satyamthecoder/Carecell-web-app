const jwt = require("jsonwebtoken");

const generateToken = (userId, name, role) => {
  return jwt.sign(
    {
      id: userId,
      name,
      role
    },
    process.env.JWT_SECRET || "secret123", // 🔥 fallback if env missing
    {
      expiresIn: "7d"
    }
  );
};

module.exports = { generateToken };