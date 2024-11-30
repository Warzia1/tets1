const User = require('../models/User');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { authenticateUser } = require('../config/rugm'); 

// Connexion automatique sans formulaire
exports.autoLogin = async (req, res, next) => {
  try {
      console.log("Tentative de connexion automatique à RUGM...");
      const { csrfCookie, accessToken, refreshToken } = await authenticateUser('GdMaq', 'uhbefAOZUFEHBAZE514');

      if (accessToken && csrfCookie) {
          req.session.isAuthenticated = true;
          req.session.accessToken = accessToken;
          req.session.refreshToken = refreshToken;
          req.session.csrfCookie = csrfCookie;

          //console.log("Connexion automatique réussie, jetons stockés dans la session :", req.session);
          next(); // Passe à la page suivante (maquettes) après la connexion automatique
      } else {
          console.error("Erreur : Aucun token reçu de RUGM.");
          res.status(500).send("Erreur de connexion automatique : Aucun token reçu.");
      }
  } catch (error) {
      console.error("Erreur lors de la connexion automatique à RUGM :", error);
      res.status(500).send("Erreur lors de la connexion automatique.");
  }
};


// Fonction utilitaire pour nettoyer une chaîne de caractères
// function clearString(string) {
//   return string.trim().replace(/\s/g, '').toLowerCase();
// }

// Middleware pour vérifier si l'utilisateur est authentifié
exports.isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

exports.showLoginPage = (req, res) => {
  res.render('../views/auth/login.ejs', { error: '' });
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error("Erreur lors de la destruction de la session :", err);
          return res.status(500).send("Erreur serveur lors de la déconnexion");
      }
      res.redirect('/auth/login');
  });
};
