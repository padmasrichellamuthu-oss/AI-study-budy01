const User = require("../User");

async function listUsers(req, res) {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { listUsers };