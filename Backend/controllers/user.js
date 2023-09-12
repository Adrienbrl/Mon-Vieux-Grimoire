const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const passwordRegex = /[/!@#$%^&*(),.?":{}|<>]/;

const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

require("dotenv").config();
const cleSecrete = process.env.cleSecrete;

const bcryptRounds = 10;

exports.signup = (req, res, next) => {
    const { password } = req.body;
    const { email } = req.body;
    User.findOne({ email: req.body.email })
      .then((existingUser) => {
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            message:
              "Veuillez saisir une e-mail conforme.",
          });
        }
        if (existingUser) {
          return res
            .status(409)
            .json({ message: "Cette adresse mail est déjà utilisée" });
        }
        bcrypt
          .hash(req.body.password, bcryptRounds) //On hash le password avant de le stocker dans la bdd (10 boucles sont effectuées)
          .then((hash) => {
            const user = new User({
              email: req.body.email,
              password: hash,
            });
            // Vérification du mdp s'il comporte au moins 6 caractères
            if (password.length < 6) {
              return res.status(400).json({
                message: "Le mot de passe doit comporter au moins 6 caractères.",
              });
            }
            if (!passwordRegex.test(password)) {
              return res.status(400).json({
                message:
                  "Veuillez saisir un mot de passe avec des caractères spéciaux.",
              });
            }
            user
              .save()
              .then(() => {
                res.status(201).json({
                  message: "Utilisateur créé",
                });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) 
      .then((user) => {
        if (user === null) {
          res.status(401).json({ message: "Identifiants non valides" });
        } else {
          bcrypt
            .compare(req.body.password, user.password)
            .then((password) => {
              if (!password) {
                res.status(401).json({
                  message: "Identifiants non valides",
                });
              } else {
                res.status(200).json({
                  userId: user._id,
                  token: jwt.sign({ userId: user._id }, cleSecrete, {
                    expiresIn: "4h",
                  }),
                });
              }
            })
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(500).json({ error }));
  };