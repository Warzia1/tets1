
const Module = require('../models/Module'); // Import the Module model
const User = require('../models/User');
const Responsible = require('../models/Responsible');

async function getInfo(req) {
  return {
    users: await User.getUsers(),
    module: req.module || getDefaultModule(),
    modules: await Module.find({}),
  };
}

exports.showIndex = async (req, res) => { 
  try {
    const users = await User.getUsers();
    const module = req.module || getDefaultModule();
    const modules = await Module.find({});
    
    res.render('../views/module/index.ejs', { users, module, modules, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des modules :', error);
    res.status(500).send("Erreur serveur lors de la récupération des modules.");
  }
};


exports.showCreate = async (req, res) => {
  try {
    const users = await User.getUsers();
    const module = req.module || getDefaultModule(); // Utilisez la valeur du module fournie ou un module par défaut
    res.render('../views/module/create.ejs', { users, module, error: '' });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    // Gérer l'erreur ici, par exemple, renvoyer une page d'erreur.
  }
};

function getDefaultModule() {
  // Créez un objet module par défaut avec toutes les valeurs à zéro
  return {
    name: '',
    responsible: '',
    intervenants: [],
    tdHour: 0,
    tpHour: 0,
    cmHour: 0,
    projectHour: 0,
    personalWorkHours: 0,
  };
}

// Cette route gère la réception du formulaire
exports.create = async (req, res) => {
  // Récupérez les données du formulaire depuis req.body
  const isComingFromModify = req.body.isComingFromModify || false;
  // test if it's coming from modify
  if (isComingFromModify) {
    const moduleId = req.body.module; // Get the id from the request body
    // Find the module based on the modulesId
    const existingModule = await Module.findOne({ _id: moduleId });
    const users = await User.getUsers();
    const modules = await Module.getModules();
    if (existingModule) {
      return res.render('../views/module/index.ejs', { modules, module: existingModule, users, error: '' });
    }

    // Handle the case where the module does not exist
    return res.render('../views/module/index.ejs', { modules, users,module: getDefaultModule(), error: 'Module not found' });
  } else {
    // Rest of your existing code for creating a module
    const {
      name,
      responsible,
      intervenants,
      tdHour,
      tpHour,
      cmHour,
      ollHours,
      projectHour,
      personalWorkHours,
      comments,
    } = req.body;

    // Calculez totalHours en ajoutant toutes les heures du formulaire
    const totalHours = parseInt(tdHour) + parseInt(tpHour) + parseInt(cmHour) + parseInt(projectHour) + parseInt(personalWorkHours);

    // test if the name exists
    const existingModule = await Module.findOne({ name: name });
    const users = await User.getUsers();
    const modules= await Module.find({});
    if (existingModule) {
      return res.render('../views/module/index.ejs', { modules,users,module: getDefaultModule(), error: 'Erreur : Nom du module déjà utilisé' });
    }

    // Créez un nouveau module avec les données du formulaire
    const newModule = new Module({
      name: name,
      responsible,
      intervenants,
      tdHours: parseInt(tdHour, 10),
      tpHours: parseInt(tpHour, 10),
      cmHours: parseInt(cmHour, 10),
      projectHours: parseInt(projectHour, 10),
      ollHours: parseInt(ollHours, 10),
      personalWorkHours: parseInt(personalWorkHours, 10),
      totalHours,
      comments,
    });

    try {
      // Enregistrez le module dans la base de données
      await newModule.save();
      const error = "Module : " + name + " enregistré";
      console.log("Module : " + name + " registered");
      const modules= await Module.find({});
      res.render('../views/module/index.ejs', { modules,users,module: getDefaultModule(), error  }); // Redirigez vers une page appropriée (par exemple, la liste des modules)
    } catch (error) {
      return res.render('../views/module/index.ejs', { modules,users,module: getDefaultModule(), error: 'erreur : ' + error });
      // Gérez l'erreur ici, par exemple, renvoyez une page d'erreur
    }
  }
};
exports.showModify = async (req, res) => {
  try {
    const modules = await Module.find({}); // Récupérez tous les modules
    const users = await User.find({}); // Récupérez tous les utilisateurs

    res.render('../views/module/modify.ejs', { modules, users });
  } catch (error) {
    console.error('Erreur lors de la récupération des modules :', error);
    // Gérer l'erreur ici, par exemple, renvoyer une page d'erreur.
  }
};

exports.modify = async (req, res) => {
  try {
    const {
      _id,
      name,
      responsible,
      intervenants,
      tdHour,
      tpHour,
      cmHour,
      ollHours,
      projectHour,
      personalWorkHours,
      comments,
    } = req.body;
    console.log(_id, name)
    // Trouvez le module existant par son ID
    const moduleToUpdate = await Module.findOne({name: name});

    // Si le module existe
    if (moduleToUpdate) {
      moduleToUpdate.name = name;
      moduleToUpdate.responsible = responsible;
      moduleToUpdate.intervenants = intervenants;
      moduleToUpdate.tdHours = parseInt(tdHour, 10);
      moduleToUpdate.tpHours = parseInt(tpHour, 10);
      moduleToUpdate.cmHours = parseInt(cmHour, 10);
      moduleToUpdate.projectHours = parseInt(projectHour, 10);
      moduleToUpdate.personalWorkHours = parseInt(personalWorkHours, 10);
      moduleToUpdate.ollHours = parseInt(ollHours, 10);
      moduleToUpdate.totalHours = parseInt(ollHours) + parseInt(tdHour) + parseInt(tpHour) + parseInt(cmHour) + parseInt(projectHour) + parseInt(personalWorkHours);
      moduleToUpdate.comments = comments;
      // Mettez à jour le module dans la base de données
      await moduleToUpdate.save();

      console.log(`Module ${moduleToUpdate.name} mis à jour.`);
    } else {
      console.error('Le module à mettre à jour n\'existe pas.');
    }
    const { users, module, modules } = await getInfo(req);
    const error = "Module : " + moduleToUpdate.name + " modifié";
    res.render('../views/module/index.ejs', { modules,users,module, error }); // Redirigez vers une page appropriée (par exemple, la liste des modules)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du module :', error);
    // Gérez l'erreur ici, par exemple, renvoyez une page d'erreur
  }
};


exports.delete = async (req, res) => {
  try {
    const moduleName = req.body.name; // Supposons que le nom soit inclus dans le formulaire

    // Vérifiez si le module existe
    const existingModule = await Module.findOne({ name: moduleName });
    
    if (existingModule) {
      // Supprimez le module de la base de données
      await Module.findOneAndRemove({ name: moduleName });

      console.log(`Module ${existingModule.name} supprimé.`);
      
      const error = `Module ${existingModule.name} supprimé`;
      const { users, modules , module} = await getInfo(req);
      res.render('../views/module/index.ejs', { users, module, modules, error });
    } else {
      console.error('Le module à supprimer n\'existe pas.');
      const error = 'Module non trouvé';
      const { users, modules , module} = await getInfo(req);
      res.render('../views/module/index.ejs', { users, module, modules, error });
    }
  } catch (errore) {
    console.error('Erreur lors de la suppression du module :', error);
    const { users, module, modules } = await getInfo(req);
    const error = 'Erreur lors de la suppression du module';
    res.render('../views/module/index.ejs', { users, module, modules, error });
  }
};

