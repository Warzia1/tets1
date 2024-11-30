const mongoose = require('mongoose');

// Définition du schéma pour les rôles
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// Méthode statique pour récupérer tous les rôles
roleSchema.statics.getRoles = async function () {
  try {
    const roles = await this.find({}).exec();
    return roles;
  } catch (error) {
    throw error;
  }
};

// Définir le modèle Role
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
