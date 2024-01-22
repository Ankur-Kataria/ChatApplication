const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const ENV = require("../config/DBConfig");

const registerUser = async (req, res) => {
  try {
    const { username, password, email, roles } = req.body;
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if roles exist
    const existingRoles = await Role.find({ name: { $in: roles } });
    if (existingRoles.length !== roles.length) {
      return res.status(400).json({ message: "Invalid role(s)" });
    }

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      roles: existingRoles.map((role) => role._id),
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", result: newUser });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, ENV.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, result: user });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const logoutUser = (req, res) => {
  // Clear JWT from client (cookie removal)
  res.clearCookie("token");
  res.json({ message: "Logout successful." });
};

const createUser = async (req, res) => {
  try {
    const { username, password, email, roles } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if roles exist
    const existingRoles = await Role.find({ name: { $in: roles } });
    if (existingRoles.length !== roles.length) {
      return res.status(400).json({ message: "Invalid role(s)" });
    }

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      roles: existingRoles.map((role) => role._id),
    });
    let result = await newUser.save();

    res.status(201).json({ message: "User created successfully", result });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const editUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const { username, password, email, roles } = req.body;

    // Check if the user exists
    const user = await User.findById({_id: userId});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Upadte the email
    if (email) {
      user.email = email;
    }

    // Upadte the email
    if (username) {
      user.username = username;
    }

    //update user role
    if (roles && roles.length > 0) {
      // Check if roles exist
      const existingRoles = await Role.find({ name: { $in: roles } });
      if (existingRoles.length !== roles.length) {
        return res.status(400).json({ message: "Invalid role(s)" });
      }
      user.roles = existingRoles.map((role) => role._id);
    }

    let result = await user.save();

    res.status(200).json({ message: "User updated successfully", result });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  createUser,
  editUser,
};
