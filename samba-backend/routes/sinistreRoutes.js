// --- ROUTES ---

// 1. Route pour enregistrer le sinistre
router.post('/declarer-sinistre', upload.single('justificatif'), async (req, res) => {
    const { police_id, nom_client, type_incident, description } = req.body;
    const justificatif_url = req.file ? req.file.path : null;

    try {
        // Log pour vérifier ce qui arrive au serveur
        console.log("📥 Tentative d'insertion sinistre pour:", nom_client);

        const query = `
            INSERT INTO sinistres (police_id, nom_client, type_incident, description, justificatif_url, statut) 
            VALUES ($1, $2, $3, $4, $5, 'OUVERT') 
            RETURNING *`;
            
        const values = [police_id, nom_client, type_incident, description, justificatif_url];
        const result = await pool.query(query, values);
        
        console.log("✅ Sinistre inséré ID:", result.rows[0].id);
        res.status(201).json({ message: "Succès", sinistre: result.rows[0] });
    } catch (err) {
        console.error("❌ ERREUR INSERTION SQL:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 2. Route pour l'Espace Client (Celle qui affiche 0 actuellement)
router.get('/liste-sinistres', async (req, res) => {
    try {
        console.log("🔍 Lecture de la table sinistres...");
        
        // TEST : On essaie sans le ORDER BY pour voir si c'est la colonne 'cree_le' qui pose problème
        const result = await pool.query('SELECT * FROM sinistres');
        
        console.log(`📊 Données récupérées: ${result.rows.length} lignes`);
        res.json(result.rows);
    } catch (err) {
        console.error("❌ ERREUR LECTURE SQL:", err.message);
        res.status(500).json({ error: err.message });
    }
});