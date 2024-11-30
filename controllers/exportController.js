// controllers/exportController.js
const { parse } = require('json2csv');
const Module = require('../models/Module');
const Responsible = require('../models/Responsible');
const UE = require('../models/UE');
const Parcours = require('../models/Parcours');


exports.exportIntervenants = async (req, res) => {
    try {
        // Trouver le module par son ID
        const module = await Module.findById(req.params.moduleId).populate('intervenants', 'username email').exec();

        if (!module) {
            return res.status(404).json({ message: 'Module non trouvé' });
        }

        // Extraire les intervenants du module
        const intervenants = module.intervenants.map(intervenant => ({
            username: intervenant.username,
            email: intervenant.email
        }));

        // Convertir les données en CSV
        const csv = parse(intervenants);

        // Répondre avec le fichier CSV
        res.header('Content-Type', 'text/csv');
        res.attachment('intervenants.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’export des intervenants' });
    }
};


exports.exportResponsablesUE = async (req, res) => {
    try {
        // Récupérer toutes les UE avec leurs responsables
        const ues = await UE.find({})
            .populate('responsible', 'username email') 
            .exec();

        // Filtrer et formater les données pour obtenir seulement les responsables avec leur email
        const responsables = ues
            .filter(ue => ue.responsible) 
            .map(ue => ({
                ueName: ue.name,
                responsibleUsername: ue.responsible.username,
                responsibleEmail: ue.responsible.email
            }));

        // Convertir les données en CSV
        const csv = parse(responsables);

        // Répondre avec le fichier CSV
        res.header('Content-Type', 'text/csv');
        res.attachment('responsables_ue.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’export des responsables d\'UE' });
    }
};



exports.exportHeuresModule = async (req, res) => {
    try {
        // Récupérer le module par son ID et sélectionner uniquement le champ `totalHours`
        const module = await Module.findById(req.params.moduleId).select('totalHours');

        if (!module) {
            return res.status(404).json({ message: 'Module non trouvé' });
        }

        // Convertir les données en CSV
        const csvData = [{
            moduleId: moduleId,
            totalHours: module.totalHours
        }];

        const csv = parse(csvData);

        // Répondre avec le fichier CSV
        res.header('Content-Type', 'text/csv');
        res.attachment('heures_module.csv');
        res.send(csv);
    } catch (err) {
        console.error('Erreur lors de l’export des heures:', err);
        res.status(500).json({ message: 'Erreur lors de l’export des heures' });
    }
};


exports.exportHeuresParcours = async (req, res) => {
    try {
        const { parcoursId } = req.params;

        // Récupérer le parcours par son ID et sélectionner les champs `totalHoursP1` et `totalHoursP2`
        const parcours = await Parcours.findById(parcoursId).select('totalHoursP1 totalHoursP2');

        if (!parcours) {
            return res.status(404).json({ message: 'Parcours non trouvé' });
        }

        // Convertir les données en CSV
        const csvData = [{
            parcoursId: parcoursId,
            totalHoursP1: parcours.totalHoursP1,
            totalHoursP2: parcours.totalHoursP2
        }];

        const csv = parse(csvData);

        // Répondre avec le fichier CSV
        res.header('Content-Type', 'text/csv');
        res.attachment('heures_parcours.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’export des heures du parcours' });
    }
};




exports.exportHeuresUE = async (req, res) => {
    try {
        const { ueId } = req.params;

        // Récupérer l'UE par son ID et sélectionner uniquement le champ `totalHours`
        const ue = await UE.findById(ueId).select('totalHours');

        if (!ue) {
            return res.status(404).json({ message: 'UE non trouvée' });
        }

        // Convertir les données en CSV
        const csvData = [{
            ueId: ueId,
            totalHours: ue.totalHours
        }];

        const csv = parse(csvData);

        // Répondre avec le fichier CSV
        res.header('Content-Type', 'text/csv');
        res.attachment('heures_ue.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’export des heures de l’UE' });
    }
};



