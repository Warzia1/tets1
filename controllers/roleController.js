const Role = require('../models/Role');

const roleController = {};

// Page de gestion des rôles
roleController.showRoleManagementPage = async (req, res) => {
  const roles = await Role.getRoles();
  res.render('role/index', { title: 'Gestion des rôles', roles });
};

// Création d'un nouveau rôle
roleController.createRole = async (req, res) => {
  const { name, description } = req.body;
  const newRole = new Role({ name, description });
  await newRole.save();
  res.redirect('/role');
};

// Suppression d'un rôle
roleController.deleteRole = async (req, res) => {
  const roleId = req.body.roleId;
  await Role.findByIdAndDelete(roleId);
  res.redirect('/role');
};

module.exports = roleController;
