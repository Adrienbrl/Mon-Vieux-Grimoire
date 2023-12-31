const express = require ("express");
const mongoose = require ("mongoose");
const path = require("path");
const app = express ();
const cors = require("cors");

require("dotenv").config();
const URI = process.env.URI;

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log({ message: error }));

// Configurer les options CORS pour autoriser toutes les origines
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

// Activer CORS pour toutes les routes
app.use(cors(corsOptions));

// Ajoute un middleware pour analyser ces données et les rendre disponibles dans req.body
app.use(express.urlencoded({ extended: true }));

// Ajoute un middleware pour traiter les requêtes entrantes au format JSON
app.use(express.json());

// Route qui gère les requêtes liées aux livre de l'API
  app.use("/api/books", bookRoutes);

// Route qui gère les requêtes d'authentification de l'API
  app.use("/api/auth", userRoutes);

// Définit un middleware pour servir les fichiers statiques du répertoire "images" à partir de l'URL "/images"
  app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;