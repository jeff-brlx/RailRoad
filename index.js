// Charger les variables d'environnement
require("dotenv").config();

// Importer les modules nécessaires
const express = require('express');

// Créer une application Express
const app = express();

// Middlewares pour analyser les données JSON et les données encodées en URL
app.use(express.json());  // pour analyser les données application/json
app.use(express.urlencoded({ extended: false }));  // pour analyser les données application/x-www-form-urlencoded

// Importer et utiliser un middleware de journalisation pour améliorer le suivi des requêtes
const { loggerMiddleware } = require("./middlewares/logger.middleware");
app.use(loggerMiddleware);

// Configuration de la base de données
require("./config/db");

// Importer et monter les routes de stations de train
const trainstationRoutes = require("./routes/trainstations.routes");
app.use("/trainstations", trainstationRoutes);  // Correction de la syntaxe du chemin et du middleware


// Configuration du serveur
const PORT = process.env.PORT || 3000;  // Utiliser le PORT de l'environnement ou par défaut à 3000
app.listen(PORT, () => {
    console.log(`Server up and running on  http://localhost:${PORT}`);
});
