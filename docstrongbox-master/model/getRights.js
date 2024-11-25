// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const axios = require('axios');

const file = require('./file');
const getToken = require('../model/getToken');

const getRights = function(userId){
    return new Promise((resolve,reject)=>{
        const API_URL = process.env.RUGM_HOST;
        const USERNAME = process.env.USERNAME;
        const PASSWORD = process.env.PASSWORD;
        getToken().then(({accessToken,csrfCookie})=>{
            if (!accessToken || !csrfCookie) {
                return reject("Error: Missing AccessToken or CSRF Cookie");
            }
            axios.get(`${API_URL}/api/user/right_list?csrfToken=${csrfCookie}&UserId=${userId}`, {
                headers: {
                    'Cookie': `csrfCookie=${csrfCookie}; AccessToken=${accessToken}`
                }
            }).then(response=>{
                return resolve(response.data[0]["droits"].map(item => item.idRight));
            }).catch(error=>{
                console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                return reject(error.data)
            })
        }).catch(error => {
            return reject(`Authentication error`);
        });
    })
}

module.exports = getRights;
