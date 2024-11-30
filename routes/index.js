const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Maquette = require('../models/Maquette');
const UE = require('../models/UE');
const Module = require('../models/Module');
const User = require('../models/User');
const Parcours = require('../models/Parcours');

router.get('/',authController.isAuthenticated,  async (req, res) => {
    const maquettes = await Maquette.getMaquettes();
    const users = await User.getUsers();
    const modules =  await Module.getModules();
    const ues =   await UE.getUE();
    const parcoursList = await Parcours.getParcours();
    res.render('../views/index.ejs', {maquettes, users, modules, ues, parcoursList});
});
module.exports = router;
