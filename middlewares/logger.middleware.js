const authMiddleware = (req, res, next) => {
    const role = req.headers['authorization'];  // Exemple simple utilisant le header 'Authorization' pour le rôle

    // Vérifie si l'en-tête d'autorisation est présent
    if (!role) {
        return res.status(403).send('Authorization header required');
    }

    // Dictionnaire des rôles autorisés par méthode
    const methodRoles = {
        'GET': ['admin', 'user', 'employee'],  // Supposons que GET soit permis pour admin, user et employee
        'POST': ['admin'],
        'PUT': ['admin'],
        'DELETE': ['admin']
    };

    // Récupère la liste des rôles autorisés pour la méthode HTTP utilisée
    const allowedRoles = methodRoles[req.method];

    // Vérifie si le rôle fourni est autorisé pour la méthode HTTP utilisée
    if (!allowedRoles.includes(role)) {
        return res.status(403).send(`Access denied: Allowed for ${allowedRoles.join(', ')}`);
    }

    next();  // Tout est bon, passe au middleware/route suivant
};

module.exports = authMiddleware;
