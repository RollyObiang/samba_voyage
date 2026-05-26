const pool = require('../config/db');

// 1. Déclarer un sinistre (Utilisé par le Client)
const declarerSinistre = async (req, res) => {
    try {
        const { police_id, type_incident, description } = req.body;

        const query = `
            INSERT INTO sinistres (police_id, type_sinistre, description, statut, cree_le)
            VALUES ($1, $2, $3, 'EN_ATTENTE_AFA', NOW())
            RETURNING *`;

        const values = [police_id, type_incident, description];
        const result = await pool.query(query, values);

        console.log("📢 ALERTE : Nouveau sinistre reçu et transmis à l'AFA !");
        
        res.status(201).json({
            message: "Déclaration transmise à Africa First Assist",
            sinistre: result.rows[0]
        });
    } catch (err) {
        console.error("Erreur déclaration sinistre:", err.message);
        res.status(500).json({ error: "Erreur lors de la déclaration" });
    }
};

// 2. Récupérer tous les sinistres (Utilisé par l'AFA et le Dashboard)
const getAllSinistres = async (req, res) => {
    try {
        const query = `SELECT * FROM sinistres ORDER BY cree_le DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des sinistres:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// 3. AFA demande confirmation à Samba Voyage
const solliciterSamba = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            UPDATE sinistres 
            SET statut = 'EN_ATTENTE_CONFIRMATION_SAMBA' 
            WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Samba confirme la reconnaissance
const confirmerSamba = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            UPDATE sinistres 
            SET statut = 'VALIDE_PAR_SAMBA', samba_confirmation = TRUE 
            WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CRUCIAL : On exporte TOUTES les fonctions
module.exports = { 
    declarerSinistre, 
    getAllSinistres, 
    solliciterSamba, 
    confirmerSamba 
};