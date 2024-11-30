const mongoose = require('mongoose');

// Supprimer le modèle si existant
delete mongoose.connection.models['User'];
delete mongoose.connection.models['Maquette'];
delete mongoose.connection.models['Module'];
