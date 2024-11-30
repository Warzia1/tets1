const UE = require('../models/UE');
const Parcours = require('../models/Parcours');
const Maquette = require('../models/Maquette');
const Semestre = require('../models/Semestre');
const Module = require('../models/Module');
const hourUtils = require('../utils/hoursUtils');

async function getInfo(req,error) {
    const maquette = req.maquette || getDefaultMaquette();

  return {
    allUES: await UE.getUE(),
    allParcours: await Parcours.getParcours(),
    maquettes: await Maquette.getMaquettes(),
    maquette,
    numberOfSemesters : await Maquette.getNumberOfSemesters(maquette._id,6),
    startingSemesterNumber : await Maquette.getStartingSemesterNumber(maquette._id,5),
    error,
  }
  
}

async function renderIndex(req,res,error,maquette) {
  const { allUES, allParcours, maquettes, startingSemesterNumber, numberOfSemesters } = await getInfo(req);
  res.render('../views/maquette/index.ejs', { allUES, allParcours, maquettes, maquette, startingSemesterNumber, numberOfSemesters, error });
}

// maquetteController.js
exports.showIndex = async (req, res) => {
  try {
      // Récupérez les maquettes, UEs et parcours
      const maquettes = await Maquette.find();
      const ues = await UE.getUE();
      const parcoursList = await Parcours.getParcours(); 
      const modules = await Module.find();

      // Vérifiez que les données sont bien récupérées
      console.log("Maquettes récupérées :", maquettes);
      console.log("UEs récupérées :", ues);
      console.log("Parcours récupérés :", parcoursList);
      console.log("modules récupérés :", modules);

      // Passez `parcoursList` à la vue
      res.render('index', { maquettes, ues, parcoursList, modules });
  } catch (error) {
      console.error("Erreur dans showIndex :", error);
      res.status(500).send("Erreur lors de l'affichage des maquettes");
  }
};




exports.showCreate = async (req, res) => {
  try {
    const { allUES, parcours, maquettes, maquette } = await getInfo(req);
    res.render('../views/maquette/create.ejs', { ues: allUES, parcours, maquettes, maquette, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour la création :', error);
  }
};

function getDefaultMaquette() {
  return {
    name: '',
    totalHours: 0,
  };
}

exports.create = async (req, res) => {
  try {
    const isComingFromModify = req.body.isComingFromModify || false;
    if (isComingFromModify) {
      const maquetteId = req.body.maquette;
      const existingMaquette = await Maquette.findById(maquetteId);
      if (existingMaquette){
        return renderIndex(req, res,'',existingMaquette);
      }
      else {
        return renderIndex(req,res,'Maquette not found',getDefaultMaquette());
      }
    } else {
      let { name, semestersData} = req.body;
      const existingMaquette = await Maquette.findOne({ name : name});
      if (existingMaquette) {
        return renderIndex(req,res,'Erreur : nom de maquette déjà utilisé',getDefaultMaquette());
      }
      const semestres= []; // Stockage des objets semestres à créer
      semestersData = JSON.parse(semestersData);
      console.log(semestersData); 

      // sauvegarder les semestres
      for (const semestreData of semestersData) {
        const ueList = [];
        const parcoursList = [];
  
        for (const item of semestreData.items) {
          let existingUE = await UE.findById(item);
          if (existingUE) {
            ueList.push(existingUE._id);
          } else {
            let existingParcours = await Parcours.findById(item);
            if (existingParcours) {
              parcoursList.push(existingParcours._id);
            } else {
              console.error(`Aucune UE ni Parcours trouvé avec l'ID ${item}`);
            }
          }
        }
        const semestre = new Semestre({
          numero: semestreData.numero,
          ues: ueList,
          parcours: parcoursList,
        });
        try {
          const newSemestre = await semestre.save();
          let totalHours = await hourUtils.calculateTotalHoursOfSemester(newSemestre._id);
          newSemestre.totalHours = totalHours;
          await newSemestre.save();
          console.log(`Semestre créé : ${newSemestre}`);
          semestres.push(newSemestre._id);
        } catch (error) {
          console.error(`Erreur lors de la création du semestre : ${error}`);
        }
      }
  
      // Création de la maquette avec les références des semestres
      const newMaquette = new Maquette({ name, semestres });
      await newMaquette.save();
      let totalHours = await hourUtils.calculateTotalHoursOfMaquette(newMaquette._id);
      newMaquette.totalHours = totalHours;
      await newMaquette.save();
      console.log(`Semestre créé : ${newMaquette}`);
      let message = 'Maquette ' + newMaquette.name + ' sauvegardée';
      return renderIndex(req, res, message,getDefaultMaquette());
    }
      
  } catch (error) {
    console.error('Erreur lors de la création de la maquette :', error);
    return renderIndex(req, res,error,getDefaultMaquette());
  }
};

exports.modify = async (req, res) => {
  try {
   const {
    _id,
    name,
    semestres,
   } = req.body;
   return renderIndex(req,res,'',getDefaultMaquette());
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour l\'index :', error);
    // Gérer l'erreur ici, par exemple, renvoyer une page d'erreur.
  }
};

exports.delete = async (req, res) => {
  try {
    const { allUES, allParcours, maquettes, maquette, startingSemesterNumber, numberOfSemesters } = await getInfo(req);

    res.render('../views/maquette/index.ejs', { allUES, allParcours, maquettes, maquette, startingSemesterNumber, numberOfSemesters, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour l\'index :', error);
    // Gérer l'erreur ici, par exemple, renvoyer une page d'erreur.
  }
};
