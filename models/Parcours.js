const mongoose = require('mongoose');

const parcoursSchema = new mongoose.Schema({
  nameP1: {
    type: String,
    required: true
  },
  nameP2: {
    type: String,
    required: true
  },
  ueP1: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UE'
  }],
  ueP2: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UE'
  }],
  totalHoursP1: {
    type: Number,
    required: true
  },
  totalHoursP2: {
    type: Number,
    required: true
  },
});

// Create a static method to get all Parcours
parcoursSchema.statics.getParcours = async function () {
  try {
    const parcours = await this.find({}).exec();
    return parcours;
  } catch (error) {
    throw error;
  }
};

const Parcours = mongoose.model('Parcours', parcoursSchema);

module.exports = Parcours;
