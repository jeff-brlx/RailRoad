const bcrypt = require('bcrypt');
const User = require('../models/userModel');




// Create a new user (Sign-up)
const registerUser = async (req, res) => {
  try {
      const { email, pseudo, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'Email is already in use.' });
      }

      // Create a new user instance
      const newUser = new User({ email, pseudo, password, role: 'user' });

      // Save the new user to the database
      await newUser.save();
      res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If the credentials are correct, you can create a session, token, etc.
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user details (Only accessible by the user or employee/admin)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user details (User can update only themselves or admin can update any user)
const updateUser = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
      return res.status(403).json({ message: 'Authorization headers required' });
    }

    // Allow only if user is the owner or an admin
    if (userId === req.params.id || userRole === 'admin') {
      const updates = { ...req.body };
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
      res.status(200).json(updatedUser);
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user (User can delete themselves or admin can delete any user)
const deleteUser = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
      return res.status(403).json({ message: 'Authorization headers required' });
    }

    // Allow only if user is the owner or an admin
    if (userId === req.params.id || userRole === 'admin') {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser
};