const UE = require('../models/UE');
const Parcours = require('../models/Parcours');
const hoursUtils = require('../utils/hoursUtils');

async function getInfo(req) {
  return {
    allUES: await UE.getUE(),
    parcours: req.parcours || getDefaultParcours(),
    allParcours: await Parcours.getParcours(),
  };
}

exports.showIndex = async (req, res) => {
  try {
    const allUES = await UE.getUE();
    const parcours = req.parcours || getDefaultParcours();
    const parcoursList = await Parcours.getParcours();

    res.render('../views/parcours/index.ejs', { ues: allUES, parcours, parcoursList, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des parcours :', error);
    res.status(500).send("Erreur serveur lors de la récupération des parcours.");
  }
};


exports.showCreate = async (req, res) => {
  try {
    const { allUES, parcours, allParcours } = await getInfo(req);
    res.render('../views/parcours/create.ejs', { ues: allUES, parcours, parcoursList: allParcours, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des UEs et parcours pour la création :', error);
    // Gérer l'erreur ici, par exemple, renvoyer une page d'erreur.
  }
};

function getDefaultParcours() {
  return {
    nameP1: '',
    nameP2: '',
    ueP1: [],
    ueP2: [],
    totalHoursP1: 0,
    totalHoursP2: 0,
  };
}

  exports.create = async (req, res) => {
    
    const isComingFromModify = req.body.isComingFromModify || false;
    if (isComingFromModify) {
      const parcoursId = req.body.parcours;
      const existingParcours = await Parcours.findOne({ _id: parcoursId });
      const { allUES, parcours, allParcours } = await getInfo(req);
      if (existingParcours) {
        return res.render('../views/parcours/index.ejs', { ues: allUES, parcours : existingParcours, parcoursList: allParcours, error: '' });
      }
      return res.render('../views/parcours/index.ejs', { ues: allUES, parcours : existingParcours, parcoursList: allParcours, error: 'Parcours not found' });
    } else {
      const { nameP1, nameP2, ueP1, ueP2 } = req.body;
      
      const existingParcours = await Parcours.findOne({ nameP1: nameP1, nameP2: nameP2 });
      if (existingParcours) {
        const { allUES, parcours, allParcours } = await getInfo(req);
        return res.render('../views/parcours/index.ejs', { ues: allUES, parcours, parcoursList: allParcours, error: 'Erreur : Nom du parcours déjà utilisé' });
      }
      let totalHoursP1 = await hoursUtils.calculateTotalHoursOfUE(ueP1);
      let totalHoursP2 = await hoursUtils.calculateTotalHoursOfUE(ueP2);
      
      const newParcours = new Parcours({
        nameP1,
        nameP2,
        ueP1,
        ueP2,
        totalHoursP1,
        totalHoursP2,
      });
  
      try {
        await newParcours.save();
        const successMessage = "Parcours : " + nameP1 + " - " + nameP2 + " enregistré";
        const { allUES, parcours, allParcours } = await getInfo(req);
        res.render('../views/parcours/index.ejs', { ues: allUES, parcours, parcoursList: allParcours, error : successMessage });
      } catch (error) {
        const { allUES, parcours, allParcours } = await getInfo(req);
        return res.render('../views/parcours/index.ejs', { ues: allUES, parcours, parcoursList: allParcours, error: 'erreur : ' + error });
      }
    }
  };
  
  exports.modify = async (req, res) => {
    try {
      const {
        _id,
        nameP1,
        nameP2,
        ueP1,
        ueP2,
      } = req.body;
      const parcoursToUpdate = await Parcours.findOne({ nameP1: nameP1, nameP2: nameP2 });
      if (parcoursToUpdate) {
        parcoursToUpdate.nameP1 = nameP1;
        parcoursToUpdate.nameP2 = nameP2;
        parcoursToUpdate.ueP1 = ueP1;
        parcoursToUpdate.ueP2 = ueP2;
        parcoursToUpdate.totalHoursP1 = await hoursUtils.calculateTotalHoursOfUE(ueP1);
        parcoursToUpdate.totalHoursP2 = await hoursUtils.calculateTotalHoursOfUE(ueP2);
        await parcoursToUpdate.save();
        console.log(`Parcours ${parcoursToUpdate.nameP1} - ${parcoursToUpdate.nameP2} mis à jour.`);
      } else {
        console.error('Le parcours à mettre à jour n\'existe pas.');
      }
      const { allUES, parcours, allParcours } = await getInfo(req);
      const successMessage = "Parcours : " + nameP1 + " - " + nameP2 + " modifié";
      res.render('../views/parcours/index.ejs', { ues: allUES, parcours, parcoursList: allParcours, error : successMessage });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du parcours :', error);
    }
  };
  
  exports.delete = async (req, res) => {
    try {
      const parcoursName = req.body.nameP1 + " - " + req.body.nameP2;
      const existingParcours = await Parcours.findOne({ nameP1: req.body.nameP1, nameP2: req.body.nameP2 });
      if (existingParcours) {
        await Parcours.findOneAndRemove({ nameP1: req.body.nameP1, nameP2: req.body.nameP2 });
        console.log(`Parcours ${existingParcours.nameP1} - ${existingParcours.nameP2} supprimé.`);
        const successMessage = `Parcours ${existingParcours.nameP1} - ${existingParcours.nameP2} supprimé`;
        const { allUES, parcours, allParcours } = await getInfo(req);
        res.render('../views/parcours/index.ejs', { ues: allUES, parcours, parcoursList: allParcours, error : successMessage });
      } else {
        console.error('Le parcours à supprimer n\'existe pas.');
        const errorMessage = 'Parcours non trouvé';
        const { allUES, parcours, allParcours } = await getInfo(req);
        res.render('../views/parcours/index.ejs', { ues: allUES, parcours, parcoursList: allParcours, error : errorMessage });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du parcours :', error);
      const { allUES, parcours, allParcours } = await getInfo(req);
      const errorMessage = 'Erreur lors de la suppression du parcours';
      res.render('../views/parcours/index.ejs', { ues: allUES, parcours, parcoursList: allParcours, error : errorMessage });
    }
  };
  