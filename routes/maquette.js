const express = require('express');
const router = express.Router();
const maquetteController = require('../controllers/maquetteController');
const checkPermission = require('../middlewares/authorization');

router.get('/', checkPermission("b85067e2-949f-4a7a-8d99-2bcc5e0ff4b5"), (req, res) => {
  maquetteController.showIndex(req, res).catch(error => {
      console.error("Erreur lors de l'affichage des maquettes :", error);
      res.status(500).send("Erreur serveur");
  });
});

router.post('/create', checkPermission("droit_create_id"), (req, res) => {
  maquetteController.create(req, res).catch(error => {
      console.error("Erreur lors de la création de la maquette :", error);
      res.status(500).send("Erreur serveur");
  });
});

router.post('/modify', checkPermission('modify_maquette'), async (req, res, next) => {
  try {
    await maquetteController.modify(req, res);
  } catch (error) {
    console.error("Erreur lors de la modification de la maquette :", error);
    res.status(500).send("Erreur serveur");
  }
});

router.post('/delete', checkPermission('delete_maquette'), async (req, res, next) => {
  try {
    await maquetteController.delete(req, res);
  } catch (error) {
    console.error("Erreur lors de la suppression de la maquette :", error);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
