const mongoose = require('mongoose');

const semestreSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
  },
  ues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UE',
  }],
  parcours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcours',
  }],
  totalHours: {
    type: Number,
    default: 0,
  }
});

const Semestre = mongoose.model('Semestre', semestreSchema);

module.exports = Semestre;
