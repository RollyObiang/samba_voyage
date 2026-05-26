const express = require('express');
const router = express.Router(); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // On utilise 'db' comme import principal

// --- 1. CONFIGURATION DOSSIER UPLOADS ---
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// --- 2. CONFIGURATION MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadDir); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ==========================================
// --- 3. ROUTES POUR LES CONTRATS ---
// ==========================================

// --- CRÉATION DE CONTRAT ---
router.post('/creer', async (req, res) => {
    const { nom, prenom, passeport_numero, destination, montant, identifiant_client, date_effet, date_echeance } = req.body;
    const passwordParDefaut = "Password1234"; 
    const numero_police = "SV-" + Math.floor(Math.random() * 900000);
    try {
        const clientRes = await db.query(
            `INSERT INTO clients (nom, prenom, passeport, mot_de_passe) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (passeport) DO UPDATE SET nom = EXCLUDED.nom 
             RETURNING id_client`,
            [nom, prenom, passeport_numero, passwordParDefaut]
        );
        const id_client = clientRes.rows[0].id_client;
        const result = await db.query(
            `INSERT INTO polices_assurance 
            (numero_police, destination, souscripteur_nom, statut_police, montant, identifiant_client, date_effet, date_echeance, id_client) 
             VALUES ($1, $2, $3, 'Validé', $4, $5, $6, $7, $8) 
             RETURNING *`,
            [numero_police, destination, `${nom} ${prenom}`, montant || 0, identifiant_client, date_effet, date_echeance, id_client]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DASHBOARD AGENCE (Indispensable pour ListeContrats.js) ---
router.get('/dashboard-agence', async (req, res) => {
    try {
        // On s'assure de renvoyer les colonnes que React attend
        const result = await db.query('SELECT * FROM polices_assurance ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur dashboard-agence:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- CONNEXION CLIENT ---
router.post('/login-client', async (req, res) => {
    const identifiant = req.body.identifiant ? req.body.identifiant.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";
    try {
        const policeRes = await db.query("SELECT * FROM polices_assurance WHERE TRIM(identifiant_client) = $1", [identifiant]);
        if (policeRes.rows.length === 0) return res.status(401).json({ success: false, message: "Identifiant inconnu." });
        const police = policeRes.rows[0];
        const clientRes = await db.query("SELECT * FROM clients WHERE id_client = $1", [police.id_client]);
        const client = clientRes.rows[0];
        if (client && client.mot_de_passe === password) {
            res.json({ success: true, client: { ...police, nom: client.nom, prenom: client.prenom } });
        } else {
            res.status(401).json({ success: false, message: "Mot de passe incorrect." });
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ==========================================
// --- 4. GESTION DES SINISTRES ---
// ==========================================

// --- LISTE DES SINISTRES ---
router.get('/liste-sinistres', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM sinistres ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RÉCUPÉRER UN SINISTRE ---
router.get('/sinistre/:id', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM sinistres WHERE id = $1", [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4c. MISE À JOUR DU STATUT AVEC GESTION DE FICHIER (VERSION CORRIGÉE) ---
// On ajoute upload.single('document') pour que multer puisse lire le FormData
router.put('/valider-sinistre/:id', upload.single('document'), async (req, res) => {
    const { id } = req.params;
    const { nouveauStatut, commentaire } = req.body; 
    
    // Si un nouveau fichier est envoyé, on récupère son chemin
    const justificatif_url = req.file ? req.file.path.replace(/\\/g, '/') : null;

    try {
        const statutFinal = nouveauStatut || 'ATTENTE_AFA';

        // Mise à jour du statut et du commentaire (et du fichier si présent)
        let sql;
        let params;

        if (justificatif_url) {
            sql = "UPDATE sinistres SET statut = $1, description = $2, justificatif_url = $3 WHERE id = $4";
            params = [statutFinal, commentaire, justificatif_url, id];
        } else {
            // Si pas de nouveau fichier, on met juste à jour le statut et le commentaire (ou description)
            sql = "UPDATE sinistres SET statut = $1, description = $2 WHERE id = $3";
            params = [statutFinal, commentaire, id];
        }

        await db.query(sql, params);
        
        console.log(`🚀 Dossier ${id} mis à jour : ${statutFinal} avec commentaire.`);
        res.json({ 
            success: true, 
            message: `Dossier mis à jour avec le statut : ${statutFinal}`,
            file: justificatif_url 
        });
    } catch (err) {
        console.error("❌ Erreur SQL lors de la validation:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- AJOUTE LA ROUTE DE REJET ICI ---
router.put('/rejeter-sinistre/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`🚫 Rejet du dossier ID: ${id}`);

    try {
        // On change le statut en 'REJETE'
        const sql = "UPDATE sinistres SET statut = 'REJETE' WHERE id = $1";
        await db.query(sql, [id]);
        
        res.json({ success: true, message: "Le sinistre a été rejeté par l'AFA" });
    } catch (err) {
        console.error("❌ Erreur SQL Rejet:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- ROUTE POUR VALIDER LE PAIEMENT (BOUTON CONFIRMER) ---
router.put('/valider-paiement/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // On met 'APPROUVE' en majuscules pour la base de données
        await db.query("UPDATE sinistres SET statut = 'APPROUVE' WHERE id = $1", [id]);
        res.json({ success: true, message: "Dossier approuvé et payé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DÉCLARER UN SINISTRE ---
router.post('/declarer-sinistre', upload.single('justificatif'), async (req, res) => {
    const { police_id, nom_client, type_incident, description, latitude, longitude, identifiant_client } = req.body;
    const justificatif_url = req.file ? req.file.path.replace(/\\/g, '/') : null;
    try {
        const result = await db.query(
            `INSERT INTO sinistres (police_id, nom_client, type_incident, description, justificatif_url, latitude, longitude, statut, identifiant_client) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'OUVERT', $8) RETURNING *`,
            [police_id, nom_client, type_incident, description, justificatif_url, latitude, longitude, identifiant_client]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- STATS GLOBALES POUR L'ADMIN ---
router.get('/admin/stats', async (req, res) => {
    try {
        const stats = await db.query(`
            SELECT 
                (SELECT SUM(montant) FROM polices_assurance) as "totalCA",
                (SELECT COUNT(*) FROM polices_assurance) as "totalPolices",
                (SELECT COUNT(*) FROM sinistres WHERE statut = 'OUVERT') as "alertesSinistres"
        `);
        // On renvoie 0 si le CA est null (pour éviter les erreurs d'affichage)
        const data = stats.rows[0];
        data.totalCA = data.totalCA || 0;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LISTE DE TOUS LES CLIENTS/CONTRATS ---
router.get('/clients', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                id, 
                souscripteur_nom as nom, 
                numero_police, 
                destination, 
                statut_police as statut, 
                created_at 
            FROM polices_assurance 
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- MISE À JOUR D'UN CONTRAT (Appelé par la modale Admin) ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    // On récupère les champs envoyés par React
    const { souscripteur_nom, nom_client, montant, statut } = req.body;
    
    try {
        const sql = `
            UPDATE polices_assurance 
            SET souscripteur_nom = $1, montant = $2, statut_police = $3 
            WHERE id = $4 
            RETURNING *`;
        
        // On prend soit souscripteur_nom soit nom_client (selon ce qui est rempli)
        const result = await db.query(sql, [souscripteur_nom || nom_client, montant, statut, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Contrat non trouvé" });
        }

        console.log(`✅ Contrat ${id} mis à jour`);
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("❌ Erreur Update Contrat:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// --- MISE À JOUR D'UN SINISTRE (Correction : Colonnes réelles) ---
router.put('/sinistres/:id', async (req, res) => {
    const { id } = req.params;
    // On récupère les champs qui existent vraiment dans ta table
    const { statut, description, justificatif_url, nom_client } = req.body;

    try {
        const sql = `
            UPDATE sinistres 
            SET statut = $1, 
                description = $2, 
                justificatif_url = $3,
                nom_client = $4
            WHERE id = $5 
            RETURNING *`;

        const params = [
            statut, 
            description || '', 
            justificatif_url || null, 
            nom_client,
            id
        ];

        const result = await db.query(sql, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Sinistre non trouvé" });
        }

        console.log(`✅ Sinistre ${id} mis à jour (Statut & Description)`);
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("❌ Erreur Update Sinistre:", err.message);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;