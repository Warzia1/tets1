const UE = require('../models/UE');
const Module = require('../models/Module');
const User = require('../models/User');
const hoursUtils = require('../utils/hoursUtils');

async function getInfo(req) {
  return {
    allModules: await Module.getModules(),
    ue: req.ue || getDefaultUE(),
    ues: await UE.getUE(),
    users: await User.getUsers(),
  };
}

exports.showIndex = async (req, res) => {
  try {
    const allModules = await Module.getModules();
    const ue = req.ue || getDefaultUE();
    const ues = await UE.getUE();
    const users = await User.getUsers();

    res.render('../views/ue/index.ejs', { modules: allModules, ue, ues, users, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des UEs :', error);
    res.status(500).send("Erreur serveur lors de la récupération des UEs.");
  }
};


exports.showCreate = async (req, res) => {
  try {
    const { allModules, ue, ues, users } = await getInfo(req);
    res.render('../views/ue/index.ejs', { ues,users,modules: allModules, ue, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    // Gérer l'erreur ici, par exemple, renvoyer une page d'erreur.
  }
};

function getDefaultUE() {
  return {
    name: '',
    responsible: '',
    modules: [],
    totalHours: 0,
  };
}

exports.create = async (req, res) => {
  const isComingFromModify = req.body.isComingFromModify || false;
  if (isComingFromModify) {
    const ueId = req.body.ue;
    const existingUE = await UE.findOne({ _id: ueId });
    const { allModules, ue, ues, users } = await getInfo(req);
    if (existingUE) {
      return res.render('../views/ue/index.ejs', { ues, users, ue: existingUE, modules: allModules, error: '' });
    }
    return res.render('../views/ue/index.ejs', { ues, users, modules: allModules, ue: getDefaultUE(), error: 'UE not found' });
  } 
  else {
    const { name, responsible, modules } = req.body;
    
    const existingUE = await UE.findOne({ name: name });
    if (existingUE) {
      const { allModules, ue, ues, users } = await getInfo(req);
      return res.render('../views/ue/index.ejs', { ues, users, modules: allModules, ue: getDefaultUE(), error: 'Erreur : Nom du ue déjà utilisé' });
    }
    let totalHours =  await hoursUtils.calculateTotalHoursOfModules(modules);
    const newUE = new UE({
      name: name,
      responsible,
      modules,
      totalHours : totalHours, 
    });
    try {
      await newUE.save();
      const successMessage = "UE : " + name + " enregistré";
      console.log("UE : " + name + " registered");
      const { allModules, ue, ues, users } = await getInfo(req);
      res.render('../views/ue/index.ejs', { ues, users, modules: allModules, ue: getDefaultUE(), error : successMessage });
    } catch (error) {
      const { allModules, ue, ues, users } = await getInfo(req);
      return res.render('../views/ue/index.ejs', { ues, users, modules: allModules, ue: getDefaultUE(), error: 'erreur : ' + error });
    }
  }
};

exports.showModify = async (req, res) => {
  try {
    const { allModules, ue, ues, users } = await getInfo(req);
    res.render('../views/ue/index.ejs', { ues, users, modules: allModules, ue, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des ues :', error);
  }
};

exports.modify = async (req, res) => {
  try {
    const {
      _id,
      name,
      responsible,
      modules,
    } = req.body;
    const ueToUpdate = await UE.findOne({ name: name });
    console.log(req.body);
    if (ueToUpdate) {
      ueToUpdate.name = name;
      ueToUpdate.responsible = responsible;
      ueToUpdate.modules = modules;
      ueToUpdate.totalHours = await hoursUtils.calculateTotalHoursOfModules(modules);
      await ueToUpdate.save(); 
      console.log(`UE ${ueToUpdate.name} mis à jour.`);
    } else {
      console.error('Le ue à mettre à jour n\'existe pas.');
    }
    const { allModules, ue, ues, users } = await getInfo(req);
    const successMessage = "UE : " + name + " modifié";
    res.render('../views/ue/index.ejs', { ues, modules: allModules, ue, users, error : successMessage });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ue :', error);
  }
};

exports.delete = async (req, res) => {
  try {
    const ueName = req.body.name;
    const existingUE = await UE.findOne({ name: ueName });
    if (existingUE) {
      await UE.findOneAndRemove({ name: ueName });
      console.log(`UE ${existingUE.name} supprimé.`);
      const successMessage = `UE ${existingUE.name} supprimé`;
      const { allModules, ue, ues, users } = await getInfo(req);
      res.render('../views/ue/index.ejs', { modules: allModules, ue, ues, users, error : successMessage });
    } else {
      console.error('Le ue à supprimer n\'existe pas.');
      const errorMessage = 'UE non trouvé';
      const { allModules, ues, ue, users } = await getInfo(req);
      res.render('../views/ue/index.ejs', { modules: allModules, ue, ues, users, error : errorMessage });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du ue :', error);
    const { allModules, ue, ues, users } = await getInfo(req);
    const errorMessage = 'Erreur lors de la suppression du ue';
    res.render('../views/ue/index.ejs', { modules: allModules, ue, ues, users,error :  errorMessage });
  }
};
