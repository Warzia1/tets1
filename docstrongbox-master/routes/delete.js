const multer = require("multer");
const express = require("express");
const fs = require('fs');
const path = require('path');

const file = require('../model/file');
const verifyAuth = require('../model/verifyAuth');
const checkRight = require('../model/checkRight');
const deleteRight = require('../model/deleteRight');
const extractSubFromJWT = require('../model/jwt');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.delete("/", (req, res) => {
    const { fileId, AccessToken} = req.body;

    // Vérification des entrées requises
    if (!fileId) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing fileId`);
        return res.status(400).json({ message: 'Missing fileId' });
    }
    if (!AccessToken) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing AccessToken`);
        return res.status(400).json({ message: 'Missing AccessToken' });
    }

    verifyAuth(AccessToken)
        .then(result => {
            const userId = extractSubFromJWT(AccessToken);
            checkRight(userId, fileId).then(resolve => {
                const rightId = resolve.RightId;
                deleteRight(rightId)
                    .then(() => {
                        file.deleteOne({ _id: fileId })
                            .then(() => {
                                const outputFilePath = path.join(__dirname, '../uploads', fileId);
                                fs.unlink(outputFilePath,(err)=>{
                                    if(err){
                                        console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while deleting the file: ${error} for user : ${userId}`);
                                        return res.status(501).json({ message: 'Internal error while deleting the file' });
                                    }
                                    console.log(`[${new Date().toISOString()}] [INFO] - File deleted successfully: ${fileId} by user : ${userId}`);
                                    return res.status(200).json({ message: "File successfully deleted" });
                                })
                            })
                            .catch(error => {
                                console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while deleting the file data: ${error} for user : ${userId}`);
                                return res.status(501).json({ message: 'Internal error while deleting the file' });
                            });
                    })
                    .catch(error => {
                        console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while deleting right: ${error} for user : ${userId}`);
                        return res.status(501).json({ message: 'Internal error while deleting rights' });
                    });
            }).catch(error => {
                console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while checking rights: ${error} for user : ${userId}`);
                return res.status(401).json({ message: error });
            });
        })
        .catch(error => {
            console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred during authentication: ${error}`);
            return res.status(401).json({ message: error });
        });
});

module.exports = router;
