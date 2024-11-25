// ===============================================
// Code édité par : Baptiste COSTAMAGNA
// Contact : costamagna.e2101629@etud.univ-ubs.fr
// Membres ayant participer au projet : Aya Fsahi (e2305372@etud.univ-ubs.fr), Pierre Wadra (e2303942@etud.univ-ubs.fr)
// Date : 2024-11-08 22:54:22
// ===============================================

function decodeBase64Url(base64Url) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function extractSubFromJWT(token) {
    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error('Token JWT invalide');
    }

    const payload = JSON.parse(decodeBase64Url(parts[1]));

    const sub = payload.sub;

    return sub;
}

module.exports = extractSubFromJWT;
