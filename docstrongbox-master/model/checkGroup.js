// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const axios = require('axios');
const getToken = require('../model/getToken');

const checkGroup = function(userId, groupId) {
    return new Promise((resolve, reject) => {
        const API_URL = process.env.RUGM_HOST;
        const USERNAME = process.env.USERNAME;
        const PASSWORD = process.env.PASSWORD;
        getToken().then(({accessToken,csrfCookie})=>{
            if (!accessToken || !csrfCookie) {
                return reject("Error: Missing AccessToken or CSRF Cookie");
            }
            axios.get(API_URL+`/api/groups/user?csrfToken=${csrfCookie}` ,{
                params: {
                    id: userId
                },
                headers:{
                    "Cookie":"csrfCookie=" + csrfCookie+"; AccessToken="+accessToken
                }
            })
            .then(response => {
                const groups = response.data[0];
                if(groups.includes(groupId)){
                    return resolve("The user is in the group");
                }else{
                    return reject("The user isn't in the group");
                }
            })
            .catch(error => {
                console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                return reject('Error : Can not check client group');
            });
        }).catch(error=>{
            return reject(error)
        })
    });
};

module.exports = checkGroup;
