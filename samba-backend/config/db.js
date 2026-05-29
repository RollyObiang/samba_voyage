const { Pool } = require('pg');

// 1. Détermination de la chaîne de connexion
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    // Si DATABASE_URL n'existe pas, on assemble proprement les variables individuelles
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT || 5432;
    const dbName = process.env.DB_NAME;

    if (!user || !password || !host || !dbName) {
        console.error("❌ ERREUR CRITIQUE : Les variables de configuration Neon sont introuvables sur Vercel !");
    }

    connectionString = `postgresql://${user}:${password}@${host}:${port}/${dbName}?sslmode=require`;
}

// 2. Initialisation du Pool avec SSL forcé pour Neon
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Obligatoire pour le cloud (Neon/Vercel)
    }
});

// 3. Test de connexion léger pour éviter de bloquer le démarrage de la fonction Serverless
pool.query('SELECT NOW()')
    .then(() => console.log('🚀 Base de données Neon connectée avec succès !'))
    .catch(err => console.error('❌ Échec de la connexion à Neon :', err.message));

module.exports = pool;