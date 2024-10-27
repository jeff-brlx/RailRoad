const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Ticket = require("../models/tickets.models");

// Create a new user (Sign-up)
const registerUser = async (req, res) => {
  try {
      const { email, pseudo, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).send('Email is already in use.');
      }

      const newUser = new User({ email, pseudo, password, role: 'user' });
      await newUser.save();
      res.status(201).send('User created successfully!');
  } catch (error) {
      res.status(404).send(error.message);
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    res.status(200).send('Login successful');
  } catch (error) {
     res.status(404).send(error.message);
  }
};

// Get user details
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
      return res.status(403).send('Authorization headers required');
    }
    // Allow only if user is the owner or an admin
    if (userId === req.params.id || userRole === 'admin') {
      const updates = { ...req.body };

      const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!updatedUser) {
        return res.status(400).send("User not found");
      }else if(updatedUser){
        res.status(200).send("User updated successfully");
      }
    } else {
      return res.status(403).send('Unauthorized');
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

// Delete user (User can delete themselves or admin can delete any user)
const deleteUser = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
      return res.status(403).send('Authorization headers required');
    }

    // Allow only if user is the owner or an admin
    if (userId === req.params.id || userRole === 'admin') {
      await User.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true });
      await Ticket.updateMany({ userId: req.params.id }, { status: "Canceled" });
      return res.status(200).send('User deleted successfully');
    } else {
      return res.status(403).send('Unauthorized');
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser
};