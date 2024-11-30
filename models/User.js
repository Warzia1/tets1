const mongoose = require('mongoose');

// Define the enumeration for roles
const roleList = {
  GESTIONNAIRE: 'gestionnaire E-SCOLIS',
  DIRECTEUR: 'Directeur/Directrice des études',
  ASSISTANTE: 'Assistante de direction',
  MEMBRE: 'membre de l\'équipe pédagogique',
  EXTERNE: 'externe',
};

const Role = require('./Role'); 

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', 
    required: true,
  }
});

// Create a static method to get all users
userSchema.statics.getUsers = async function () {
  try {
    const users = await this.find({}).exec(); //
    return users;
  } catch (error) {
    throw error;
  }
};

// Define the User model
const User = mongoose.model('User', userSchema);



module.exports = User;
