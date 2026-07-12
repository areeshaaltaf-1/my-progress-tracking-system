const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3. Generate JWT token ✅
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    // 4. Send token + only needed user fields ✅
    res.status(200).json({
      message: "Login successful",
      token,               // ← Login.jsx needs this
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,   // ← role-based redirect needs this
        department: user.department,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };