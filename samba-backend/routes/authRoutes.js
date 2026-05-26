const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const bcrypt = require('bcrypt');

// --- INSCRIPTION ---
router.post('/register', async (req, res) => {
    try {
        const { nom_complet, email, mot_de_passe, role } = req.body;

        // 1. Vérifier si l'utilisateur existe déjà
        const userExists = await pool.query("SELECT * FROM utilisateurs WHERE email = $1", [email.toLowerCase()]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        // 2. Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(mot_de_passe, salt);

        // 3. Insertion (on force l'email en minuscule et un rôle par défaut si vide)
        const userRole = role ? role.toLowerCase() : 'client';
        
        const newUser = await pool.query(
            "INSERT INTO utilisateurs (nom_complet, email, mot_de_passe, role) VALUES ($1, $2, $3, $4) RETURNING id, nom_complet, email, role",
            [nom_complet, email.toLowerCase(), hashedPwd, userRole]
        );

        res.status(201).json({ 
            message: "Utilisateur créé avec succès !", 
            user: newUser.rows[0] 
        });

    } catch (err) {
        console.error("Erreur Register:", err.message);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    console.log("--- TENTATIVE DE CONNEXION ---");
    try {
        const { email, password } = req.body;
        console.log("1. Email reçu:", email);
        console.log("2. Password reçu:", password);

        // Recherche l'utilisateur
        const result = await pool.query("SELECT * FROM utilisateurs WHERE LOWER(email) = LOWER($1)", [email]);

        if (result.rows.length === 0) {
            console.log("ERREUR: Email non trouvé en base");
            return res.status(401).json({ error: "Identifiants incorrects" });
        }

        const user = result.rows[0];
        console.log("3. Utilisateur trouvé:", user.email);
        console.log("4. Hash en base:", user.mot_de_passe);

        // TEST DE SECOURS : Si le mdp est "123456" en clair ou haché
        const validPassword = await bcrypt.compare(password, user.mot_de_passe);
        console.log("5. Comparaison Bcrypt:", validPassword);

        if (!validPassword) {
            console.log("ERREUR: Le mot de passe ne correspond pas au hash");
            return res.status(401).json({ error: "Identifiants incorrects" });
        }

        console.log("OK: Connexion réussie pour", user.role);
        res.json({ 
            user: { 
                id: user.id, 
                nom: user.nom_complet, 
                role: user.role.toLowerCase() 
            } 
        });

    } catch (err) {
        console.error("CRASH SERVEUR:", err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// --- RÉCUPÉRER TOUS LES PARTENAIRES (AGENCES & AFA) ---
router.get('/utilisateurs', async (req, res) => {
    try {
        // On récupère tout le monde sauf les 'admin' pour la liste des partenaires
        // Si tu veux tout le monde, retire juste le WHERE
        const result = await pool.query(
            "SELECT id, nom_complet, email, role FROM utilisateurs WHERE role != 'admin' ORDER BY nom_complet ASC"
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur récupération utilisateurs:", err.message);
        res.status(500).json({ error: "Erreur lors de la récupération des partenaires" });
    }
});
  

module.exports = router;