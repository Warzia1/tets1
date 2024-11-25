// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const axios = require('axios');

const getToken = require('../model/getToken');

const createRight = (fileId,groupId) => {
    return new Promise((resolve, reject) => {
        const API_URL = process.env.RUGM_HOST;
        
        getToken().then(({accessToken,csrfCookie})=>{
            if (!accessToken || !csrfCookie) {
                return reject("Error: Missing AccessToken or CSRF Cookie");
            }
            axios.post(API_URL+`/api/right?csrfToken=${csrfCookie}`, JSON.stringify({
                label: "File : " + fileId,
                description: "DocStrongBox Access to file: " + fileId
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `csrfCookie=${csrfCookie}; AccessToken=${accessToken}`
                }
            })
            .then(response => {
                if (response.data && response.data[0]) {
                    const rightId = response.data[0]
                    axios.post(API_URL+`/api/group/right?csrfToken=${csrfCookie}`,{
                        GroupId: groupId,
                        RightId: rightId
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': `csrfCookie=${csrfCookie}; AccessToken=${accessToken}`
                        }
                    })
                    .then(response=>{
                        return resolve(rightId);
                    }).catch(error=>{
                        console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                        return reject("Error during linking right and group")
                    }) 
                } else {
                    return reject("Error: No ID returned");
                }
            })
            .catch(error => {
                console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                return reject("Error : can't create the right for the client");
            });
        })
        .catch(error => {
            console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
            return reject("Error : can't create the right for the client");
        });
    });
};

module.exports = createRight;
