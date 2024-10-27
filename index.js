// Charger les variables d'environnement
require("dotenv").config();

// Importer les modules nécessaires
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Créer une application Express
const app = express();

// Middlewares pour analyser les données JSON et les données encodées en URL
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Importer et utiliser un middleware de journalisation pour améliorer le suivi des requêtes
const { loggerMiddleware } = require("./middlewares/logger.middleware");
app.use(loggerMiddleware);

// Configuration de la documentation Swagger
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

// Configuration de la base de données
require("./config/db");

// Importer et monter les routes de stations de train
const trainstationRoutes = require("./routes/trainstations.routes");
app.use("/trainstations", trainstationRoutes);

const ticketRoutes = require("./routes/tickets.routes");
app.use("/tickets", ticketRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/users", userRoutes);

const trainRoutes = require("./routes/trains.routes");
app.use("/trains", trainRoutes);

// Gestion des erreurs de route non trouvée
const { notFoundHandler } = require("./middlewares/notFoundHandler.middleware");
const mongoose = require("mongoose");
app.use(notFoundHandler);

// Configuration du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app