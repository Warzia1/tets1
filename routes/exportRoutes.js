const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// Définir les routes GET pour les exports 
router.get('/intervenants/:moduleId/csv', exportController.exportIntervenants);
router.get('/heures/module/:moduleId/csv', exportController.exportHeuresModule);
router.get('/heures/parcours/:parcoursId/csv', exportController.exportHeuresParcours);
router.get('/heures/ue/:ueId/csv', exportController.exportHeuresUE);
router.get('/responsables/:ueId/csv', exportController.exportResponsablesUE);


module.exports = router;
