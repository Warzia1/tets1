const express = require("express");

const file = require('../model/file');
const verifyAuth = require('../model/verifyAuth');
const getRights = require('../model/getRights');
const extractSubFromJWT = require('../model/jwt');

const router = express.Router();

router.get("/files", (req, res) => {
    const AccessToken = req.query.AccessToken;

    if (!AccessToken) {
        console.error(`[${new Date().toISOString()}] [ERROR] - Missing AccessToken`);
        return res.status(400).json({ message: 'Missing AccessToken' });
    }
    verifyAuth(AccessToken).then(result => {
        const userId = extractSubFromJWT(AccessToken);
        getRights(userId).then(response => {
            file.find({'right':{ $in: response}},{_id:1,originalName:1,downloadCount:1,sensitivity:1}).then(response=>{
                console.log(`[${new Date().toISOString()}] [INFO] - Files successfully fetchedby user : ${userId}`);
                return res.status(200).json(response);
            }).catch(error=>{
                console.error(`[${new Date().toISOString()}] [ERROR] - An error occurred while the user : ${userId} was fetching file wich he had access to : ${error}`);
                return res.status(501).json({ message: "Internal error while was fetching file wich he had access to" });
            })
        }).catch(error=>{
            return res.status(501).json({ message: "Internal error while getting rights" });
        })
    }).catch(error => {
        return res.status(501).json({ message: "Internal error while getting rights" });
    });
});

module.exports= router;