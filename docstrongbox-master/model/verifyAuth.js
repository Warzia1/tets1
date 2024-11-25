// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const axios = require('axios');

const verifyAuth = function(token){
    return new Promise((resolve, reject) => {
        if(token){
            axios.post(process.env.RUGM_HOST+'/api/auth/check', {
                token: token
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then(response => {
                const { isCorrect, isNotExpired } = response.data;
                if(!isCorrect){
                  console.error(`[${new Date().toISOString()}] [ERROR] - Bad Token`);
                    return reject('Bad Token');
                }
                if(!isNotExpired){
                  console.error(`[${new Date().toISOString()}] [ERROR] - Token Expired`);
                  return reject('Token Expired');
                }
                return resolve('User well authentificated');
              })
              .catch(error => {
                console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                if (error.response) {
                  return reject('Error : Can not authenticate client');
                } else {
                  return reject('Error : Can not authenticate client');
                }
              });
        }else{
            console.error(`[${new Date().toISOString()}] [ERROR] - Missing token`);
            return reject("Error: Missing token")
        }
    })
}

module.exports = verifyAuth;
