const bcrypt = require('bcrypt');
const pool = require('./config/db');

async function createAdmin() {
    const saltRounds = 10;
    const plainPassword = 'admin2024';
    
    // On crypte le mot de passe avant de l'envoyer en base
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    try {
        // On supprime l'ancien compte admin s'il existe pour éviter les doublons
        await pool.query("DELETE FROM utilisateurs WHERE email = 'admin@samba.com'");

        // On insère le nouveau avec le mot de passe crypté
        await pool.query(
            "INSERT INTO utilisateurs (nom_complet, email, mot_de_passe, role) VALUES ($1, $2, $3, $4)",
            ['Super Admin', 'admin@samba.com', hashedPassword, 'admin']
        );
        console.log("✅ Compte Admin créé avec succès avec mot de passe crypté !");
        process.exit();
    } catch (err) {
        console.error("❌ Erreur :", err.message);
        process.exit();
    }
}

createAdmin();