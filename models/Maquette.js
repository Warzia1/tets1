const mongoose = require('mongoose');

const maquetteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    semestres : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semestre',
    }],
    totalHours: {
        type: Number,
        default: 0,
    }
});

// Fonction statique pour récupérer le nombre de semestres dans une maquette
maquetteSchema.statics.getNumberOfSemesters = async function (maquetteId,defaultNumber) {
    try {
        const maquette = maquetteId ? await this.findById(maquetteId).populate('semestres') : null;
        return maquette ? maquette.semestres.length : defaultNumber; // Retourne 6 si l'ID n'est pas disponible
    } catch (error) {
        throw error;
    }
};

// Fonction statique pour récupérer le numéro de semestre le plus faible dans une maquette
maquetteSchema.statics.getStartingSemesterNumber = async function (maquetteId,defaultNumber) {
    try {
        const maquette = maquetteId ? await this.findById(maquetteId).populate('semestres') : null;
        if (!maquette || !maquette.semestres.length) {
            return defaultNumber; // Retourne defaultNumber si l'ID n'est pas disponible ou s'il n'y a pas de semestres
        }
        const semesterNumbers = maquette.semestres.map(semester => semester.numero);
        return Math.min(...semesterNumbers);
    } catch (error) {
        throw error;
    }
};


// Create a static method to get all Maquette
maquetteSchema.statics.getMaquettes = async function () {
    try {
      const maquettes = await this.find({}).exec();
      return maquettes;
    } catch (error) {
      throw error;
    }
  };
const Maquette = mongoose.model('Maquette', maquetteSchema);

module.exports = Maquette;
