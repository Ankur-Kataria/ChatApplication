const express = require('express');
const connectDB = require('./src/config/dbConnection');
const ENV = require("./src/config/DBConfig");
const seedRoles = require("./src/routes/seedRole");
const userRoutes = require('./src/routes/user');
const groupRoutes = require("./src/routes/group")
const messageRoutes = require("./src/routes/messages");
const app = express();
const PORT = ENV.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/user', userRoutes);
app.use('/role', seedRoles);
app.use("/group", groupRoutes);
app.use("/messages", messageRoutes);

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
