// Assuming your UE and Module models are properly imported
const UE = require('../models/UE');
const Module = require('../models/Module');
const Maquette = require('../models/Maquette');
const Semestre = require('../models/Semestre');

async function calculateTotalHoursOfUE(ueId) {
  const ue = await UE.findById(ueId);
  return calculateTotalHoursOfModules(ue.modules);
}
async function calculateTotalHoursOfModules(modules) {
  try {
    const moduleList = Array.isArray(modules) ? modules : [modules];


    var hours = 0;
    for (const moduleId of moduleList) {
      // Ensure you await the result of Module.findOne() to get the module details
      const foundModule = await Module.findOne({ _id: moduleId });

      if (foundModule && foundModule.totalHours) {
        // Ensure foundModule.totalHours is a number before adding it to hours
        const totalHours = parseFloat(foundModule.totalHours); // Parse totalHours as a number
        if (!isNaN(totalHours)) {
          hours += totalHours;
        }
      }
    }
    return hours;
  } catch (error) {
    throw error;
  }
}
async function calculateTotalHoursOfSemester(semesterId){
  let totalHours = 0;
  const semester = await Semestre.findById(semesterId);
  for (const ueId of semester.ues){
    const ue = await UE.findById(ueId);
    totalHours += ue.totalHours;
  }
  console.log(totalHours);
  return totalHours;
}
async function calculateTotalHoursOfMaquette(maquetteId) {
  let totalHours = 0;
  const maquette = await Maquette.findById(maquetteId);
  for (const semestreId of maquette.semestres){
    const semestre = await Semestre.findById(semestreId); 
    totalHours += semestre.totalHours;
  }
  console.log(totalHours);
  return totalHours ;
} 

exports.calculateTotalHoursOfMaquette = calculateTotalHoursOfMaquette;
exports.calculateTotalHoursOfSemester = calculateTotalHoursOfSemester;
exports.calculateTotalHoursOfModules = calculateTotalHoursOfModules;
exports.calculateTotalHoursOfUE = calculateTotalHoursOfUE ;

exports.calculateTotalHoursOfModule = async (module) => { 
  const {
    tdHours,
    tpHours,
    cmHours,
    projectHours,
    personalWorkHours,
    ollHours,
  } = module;

  // Calcul du nombre total d'heures
  const totalHours = tdHours + tpHours + cmHours+ projectHours + personalWorkHours + ollHours;

  return totalHours;
};
  