// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const axios = require('axios');

const file = require('./file');
const getToken = require('../model/getToken');

const checkRight = function(userId,fileId) {
    return new Promise((resolve, reject) => {
        file.findOne({_id:fileId})
            .then(file => {
                if (!file) {
                    return reject('File not found');
                }
                const rightId = file.right;
                getToken().then(({accessToken,csrfCookie})=>{
                    axios.get(`${process.env.RUGM_HOST}/api/user/check?csrfCookie=`+csrfCookie+"&UserId="+userId+"&RightId="+rightId, {
                        headers: {
                            'Cookie': `csrfCookie=${csrfCookie}; AccessToken=${accessToken}`
                        }
                    })
                    .then(response => {
                        const isRightGranted = response.data;
                        if (isRightGranted) {
                            return resolve({ message: 'Right granted', RightId:rightId });
                        }else{
                            return reject('User have no right on this file');
                        }
                    })
                    .catch(error => {
                        console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                        if (error.response) {
                            return reject('Error : Can not check client right');
                        } else {
                            return reject('Error : Can not check client right');
                        }
                    });
                })
                .catch(error => {
                    return reject(error);
                });
            })
            .catch(error => {
                console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                return reject("Error : File not found");
            });
    });
};

module.exports = checkRight;
