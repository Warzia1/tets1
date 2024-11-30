const axios = require('axios');

const RUGM_API_BASE_URL = 'http://rugm.ensibs.fr:5000/api';

// Fonction d'authentification avec le compte d'application
async function authenticateApp() {
    const appUsername = 'GdMaq';
    const appPassword = 'uhbefAOZUFEHBAZE514';
    try {
        console.log("Authentification de l'application GdMaq...");
        const response = await axios.post(`${RUGM_API_BASE_URL}/auth`, {
            login: appUsername,
            password: appPassword,
        });

        const setCookieHeader = response.headers['set-cookie'];
        if (!setCookieHeader) {
            throw new Error("Aucun cookie reçu pour l'application");
        }

        const accessToken = setCookieHeader.find(cookie => cookie.startsWith('AccessToken=')).match(/AccessToken=([^;]+)/)[1];
        const refreshToken = setCookieHeader.find(cookie => cookie.startsWith('RefreshToken=')).match(/RefreshToken=([^;]+)/)[1];
        let csrfCookie = setCookieHeader.find(cookie => cookie.startsWith('csrfCookie=')).match(/csrfCookie=([^;]+)/)[1];

        // Supprimer le dernier caractère '=' s'il est présent, puis ajouter '%3D'
        if (csrfCookie.endsWith('=')) {
            csrfCookie = csrfCookie.slice(0, -1);
        }
        const csrfToken = `${csrfCookie}%3D`;

        console.log("Tokens reçus de l'application :", { accessToken, refreshToken, csrfCookie, csrfToken });
        return { accessToken, refreshToken, csrfCookie, csrfToken };
    } catch (error) {
        console.error("Erreur lors de l'authentification de l'application :", error.message);
        throw error;
    }
}

// Fonction pour rafraîchir le token d'accès si nécessaire
async function refreshAccessToken(refreshToken) {
    try {
        const response = await axios.post(`${RUGM_API_BASE_URL}/auth/refresh`, null, {
            headers: {
                'Cookie': `RefreshToken=${refreshToken}`,
            },
        });

        const newAccessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('AccessToken=')).match(/AccessToken=([^;]+)/)[1];
        return newAccessToken;
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token d'accès :", error.message);
        throw error;
    }
}


// Vérification des droits d'un utilisateur spécifique
async function checkUserRight(appTokens, userId, rightId) {
    try {
        
        const cookieHeader = `AccessToken=${appTokens.accessToken}; RefreshToken=${appTokens.refreshToken}; csrfCookie=${appTokens.csrfCookie}`;
        const response = await axios.get(`${RUGM_API_BASE_URL}/user/check`, {
            headers: {
                'Authorization': `Bearer ${appTokens.accessToken}`,
                'Cookie': cookieHeader,
                'Accept': 'application/json'
            },
            params: {
                UserId: userId,
                RightId: rightId,
                csrfToken: appTokens.csrfToken
            }
        });

        return response.data === true;
    } catch (error) {
        console.error("Erreur lors de la vérification des droits :", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Connexion automatique de l'utilisateur admin avec vérification des droits via l'application
async function autoLoginAdmin(req) {
    const userId = "1d00c8a1-d2c8-4a12-b0d3-05e5d3b5c1b8"; // ID de test_admin
    const rightId = "b85067e2-949f-4a7a-8d99-2bcc5e0ff4b5"; // ID de full_access

    try {
        const appTokens = await authenticateApp();

        // Vérifie les droits pour cet utilisateur avec l'API
        const hasFullAccess = await checkUserRight(appTokens, userId, rightId);
        
        // Si `hasFullAccess` est `true`, stocke les droits dans la session.
        req.session.userRights = hasFullAccess;
    } catch (error) {
        console.error("Erreur lors de la connexion automatique de test_admin :", error.message);
        throw error;
    }
}

module.exports = { authenticateApp, autoLoginAdmin, checkUserRight, refreshAccessToken };

