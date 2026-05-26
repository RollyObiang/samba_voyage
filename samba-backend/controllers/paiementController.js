const pool = require('../config/db');

exports.validerPaiement = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id_contrat, montant, mode_paiement, ref_transaction } = req.body;
        await client.query('BEGIN');

        // Enregistrer le paiement
        const resPaiement = await client.query(
            "INSERT INTO paiement (id_contrat, montant, mode_paiement, ref_transaction, statut_paiement, date_paiement) VALUES ($1, $2, $3, $4, 'Succès', NOW()) RETURNING *",
            [id_contrat, montant, mode_paiement, ref_transaction]
        );

        // Activer la police
        await client.query("UPDATE polices_assurance SET statut_police = 'VALIDE' WHERE id = $1", [id_contrat]);

        await client.query('COMMIT');
        res.status(201).json({ message: "Contrat activé", paiement: resPaiement.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};