const multer = require("multer");
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const express = require("express");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const file = require('../model/file');
const verifyAuth = require('../model/verifyAuth');
const checkGroup = require('../model/checkGroup');
const createRight = require('../model/createRight');
const extractSubFromJWT = require('../model/jwt');

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
    // Vérifications des paramètres d'entrée
    if (!req.body.AccessToken) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing AccessToken`);
        return res.status(400).json({ message: 'Missing AccessToken' });
    }
    if (!req.body.groupId) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing groupId`);
        return res.status(400).json({ message: 'Missing groupId' });
    }
    if (!req.file) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing file in request`);
        return res.status(400).json({ message: 'Missing file' });
    }

    verifyAuth(req.body.AccessToken).then(result => {
        const userId = extractSubFromJWT(req.body.AccessToken);
        const groupId = req.body.groupId;

        // Vérification du groupe de l'utilisateur
        checkGroup(userId, groupId).then(resolve => {
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

            // Création du fichier dans la base de données
            file.create(fileData).then(result => {
                const fileId = result._id.toString("hex");

                // Création des droits d'accès pour le fichier
                createRight(fileId, groupId).then(idRight => {
                    const outputFilePath = path.join(__dirname, '../uploads', fileId);
                    // Écriture du fichier chiffré sur le disque
                    fs.writeFile(outputFilePath, encryptedBuffer, (err) => {
                        if (err) {
                            console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while the user : ${userId} for the group : ${groupId} was writing the file: ${err}`);
                            return res.status(501).json({ message: 'Internal Error during the upload' });
                        }
                        // Mise à jour des informations du fichier avec les droits d'accès
                        file.updateOne({ _id: fileId }, { $set: { right: idRight } }).then(resolve => {
                            console.log(`[${new Date().toISOString()}] [INFO] - File uploaded successfully: ${fileId} by user : ${userId} for the group : ${groupId}`);
                            return res.status(201).json({ message: "File correctly uploaded", fileId: fileId });
                        }).catch(error => {
                            console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while the user : ${userId} for the group : ${groupId} was updating file data: ${error}`);
                            return res.status(501).json({ message: 'Internal Error during the upload' });
                        });
                    });
                }).catch(error => {
                    return res.status(501).json({ message: 'Internal Error during the upload' });
                });
            }).catch(error => {
                return res.status(501).json({ message: 'Internal Error during the upload' });
            });
        }).catch(error => {
            return res.status(401).json({ message: error.data });
        });
    }).catch(error => {
        return res.status(401).json({ message: error.data });
    });
});

module.exports = router;