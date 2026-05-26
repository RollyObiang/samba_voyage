const pool = require('../config/db');

const creerNouveau = async (req, res) => {
    console.log("📥 [DÉBUT INSERTION] Données reçues du frontend :", req.body);

    try {
        const { 
            souscripteur_nom, passeport_numero, destination, 
            zone, date_effet, date_echeance, date_naissance, 
            montant, mode_paiement 
        } = req.body;

        const num_police = `SV-${Math.floor(10000 + Math.random() * 90000)}`;

        const query = `
            INSERT INTO polices_assurance 
            (numero_police, souscripteur_nom, passeport_numero, destination, zone, date_effet, date_echeance, date_naissance, montant, mode_paiement, cree_le) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) 
            RETURNING *`;

        const values = [
            num_police, 
            souscripteur_nom, 
            passeport_numero, 
            destination, 
            zone, 
            date_effet || null, 
            date_echeance || null, 
            date_naissance || null, 
            montant || 0, 
            mode_paiement
        ];

        console.log("📝 Exécution de la requête SQL avec les valeurs :", values);

        const result = await pool.query(query, values);

        console.log("✅ [SUCCÈS] Ligne ajoutée avec l'ID :", result.rows[0].id);
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("❌ [ERREUR SQL] :", err.message);
        res.status(500).json({ error: err.message });
    }
};

const getListe = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM polices_assurance ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { creerNouveau, getListe };