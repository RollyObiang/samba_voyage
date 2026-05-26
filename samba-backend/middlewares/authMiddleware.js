exports.verifierRole = (roleAttendu) => {
    return (req, res, next) => {
        // Logique simplifiée pour ton projet (on pourrait vérifier un token JWT ici)
        const userRole = req.headers['role']; 
        if (userRole === roleAttendu) {
            next();
        } else {
            res.status(403).json({ error: "Accès refusé" });
        }
    };
};

