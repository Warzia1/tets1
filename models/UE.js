const mongoose = require('mongoose');

const ueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  totalHours: {
    type: Number,
    default : 0,
  } 
});

// Create a static method to get all UE
ueSchema.statics.getUE = async function () {
  try {
    const ues = await this.find({}).exec();
    return ues;
  } catch (error) {
    throw error;
  }
};

const UE = mongoose.model('UE', ueSchema);

module.exports = UE;
