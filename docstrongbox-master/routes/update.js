const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");

const file = require('../model/file');
const verifyAuth = require('../model/verifyAuth');
const checkGroup = require('../model/checkGroup');
const checkRight = require('../model/checkRight');
const extractSubFromJWT = require('../model/jwt');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put("/", upload.single("file"), (req, res) => {
    const fileId = req.body.fileId;
    const AccessToken = req.body.AccessToken;

    // Vérification des entrées requises
    if (!fileId) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing fileId`);
        return res.status(400).json({ message: 'Missing fileId' });
    }
    if (!AccessToken) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing AccessToken`);
        return res.status(400).json({ message: 'Missing AccessToken' });
    }
    if (!req.file) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing file in request`);
        return res.status(400).json({ message: 'Missing file' });
    }

    verifyAuth(AccessToken).then(result => {
        const userId = extractSubFromJWT(AccessToken);
        // Vérification des droits d'accès
        checkRight(userId, fileId).then(resolve => {
            const fileData = {
                originalName: req.file.originalname,
                sensitivity: req.body.sensitivity
            };

            var iv = null;
            var cipher = null;
            var key = null;

            // Définition des paramètres de chiffrement selon la sensibilité
            switch (req.body.sensitivity) {
                case "high":
                    iv = crypto.randomBytes(16);
                    key = crypto.randomBytes(32);
                    cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
                    break;
                case "low":
                    iv = crypto.randomBytes(16);
                    key = crypto.randomBytes(16);
                    cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
                    break;
                default:
                    fileData.sensitivity = "medium";
                    iv = crypto.randomBytes(8);
                    key = crypto.randomBytes(24);
                    cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
                    break;
            }

            fileData["key"] = key.toString('hex');
            const encrypted = Buffer.concat([cipher.update(req.file.buffer), cipher.final()]);
            const encryptedBuffer = Buffer.concat([iv, encrypted]);
            const outputFilePath = path.join(__dirname, '../uploads', fileId);

            // Écriture du fichier chiffré sur le disque
            fs.writeFile(outputFilePath, encryptedBuffer, (error) => {
                if (error) {
                    console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while writing the file: ${error}`);
                    return res.status(501).json({ message: 'Internal Error during the upload' });
                }

                // Mise à jour des informations du fichier dans la base de données
                file.updateOne({ _id: fileId }, { $set: { "originalName": req.file.originalname, "key": fileData["key"], "sensitivity": fileData.sensitivity } })
                    .then(() => {
                        console.log(`[${new Date().toISOString()}] [INFO] - File updated successfully: ${fileId} by user : ${userId}`);
                        return res.status(201).json({ message: "File correctly Updated" });
                    }).catch(error => {
                        console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while updating file data for user : ${userId}: ${error}`);
                        return res.status(501).json({ message: 'Internal Error during the update' });
                    });
            });
        }).catch(error => {
            console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while checking rights for user : ${userId}: ${error}`);
            return res.status(401).json({ message: error });
        });
    }).catch(error => {
        console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred during authentication : ${error}`);
        return res.status(401).json({ message: error });
    });
});

module.exports = router;