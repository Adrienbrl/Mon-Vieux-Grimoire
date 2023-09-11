const express = require ("express");
const mongoose = require ("mongoose");
const app = express ();
const bookRoutes = require ("./routes/book");
const userRoutes = require("./routes/user");
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log({ message: error }));

  // Route qui gère les requêtes liées aux livre de l'API
  app.use("/api/books", bookRoutes);

  //Route qui gère les requêtes d'authentification de l'API
  app.use("/api/auth", userRoutes);
  
module.exports = app;