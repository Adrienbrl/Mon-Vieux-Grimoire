const express = require ("express");
const mongoose = require ("mongoose");
const app = express ();
const bookRoutes = require ("./routes/book");
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log({ message: error }));
  // Route qui gère les requêtes liés aux livre de l'API
  app.use("/api/books", bookRoutes);
module.exports = app;