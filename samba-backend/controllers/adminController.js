const pool = require('../config/db');

// Pour le Dashboard Samba
exports.getStatsGlobales = async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                (SELECT SUM(montant) FROM paiement WHERE statut_paiement = 'Succès') as total_ca,
                (SELECT COUNT(*) FROM polices_assurance) as total_polices,
                (SELECT COUNT(*) FROM sinistres WHERE statut_afa != 'DÉDOMMAGÉ') as sinistres_ouverts
        `);
        res.json({
            totalCA: stats.rows[0].total_ca || 0,
            totalPolices: stats.rows[0].total_polices || 0,
            alertesSinistres: stats.rows[0].sinistres_ouverts || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Pour la page Souscription (liste des zones et prix)
exports.getListeProduits = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM produits ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Pour la page Suivi Client (Recherche)
exports.rechercheClient = async (req, res) => {
    try {
        const { q } = req.query;
        const query = `
            SELECT p.*, pr.nom_produit 
            FROM polices_assurance p
            LEFT JOIN produits pr ON p.produit_id = pr.id
            WHERE p.souscripteur_nom ILIKE $1 
            OR p.numero_police ILIKE $1 
            OR p.passeport_numero ILIKE $1
        `;
        const result = await pool.query(query, [`%${q}%`]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};