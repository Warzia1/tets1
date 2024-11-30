const mongoose = require('mongoose');


const responsibleSchema = new mongoose.Schema({
  module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
    },  
  User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
  });


const Responsible = mongoose.model('Responsible', responsibleSchema);


module.exports = Responsible;
