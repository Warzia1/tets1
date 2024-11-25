const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require("express");

const file = require('../model/file');
const verifyAuth = require('../model/verifyAuth');
const checkRight = require('../model/checkRight');
const extractSubFromJWT = require('../model/jwt');

const router = express.Router();

router.get("/", (req, res) => {
    const fileId = req.query.fileId;
    const AccessToken = req.query.AccessToken;

    // Vérification des entrées requises
    if (!fileId) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing fileId`);
        return res.status(400).json({ message: 'Missing fileId' });
    }
    if (!AccessToken) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing AccessToken`);
        return res.status(400).json({ message: 'Missing AccessToken' });
    }

    // Authentification
    verifyAuth(AccessToken).then(result => {
        const userId = extractSubFromJWT(AccessToken);
        // Vérification des droits d'accès
        checkRight(userId, fileId).then(resolve => {
            file.findOne({ "_id": fileId }).then(result => {
                if (!result) {
                    console.error(`[${new Date().toISOString()}] [ERROR] - File not found with ID: ${fileId} requested by user : ${userId}`);
                    return res.status(404).json({ message: "File not found" });
                }

                const fileData = result;
                const filePath = path.join(__dirname, '../uploads', fileId);

                fs.readFile(filePath, (error, encryptedBuffer) => {
                    if (error) {
                        console.error(`[${new Date().toISOString()}] [ERROR] - Error reading file: ${error} requested by user : ${userId}`);
                        return res.status(500).json({ message: "Error reading file" });
                    }

                    let decipher = null;
                    let iv = null;
                    switch (fileData.sensitivity) {
                        case "high":
                            iv = encryptedBuffer.slice(0, 16);
                            decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(fileData.key, 'hex'), iv);
                            break;
                        case "low":
                            iv = encryptedBuffer.slice(0, 16);
                            decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(fileData.key, 'hex'), iv);
                            break;
                        default: // medium
                            iv = encryptedBuffer.slice(0, 8);
                            decipher = crypto.createDecipheriv('des-ede3-cbc', Buffer.from(fileData.key, 'hex'), iv);
                            break;
                    }

                    const decrypted = Buffer.concat([decipher.update(encryptedBuffer.slice(iv.length)), decipher.final()]);
                    file.updateOne({ "_id": fileId }, { $inc: { "downloadCount": 1 } }).then(() => {
                        res.setHeader('Content-Disposition', `attachment; filename=${fileData.originalName}`);
                        res.setHeader('Content-Type', 'application/octet-stream');
                        console.log(`[${new Date().toISOString()}] [INFO] - File downloaded successfully: ${fileId} by user : ${userId}`);
                        return res.send(decrypted);
                    }).catch(error => {
                        console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while updating download count: ${error} for user : ${userId}`);
                        return res.status(500).json({ message: "Internal Error" });
                    });
                });
            }).catch(error => {
                console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while finding the file: ${error} for user : ${userId}`);
                return res.status(501).json({ message: "Internal Error" });
            });
        }).catch(error => {
            console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while checking rights: ${error} for user : ${userId}`);
            return res.status(401).json({ message: error });
        });
    }).catch(error => {
        console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred during authentication: ${error}`);
        return res.status(401).json({ message: error });
    });
});

module.exports = router;