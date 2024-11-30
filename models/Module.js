const mongoose = require('mongoose');
  
const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  intervenants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  tdHours: {
    type: Number, 
    default: 0
  },
  tpHours: {
    type: Number, 
    default: 0
  },
  cmHours: {
    type: Number, 
    default: 0
  },
  projectHours: {
    type: Number, 
    default: 0
  },
  personalWorkHours: {
    type: Number, 
    default: 0
  },
  ollHours: {
    type: Number, 
    default: 0
  },
  totalHours: {
    type: Number, 
    default: 0
  },
  comments: {
    type: String,
    default: "",
  }
  
});

//const Dictionnaire = mongoose.model('HourTable', hourSchema);



// Create a static method to get all modules
moduleSchema.statics.getModules = async function () {
  try {
    const modules = await this.find({}).exec();
    return modules;
  } catch (error) {
    throw error;
  }
};
const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
