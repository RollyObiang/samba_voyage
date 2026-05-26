const pool = require('../config/db');

exports.inscription = async (req, res) => {
    try {
        const { nom_complet, email, mot_de_passe, nom_agence } = req.body;
        const nouvelUtilisateur = await pool.query(
            "INSERT INTO utilisateurs (nom_complet, email, mot_de_passe, role) VALUES ($1, $2, $3, 'agence') RETURNING id",
            [nom_complet, email, mot_de_passe]
        );
        const utilisateurId = nouvelUtilisateur.rows[0].id;
        await pool.query(
            "INSERT INTO agences (utilisateur_id, nom_agence) VALUES ($1, $2)",
            [utilisateurId, nom_agence]
        );
        res.status(201).json({ message: "Compte agence créé avec succès !" });
    } catch (err) {
        res.status(500).json({ error: "L'email existe peut-être déjà." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body; 
        const utilisateur = await pool.query(
            "SELECT id, nom_complet, role FROM utilisateurs WHERE (email = $1 OR nom_complet = $1) AND mot_de_passe = $2",
            [email, mot_de_passe]
        );
        if (utilisateur.rows.length > 0) {
            res.json({ message: "Connexion réussie", user: utilisateur.rows[0] });
        } else {
            res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};