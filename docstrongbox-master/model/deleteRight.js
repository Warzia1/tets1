// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const axios = require("axios");
const getToken = require("../model/getToken");

const deleteRight = (rightId) => {
    return new Promise((resolve, reject) => {
        const API_URL = process.env.RUGM_HOST;

        getToken().then(({ accessToken, csrfCookie }) => {
            if (!accessToken || !csrfCookie) {
                return reject("Error: Missing AccessToken or CSRF Cookie");
            }

            axios.delete(API_URL + `/api/right?csrfToken=${csrfCookie}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `csrfCookie=${csrfCookie}; AccessToken=${accessToken}`
                },
                data: {
                    RightId: rightId
                }
            })
            .then(response => {
                if (response.status === 200) {
                    return resolve("Right successfully deleted");
                } else {
                    return reject("Error: Unexpected response status");
                }
            })
            .catch(error => {
                console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                return reject(`Error deleting right`);
            });
        })
        .catch(error => {
            console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
            return reject(`Authentication error`);
        });
    });
};

module.exports = deleteRight;
