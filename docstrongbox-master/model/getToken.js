// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

const axios = require('axios');

const verifyAuth = require('../model/verifyAuth');

const getToken = function(){
    return new Promise((resolve,reject)=>{
        const API_URL = process.env.RUGM_HOST;
        const USERNAME = process.env.USERNAME;
        const PASSWORD = process.env.PASSWORD;
        const CSRF_COOKIE = getToken.CSRF_COOKIE;
        const ACCESS_TOKEN = getToken.ACCESS_TOKEN;
        const REFRESH_TOKEN = getToken.REFRESH_TOKEN;

        function getNewToken(){
            if(!REFRESH_TOKEN){
                axios.post(API_URL+'/api/auth', JSON.stringify({
                    login: USERNAME,
                    password: PASSWORD
                }), {
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => {
                    const setCookieHeader = response.headers['set-cookie'];
                    if (setCookieHeader) {                
                        const csrfCookie = setCookieHeader.find(cookie => cookie.startsWith('csrfCookie=')).replace('csrfCookie=', '').split(';')[0];
                        getToken.CSRF_COOKIE = csrfCookie;
                        const accessToken = setCookieHeader.find(cookie => cookie.startsWith('AccessToken=')).replace('AccessToken=', '').split(';')[0];
                        getToken.ACCESS_TOKEN = accessToken;
                        const refreshToken = setCookieHeader.find(cookie => cookie.startsWith('RefreshToken=')).replace('RefreshToken=', '').split(';')[0];
                        getToken.REFRESH_TOKEN = refreshToken;
                        return resolve({csrfCookie,accessToken});
                    }else{
                        return reject({message : "Bad authentication"})
                    }
                }).catch(error=>{
                    console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                    return reject({message : "Bad authentication"})
                })
            }else{
                axios.get(API_URL+'/api/auth/refresh', {
                    headers: { 'Content-Type': 'application/json',"Cookie":"AccessToken="+ACCESS_TOKEN+"; RefreshToken="+REFRESH_TOKEN}
                }).then(response => {
                    const setCookieHeader = response.headers['set-cookie'];
                    if (setCookieHeader) {                
                        const csrfCookie = setCookieHeader.find(cookie => cookie.startsWith('csrfCookie=')).replace('csrfCookie=', '').split(';')[0];
                        getToken.CSRF_COOKIE = csrfCookie;
                        const accessToken = setCookieHeader.find(cookie => cookie.startsWith('AccessToken=')).replace('AccessToken=', '').split(';')[0];
                        getToken.ACCESS_TOKEN = accessToken;
                        const refreshToken = setCookieHeader.find(cookie => cookie.startsWith('RefreshToken=')).replace('RefreshToken=', '').split(';')[0];
                        getToken.REFRESH_TOKEN = refreshToken;
                        return resolve({csrfCookie,accessToken});
                    }else{
                        return reject({message : "Bad authentication"})
                    }
                }).catch(error=>{
                    axios.post(API_URL+'/api/auth', JSON.stringify({
                    login: USERNAME,
                    password: PASSWORD
                }), {
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => {
                    const setCookieHeader = response.headers['set-cookie'];
                    if (setCookieHeader) {                
                        const csrfCookie = setCookieHeader.find(cookie => cookie.startsWith('csrfCookie=')).replace('csrfCookie=', '').split(';')[0];
                        getToken.CSRF_COOKIE = csrfCookie;
                        const accessToken = setCookieHeader.find(cookie => cookie.startsWith('AccessToken=')).replace('AccessToken=', '').split(';')[0];
                        getToken.ACCESS_TOKEN = accessToken;
                        const refreshToken = setCookieHeader.find(cookie => cookie.startsWith('RefreshToken=')).replace('RefreshToken=', '').split(';')[0];
                        getToken.REFRESH_TOKEN = refreshToken;
                        return resolve({csrfCookie,accessToken});
                    }else{
                        return reject({message : "Bad authentication"})
                    }
                }).catch(error=>{
                    axios.post(API_URL+'/api/auth', JSON.stringify({
                        login: USERNAME,
                        password: PASSWORD
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    }).then(response => {
                        const setCookieHeader = response.headers['set-cookie'];
                        if (setCookieHeader) {                
                            const csrfCookie = setCookieHeader.find(cookie => cookie.startsWith('csrfCookie=')).replace('csrfCookie=', '').split(';')[0];
                            getToken.CSRF_COOKIE = csrfCookie;
                            const accessToken = setCookieHeader.find(cookie => cookie.startsWith('AccessToken=')).replace('AccessToken=', '').split(';')[0];
                            getToken.ACCESS_TOKEN = accessToken;
                            const refreshToken = setCookieHeader.find(cookie => cookie.startsWith('RefreshToken=')).replace('RefreshToken=', '').split(';')[0];
                            getToken.REFRESH_TOKEN = refreshToken;
                            return resolve({csrfCookie,accessToken});
                        }else{
                            return reject({message : "Bad authentication"})
                        }
                    }).catch(error=>{
                        console.error(`[${new Date().toISOString()}] [ERROR] - ` + error);
                        return reject({message : "Bad authentication"})
                    })
                })
                })
            }
        }

        if(ACCESS_TOKEN){
            verifyAuth(ACCESS_TOKEN).then(response=>{
                const csrfCookie = CSRF_COOKIE;
                const accessToken = ACCESS_TOKEN;
                return resolve({csrfCookie,accessToken});
            }).catch(error=>{
                return getNewToken();
            })
        }else{
            return getNewToken();
        }
    });
}

module.exports = getToken;
