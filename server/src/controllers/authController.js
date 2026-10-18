// handles hashing passwords securely with bcryptjs and creating access passes with jsonwebtoken.
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  

// 1. User Registration
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: 'Username or email already in use' });
    }

    // Hash the password safely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate login token
    const token = jwt.sign({ userId: user._index || user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server registration error' });
  }
};

// 2. User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare input password with stored database hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate login token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server login error' });
  }
};

// 3. Get Logged-in User Profile Data
exports.getProfile = async (req, res) => {
  try {
    // Look up user by the ID injected into req.userId by the authMiddleware
    // .select('-password') ensures we don't accidentally leak the hashed password!
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving profile' });
  }
};
