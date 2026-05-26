// Exemple de requête SQL pour le dashboard Admin
router.get('/stats', async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                SUM(montant) as "totalCA", 
                COUNT(*) as "totalPolices",
                (SELECT COUNT(*) FROM sinistres WHERE statut != 'TERMINE') as "alertesSinistres"
            FROM contrats
        `);
        res.json(stats.rows[0]);
    } catch (err) {
        res.status(500).json(err.message);
    }
});