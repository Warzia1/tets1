// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true,
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    sensitivity: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    key: {
        type : String,
        required : true
    },
    right: {
        type : String,
    }
});

module.exports = mongoose.model('file', FileSchema);
