const axios = require('axios');

// Fonction pour obtenir la liste des droits de l'utilisateur depuis RUGM
async function getUserRights(accessToken, csrfCookie) {
    try {
        // Envoie une requête GET à l'API de RUGM pour récupérer les droits de l'utilisateur
        const response = await axios.get('http://rugm.ensibs.fr:5000/api/user/right_list', {
            headers: {
                // Utilise le jeton d'accès et le cookie CSRF dans les en-têtes pour authentifier la requête
                'Authorization': `Bearer ${accessToken}`,
                'Cookie': `csrfCookie=${csrfCookie}`,
                'Accept': 'application/json' 
            }
        });
        // Retourne la liste des droits récupérée de la réponse
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des droits :", error.response ? error.response.data : error.message);
        throw new Error("Erreur lors de la récupération des droits");
    }
}

// Middleware pour vérifier les permissions d'accès d'un utilisateur à une ressource spécifique
function checkPermission(permissionId) {
    return (req, res, next) => {
        // Récupère les droits de l'utilisateur stockés dans la session
        const hasAccess = req.session.userRights;

        // Si l'utilisateur a les droits nécessaires, il est autorisé à continuer
        if (hasAccess === true) {
            next();
        } else {
            console.error("Accès refusé : Droits non accordés ou droits non trouvés dans la session.");
            res.status(403).send("Vous n'avez pas la permission d'accéder à cette ressource.");
        }
    };
}

module.exports = checkPermission;
