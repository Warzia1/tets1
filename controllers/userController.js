const User = require('../models/User');
const bcrypt = require('bcrypt');
const userController = {};
const Role = require('../models/Role');

// Page de gestion des utilisateurs
userController.showUserManagementPage = async (req, res) => {
  const users = await User.getUsers();
  const roles = await Role.getRoles(); // Récupère les rôles
  res.render('user/index', { title: 'Gestion des utilisateurs', users, roles });
};

// Création d'un nouvel utilisateur
userController.createUser = async (req, res) => {
  const { username, password, email, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, email, role });
  await newUser.save();
  res.redirect('/user');
};

// Page de modification du mot de passe pour un utilisateur spécifique
userController.editPasswordPage = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  res.render('user/modifyPassword', { title: 'Modifier le mot de passe', user });
};

// Mise à jour du mot de passe
userController.updatePassword = async (req, res) => {
  const userId = req.params.userId;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.redirect(`/user/editPassword/${userId}?error=password_mismatch`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
  
  res.redirect('/user?success=password_updated');
};

// Page de modification du nom d'utilisateur pour un utilisateur spécifique
userController.editUsernamePage = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  res.render('user/changeUsername', { title: 'Modifier le nom d\'utilisateur', user });
};

// Mise à jour du nom d'utilisateur
userController.updateUsername = async (req, res) => {
  const userId = req.params.userId;
  const newUsername = req.body.newUsername;
  
  await User.findByIdAndUpdate(userId, { username: newUsername });
  res.redirect('/user?success=username_updated');
};

// Suppression de l'utilisateur
userController.deleteUser = async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndRemove(userId);
    res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression de l'utilisateur");
  }
};

module.exports = userController;
