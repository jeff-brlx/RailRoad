const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3737;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/// ROUTES
app.use("/users" ,userRoutes)

/// DB CONFIG
require("./config/db");

/// SERVER LISTEN
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});





