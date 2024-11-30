const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.showLoginPage); // Page de connexion
router.post('/login', authController.login); // Traitement de la connexion
router.get('/logout', authController.logout); // Déconnexion 

module.exports = router;
