// import environment variables
require("dotenv").config();

// Import necessaries dependencies
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Create an Express app
const app = express();

// Middlewares to analyse json metadatas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import middleware To show request tested
const { loggerMiddleware } = require("./middlewares/logger.middleware");
app.use(loggerMiddleware);

// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Train Ticket System API",
      version: "1.0.0",
      description: "API documentation for managing train stations, tickets, users, and trains.",
    },
  },
  apis: ["swagger.yaml"],  
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// BDD configuration
require("./config/db");

// Import all the routes
const trainstationRoutes = require("./routes/trainstations.routes");
app.use("/trainstations", trainstationRoutes);

const ticketRoutes = require("./routes/tickets.routes");
app.use("/tickets", ticketRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/users", userRoutes);

const trainRoutes = require("./routes/trains.routes");
app.use("/trains", trainRoutes);

// Handle paths not found
const { notFoundHandler } = require("./middlewares/notFoundHandler.middleware");
const mongoose = require("mongoose");
app.use(notFoundHandler);

// Sever configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app