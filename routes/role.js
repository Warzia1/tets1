//Mit de côté pour le moment



const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authController = require('../controllers/authController');

// Page de gestion des rôles
router.get('/', authController.isAuthenticated, roleController.showRoleManagementPage);

// // Création d'un rôle
// router.post('/create', authController.isAuthenticated, roleController.createRole);

// // Suppression d'un rôle
// router.post('/delete', authController.isAuthenticated, roleController.deleteRole);

module.exports = router;
