const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const multer = require("../middleware/multer-config");

// Les différentes routes

// Créer un nouveau livre
router.post("/", auth, multer, bookCtrl.postOneBook);

// Ajouter une note à un livre
router.post("/:id/rating", auth, bookCtrl.postRating);

// Supprimer un livre 
router.delete("/:id", auth, bookCtrl.deleteOneBook);

// Mettre à jour les infos d'un livre
router.put("/:id", auth, multer, bookCtrl.putOneBook);

// Obtenir les livres avec les meilleures notes
router.get("/bestrating", bookCtrl.getBestRating);

// Obtenir les infos d'un livre en particulier
router.get("/:id", bookCtrl.getOneBook);

// Obtenir tous les livres 
router.get("/", bookCtrl.getAllBooks);

module.exports = router;