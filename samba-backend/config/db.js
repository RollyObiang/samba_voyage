require('dotenv').config();
const { Pool } = require('pg');

// On reconstruit proprement la chaîne de connexion sans pooler
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Indispensable pour accepter le certificat SSL de Neon
    }
});

// Test de connexion au démarrage
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Erreur de connexion à la base Neon :', err.stack);
    } else {
        console.log('🚀 Connecté avec succès à la base Neon (Direct) !');
    }
});

module.exports = pool;